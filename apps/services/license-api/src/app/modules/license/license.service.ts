import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  UpdateLicenseRequest,
  VerifyLicenseRequest,
  UpdateLicenseResponse,
  VerifyLicenseResponse,
  RevokeLicenseResponse,
} from './dto'
import { Pass, PassDataInput, Result } from '@island.is/clients/smartsolutions'
import {
  CLIENT_FACTORY,
  ErrorType,
  GenericLicenseClient,
  LicenseId,
  PASS_TEMPLATE_IDS,
} from './license.types'
import type { PassTemplateIds } from './license.types'

const LOG_CATEGORY = 'license-api'

@Injectable()
export class LicenseService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(PASS_TEMPLATE_IDS) private config: PassTemplateIds,
    @Inject(CLIENT_FACTORY)
    private clientFactory: (
      licenseId: LicenseId,
    ) => Promise<GenericLicenseClient>,
  ) {}

  private getErrorTypeByCode = (code: number): ErrorType =>
    code < 10 ? 'BadRequest' : 'ServerError'

  //Error message is an array to maintain consistency
  private getException = (errorType: ErrorType, details?: string | object) => {
    return errorType === 'BadRequest'
      ? new BadRequestException([details ?? 'Unknown error'])
      : new InternalServerErrorException([details ?? 'Unknown error'])
  }

  private async pushUpdateLicense(
    service: GenericLicenseClient,
    expirationDate: string,
    nationalId: string,
    payload?: string,
  ): Promise<Result<Pass | undefined>> {
    let updatePayload: PassDataInput = {
      expirationDate,
    }

    if (payload) {
      let parsedInputPayload
      try {
        parsedInputPayload = JSON.parse(payload)
      } catch (e) {
        this.logger.warn('Unable to parse payload', {
          category: LOG_CATEGORY,
        })
        throw this.getException(
          'BadRequest',
          'Unable to parse payload for push update',
        )
      }
      updatePayload = {
        ...updatePayload,
        ...parsedInputPayload,
      }
    }

    return await service.pushUpdate(updatePayload, nationalId)
  }

  private async pullUpdateLicense(
    service: GenericLicenseClient,
    nationalId: string,
  ): Promise<Result<Pass | undefined>> {
    /** PULL - Update electronic license with pulled data from service
     * 1. Fetch data from provider
     * 2. Parse and validate license data
     * 3. With good data, update the electronic license with the validated license data!
     */

    return await service.pullUpdate(nationalId)
  }

  async updateLicense(
    licenseId: LicenseId,
    nationalId: string,
    inputData: UpdateLicenseRequest,
  ): Promise<UpdateLicenseResponse> {
    const service = await this.clientFactory(licenseId)

    let updateRes: Result<Pass | undefined>
    if (inputData.licenseUpdateType === 'push') {
      const { expiryDate, payload } = inputData

      if (!expiryDate) {
        this.logger.warn('Invalid request body, missing expiryDate', {
          category: LOG_CATEGORY,
        })

        throw this.getException(
          'BadRequest',
          'Invalid request body, missing expiryDate',
        )
      }

      updateRes = await this.pushUpdateLicense(
        service,
        expiryDate,
        nationalId,
        payload,
      )
    } else {
      updateRes = await this.pullUpdateLicense(service, nationalId)
    }

    if (updateRes.ok) {
      return {
        updateSuccess: true,
        data: updateRes.data,
      }
    }

    this.logger.error('Update license failed', {
      category: LOG_CATEGORY,
      ...updateRes.error,
    })
    throw this.getException(
      this.getErrorTypeByCode(updateRes.error.code),
      updateRes.error.message,
    )
  }

  async revokeLicense(
    licenseId: LicenseId,
    nationalId: string,
  ): Promise<RevokeLicenseResponse> {
    const service = await this.clientFactory(licenseId)
    const revokeRes = await service.revoke(nationalId)

    if (revokeRes.ok) {
      return { revokeSuccess: revokeRes.data.success }
    }

    this.logger.error('Update license failed', {
      category: LOG_CATEGORY,
      ...revokeRes.error,
    })
    throw this.getException(
      this.getErrorTypeByCode(revokeRes.error.code),
      revokeRes.error.message,
    )
  }

  async verifyLicense(
    inputData: VerifyLicenseRequest,
  ): Promise<VerifyLicenseResponse> {
    const { passTemplateId } = JSON.parse(inputData.barcodeData)

    if (!passTemplateId) {
      this.logger.error('No pass template id supplied', {
        category: LOG_CATEGORY,
      })
      throw this.getException('BadRequest', 'Missing pass template id')
    }

    const licenseId = this.getTypeFromPassTemplateId(passTemplateId)

    if (!licenseId) {
      this.logger.error('Invalid passTemplate id', {
        category: LOG_CATEGORY,
      })
      throw this.getException('BadRequest', 'Invalid pass template id')
    }

    const service = await this.clientFactory(licenseId)
    const verifyRes = await service.verify(inputData.barcodeData)

    if (verifyRes.ok) {
      return {
        valid: verifyRes.data.valid,
        passIdentity: verifyRes.data.passIdentity,
      }
    }
    this.logger.error('verify license failed', {
      category: LOG_CATEGORY,
      ...verifyRes.error,
      requestId: inputData.requestId,
    })
    throw this.getException(this.getErrorTypeByCode(verifyRes.error.code), {
      message: verifyRes.error.message,
      requestId: inputData.requestId,
    })
  }

  private getTypeFromPassTemplateId(passTemplateId: string): LicenseId | null {
    for (const [key, value] of Object.entries(this.config)) {
      // some license Config id === barcode id
      if (value === passTemplateId) {
        const keyAsEnumKey = `${key.toUpperCase()}_LICENSE`
        const valueFromEnum: LicenseId | undefined =
          LicenseId[keyAsEnumKey as keyof typeof LicenseId]

        if (!valueFromEnum) {
          this.logger.warn('Invalid license type', {
            category: LOG_CATEGORY,
          })
          throw new Error(`Invalid license type: ${key}`)
        }
        return valueFromEnum
      }
    }
    return null
  }
}
