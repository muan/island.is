import {
  Pass,
  PassDataInput,
  RevokePassData,
  SmartSolutionsApi,
  VerifyPassData,
} from '@island.is/clients/smartsolutions'
import type { Logger } from '@island.is/logging'
import { Result } from '../../licenseClient.type'
import { User } from '@island.is/auth-nest-tools'

export abstract class BaseLicenseClient<T> {
  constructor(
    protected logger: Logger,
    protected smartApi: SmartSolutionsApi,
  ) {}

  abstract getLicense(user: User): Promise<Result<T | null>>

  getLicenseDetail(user: User): Promise<Result<T | null>> {
    return this.getLicense(user)
  }

  protected abstract getPkPass(user: User): Promise<Result<Pass>>

  async getPkPassUrl(user: User, locale?: Locale): Promise<Result<string>> {
    const res = await this.getPkPass(user)

    if (!res.ok) {
      return res
    }

    return {
      ok: true,
      data: res.data.distributionUrl,
    }
  }

  async getPkPassQRCode(user: User, locale?: Locale): Promise<Result<string>> {
    const res = await this.getPkPass(user)

    if (!res.ok) {
      return res
    }

    return {
      ok: true,
      data: res.data.distributionQRCode,
    }
  }

  pushUpdatePass(
    inputData: PassDataInput,
    nationalId: string,
  ): Promise<Result<Pass>> {
    return this.smartApi.updatePkPass(inputData, nationalId)
  }

  abstract pullUpdatePass(nationalId: string): Promise<Result<Pass>>

  revokePass(nationalId: string): Promise<Result<RevokePassData>> {
    return this.smartApi.revokePkPass(nationalId)
  }

  /** We need to verify the pk pass AND the license itself! */
  abstract verifyPass(inputData: string): Promise<Result<VerifyPassData>>
}
