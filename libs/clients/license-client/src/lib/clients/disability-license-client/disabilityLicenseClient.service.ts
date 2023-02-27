import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { createPkPassDataInput } from './disabilityLicenseMapper'
import {
  DefaultApi,
  OrorkuSkirteini,
} from '@island.is/clients/disability-license'
import {
  Pass,
  PassDataInput,
  RevokePassData,
  SmartSolutionsApi,
  VerifyPassData,
} from '@island.is/clients/smartsolutions'
import { FetchError } from '@island.is/clients/middlewares'
import compareAsc from 'date-fns/compareAsc'
import {
  LicensePkPassAvailability,
  PkPassVerification,
  PkPassVerificationInputData,
  Result,
} from '../../licenseClient.type'
import { BaseLicenseClient } from '../base/baseLicenseClient.service'

/** Category to attach each log message to */
const LOG_CATEGORY = 'disability-license-service'

@Injectable()
export class DisabilityLicenseClient extends BaseLicenseClient<OrorkuSkirteini> {
  constructor(
    @Inject(LOGGER_PROVIDER) protected logger: Logger,
    private disabilityLicenseApi: DefaultApi,
    protected smartApi: SmartSolutionsApi,
  ) {
    super(logger, smartApi)
  }

  private checkLicenseValidityForPkPass(
    licenseInfo: OrorkuSkirteini,
  ): LicensePkPassAvailability {
    if (!licenseInfo || !licenseInfo.gildirtil) {
      return LicensePkPassAvailability.Unknown
    }

    const expired = new Date(licenseInfo.gildirtil)
    const comparison = compareAsc(expired, new Date())

    if (isNaN(comparison) || comparison < 0) {
      return LicensePkPassAvailability.NotAvailable
    }

    return LicensePkPassAvailability.Available
  }

  private async fetchLicense(
    user: User,
  ): Promise<Result<OrorkuSkirteini | null>> {
    try {
      const licenseInfo = await this.disabilityLicenseApi
        .withMiddleware(new AuthMiddleware(user as Auth))
        .faskirteiniGet()
      return { ok: true, data: licenseInfo }
    } catch (e) {
      let error
      if (e instanceof FetchError) {
        //404 - no license for user, still ok!
        error = {
          code: 13,
          message: 'Service failure',
          data: JSON.stringify(e.body),
        }
        this.logger.warn('Expected 200 status', {
          status: e.status,
          statusText: e.statusText,
          category: LOG_CATEGORY,
        })
      } else {
        const unknownError = e as Error
        error = {
          code: 99,
          message: 'Unknown error',
          data: JSON.stringify(unknownError),
        }
        this.logger.warn('Unable to query data', {
          status: e.status,
          statusText: e.statusText,
          category: LOG_CATEGORY,
        })
      }

      return {
        ok: false,
        error,
      }
    }
  }

  licenseIsValidForPkPass(payload: unknown): LicensePkPassAvailability {
    return this.checkLicenseValidityForPkPass(payload as OrorkuSkirteini)
  }

  async getLicense(user: User): Promise<Result<OrorkuSkirteini | null>> {
    const licenseData = await this.fetchLicense(user)
    if (!licenseData.ok) {
      return licenseData
    }

    if (!licenseData.data) {
      return {
        ok: false,
        error: {
          code: 13,
          message: 'No license data returned',
        },
      }
    }

    const isEmpty = Object.values(licenseData.data).every((item) =>
      item ? false : true,
    )

    const data = isEmpty ? null : licenseData.data

    return {
      ok: true,
      data,
    }
  }

  private async createPkPassPayload(
    data: OrorkuSkirteini,
  ): Promise<PassDataInput | null> {
    const inputValues = createPkPassDataInput(data)
    if (!inputValues) return null
    return {
      inputFieldValues: inputValues,
      expirationDate: data.rennurut?.toISOString(),
    }
  }

  protected async getPkPass(user: User): Promise<Result<Pass>> {
    const license = await this.fetchLicense(user)

    if (!license.ok || !license.data) {
      this.logger.info(
        `No license data found for user, no pkpass payload to create`,
        { LOG_CATEGORY },
      )
      return {
        ok: false,
        error: {
          code: 3,
          message: 'No disability license data found',
        },
      }
    }
    const payload = await this.createPkPassPayload(license.data)

    if (!payload) {
      return {
        ok: false,
        error: {
          code: 3,
          message: 'Missing payload',
        },
      }
    }

    const pass = await this.smartApi.generatePkPass(payload, user.nationalId)

    return pass
  }

  async verifyPkPass(data: string): Promise<Result<PkPassVerification>> {
    const { code, date } = JSON.parse(data) as PkPassVerificationInputData
    const result = await this.smartApi.verifyPkPass({ code, date })

    if (!result.ok) {
      return result
    }

    /*
      TODO: VERIFICATION!!!!!!!! Máni (thorkellmani @ github)
      Currently Impossible
      A robust verification needs to both check that the PkPass is valid,
      and that the user being scanned does indeed have a license!.
      This method currently checks the validity of the PkPass, but we can't
      inspect the validity of their actual ADR license. As of now, we can
      only retrieve the license of a logged in user, not the user being scanned!
    */

    return {
      ok: true,
      data: result.data,
    }
  }

  async pullUpdatePass(nationalId: string): Promise<Result<Pass>> {
    throw new Error('Not yet implemented')
  }

  async verifyPass(inputData: string): Promise<Result<VerifyPassData>> {
    const { code, date } = JSON.parse(inputData)

    return await this.smartApi.verifyPkPass({ code, date })

    //TODO: Verify license when endpoints are ready
    //const verifyLicenseResult = await this.service.verify(nationalId?)
    //return JSON.stringify(templates)
  }
}
