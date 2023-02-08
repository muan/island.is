import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'
import { CmsContentfulService } from '@island.is/cms'
import {
  GenericUserLicense,
  GenericLicenseTypeType,
  GenericLicenseType,
  GenericUserLicenseFetchStatus,
  GenericUserLicenseStatus,
  PkPassVerification,
  GenericUserLicensePkPassStatus,
  GenericLicenseOrganizationSlug,
  GenericLicenseUserdata,
  GenericLicenseFetchResult,
  GenericUserLicensePayload,
  LICENSE_MAPPER_FACTORY,
  GenericLicenseMapper,
} from './licenceService.type'
import { Locale } from '@island.is/shared/types'
import { AVAILABLE_LICENSES } from './licenseService.module'
import {
  LicenseClient,
  LicenseClientService,
  LicenseType,
} from '@island.is/clients/license-client'

export type GetGenericLicenseOptions = {
  includedTypes?: Array<GenericLicenseTypeType>
  excludedTypes?: Array<GenericLicenseTypeType>
  force?: boolean
  onlyList?: boolean
}
@Injectable()
export class LicenseServiceServiceV2 {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly licenseClient: LicenseClientService,
    private readonly cmsContentfulService: CmsContentfulService,
    @Inject(LICENSE_MAPPER_FACTORY)
    private readonly licenseMapperFactory: (
      type: GenericLicenseType,
    ) => Promise<GenericLicenseMapper<any> | null>,
  ) {}

  private async getOrganization(
    slug: GenericLicenseOrganizationSlug,
    locale: Locale,
  ) {
    const organization = await this.cmsContentfulService.getOrganization(
      slug,
      locale,
    )

    return organization
  }

  private async getLicenseLabels(locale: Locale) {
    const licenseLabels = await this.cmsContentfulService.getNamespace(
      'Licenses',
      locale,
    )

    return {
      labels: licenseLabels?.fields
        ? JSON.parse(licenseLabels?.fields)
        : undefined,
    }
  }

  private async fetchLicense(
    user: User,
    licenseClient: LicenseClient<unknown>,
  ): Promise<GenericLicenseFetchResult> {
    let fetchStatus: GenericUserLicenseFetchStatus =
      GenericUserLicenseFetchStatus.NotFetched
    let data = null

    if (!licenseClient) {
      throw new InternalServerErrorException('License service failed')
    }

    const licenseRes = await licenseClient.getLicenseDetail(user)

    if (!licenseRes.ok) {
      fetchStatus = GenericUserLicenseFetchStatus.Error
    } else {
      data = licenseRes.data
      fetchStatus = GenericUserLicenseFetchStatus.Fetched
    }

    return {
      data,
      fetch: {
        status: fetchStatus,
        updated: new Date(),
      },
    }
  }

  async getAllLicenses(
    user: User,
    locale: Locale,
    {
      includedTypes,
      excludedTypes,
      force,
      onlyList,
    }: GetGenericLicenseOptions = {},
  ): Promise<GenericUserLicense[]> {
    const licenses: GenericUserLicense[] = []

    for await (const license of AVAILABLE_LICENSES) {
      if (excludedTypes && excludedTypes.indexOf(license.type) >= 0) {
        continue
      }

      if (includedTypes && includedTypes.indexOf(license.type) < 0) {
        continue
      }

      if (!onlyList) {
        const genericLicense = await this.getLicense(user, locale, license.type)
        if (genericLicense) {
          licenses.push(genericLicense)
        }
      }
    }
    return licenses
  }

  async getLicense(
    user: User,
    locale: Locale,
    licenseType: GenericLicenseType,
  ): Promise<GenericUserLicense | null> {
    const license = AVAILABLE_LICENSES.find((i) => i.type === licenseType)
    const licenseService = await this.licenseClient.getClientByLicenseType(
      (licenseType as unknown) as LicenseType,
    )

    if (!license || !licenseService) {
      this.logger.warn(`Invalid license type. type: ${licenseType}`)
      return null
    }

    const licenseLabels = await this.getLicenseLabels(locale)

    const licenseUserData: GenericLicenseUserdata = {
      status: GenericUserLicenseStatus.Unknown,
      pkpassStatus: GenericUserLicensePkPassStatus.Unknown,
    }

    const licenseRes = await this.fetchLicense(user, licenseService)
    let licensePayload: GenericUserLicensePayload | null = null

    if (licenseRes.fetch.status !== GenericUserLicenseFetchStatus.Error) {
      const mapper = await this.licenseMapperFactory(licenseType)

      if (!mapper) {
        this.logger.warn('Service failure. No mapper created')
        return null
      }

      licensePayload = mapper.parsePayload(
        licenseRes.data,
        locale,
        licenseLabels,
      )

      if (licensePayload) {
        licenseUserData.pkpassStatus = (licenseService.licenseIsValidForPkPass(
          licenseRes.data,
        ) as unknown) as GenericUserLicensePkPassStatus
        licenseUserData.status = GenericUserLicenseStatus.HasLicense
      } else {
        licenseUserData.status = GenericUserLicenseStatus.NotAvailable
      }
    }

    const orgData = license.orgSlug
      ? await this.getOrganization(license.orgSlug, locale)
      : undefined

    return {
      nationalId: user.nationalId,
      license: {
        ...license,
        status: licenseUserData.status,
        pkpassStatus: licenseUserData.pkpassStatus,
        title: orgData?.title,
        logo: orgData?.logo?.url,
      },
      fetch: licenseRes.fetch,
      payload: licensePayload ?? undefined,
    }
  }

  async generatePkPass(
    user: User,
    locale: Locale,
    licenseType: GenericLicenseType,
  ) {
    const client = await this.licenseClient.getClientByLicenseType(
      (licenseType as unknown) as LicenseType,
    )

    if (!client) {
      this.logger.warn(`Invalid license type. type: ${licenseType}`)
      return null
    }

    const pkPassRes = await client.getPkPass(user)

    if (pkPassRes.ok) {
      const { distributionQRCode, distributionUrl } = pkPassRes.data
      return {
        distributionQRCode,
        distributionUrl,
      }
    }

    throw new InternalServerErrorException(
      `Unable to get pkpass for ${licenseType} for user`,
    )
  }

  async verifyPkPass(data: string): Promise<PkPassVerification> {
    if (!data) {
      throw new Error(`Missing input data`)
    }

    const { passTemplateId } = JSON.parse(data)

    /*
     * PkPass barcodes provide a PassTemplateId that we can use to
     * map barcodes to license types.
     * Drivers licenses do NOT return a barcode so if the pass template
     * id is missing, then it's a drivers license.
     * Otherwise, map the id to its corresponding license type
     */
    const licenseService = await this.licenseClient.getClientByPassTemplateId(
      passTemplateId,
    )
    if (!licenseService) {
      throw new Error(`Invalid pass template id: ${passTemplateId}`)
    }

    const verification = await licenseService.verifyPkPass(data, passTemplateId)

    // TODO BETTER ERROR HANDLING
    if (!verification) {
      throw new Error(`Unable to verify pkpass for user`)
    }
    return verification
  }
}
