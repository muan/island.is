import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import {
  ApplicationTypes,
  InstitutionNationalIds,
} from '@island.is/application/types'
import {
  error,
  getChargeItemCodes,
  ResidencePermitRenewalAnswers,
} from '@island.is/application/templates/directorate-of-immigration/residence-permit-renewal'
import {
  Agent,
  Country,
  CriminalRecord,
  CurrentResidencePermit,
  CurrentResidencePermitType,
  Passport,
  ResidencePermitClient,
  StayAbroad,
  Study,
  TravelDocumentType,
} from '@island.is/clients/directorate-of-immigration/residence-permit'
import { TemplateApiError } from '@island.is/nest/problem'

@Injectable()
export class ResidencePermitRenewalService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly residencePermitClient: ResidencePermitClient,
  ) {
    super(ApplicationTypes.RESIDENCE_PERMIT_RENEWAL)
  }

  async createCharge({ application, auth }: TemplateApiModuleActionProps) {
    try {
      const answers = application.answers as ResidencePermitRenewalAnswers

      const chargeItemCodes = getChargeItemCodes(answers)

      const result = this.sharedTemplateAPIService.createCharge(
        auth,
        application.id,
        InstitutionNationalIds.UTLENDINGASTOFNUN,
        chargeItemCodes,
      )
      return result
    } catch (exeption) {
      return { id: '', paymentUrl: '' }
    }
  }

  async getCountries(): Promise<Country[]> {
    return this.residencePermitClient.getCountries()
  }

  async getTravelDocumentTypes(): Promise<TravelDocumentType[]> {
    return this.residencePermitClient.getTravelDocumentTypes()
  }

  async getCurrentResidencePermitList({
    auth,
  }: TemplateApiModuleActionProps): Promise<CurrentResidencePermit[]> {
    const res = await this.residencePermitClient.getCurrentResidencePermitList(
      auth,
    )

    if (!res.find((x) => x.canApplyRenewal)) {
      throw new TemplateApiError(
        {
          title: error.notAllowedToRenew,
          summary: error.notAllowedToRenew,
        },
        400,
      )
    }

    return res
  }

  async getApplicantCurrentResidencePermitType({
    auth,
  }: TemplateApiModuleActionProps): Promise<CurrentResidencePermitType> {
    return await this.residencePermitClient.getApplicantCurrentResidencePermitType(
      auth,
    )
  }

  async getOldStayAbroadList({
    auth,
  }: TemplateApiModuleActionProps): Promise<StayAbroad[]> {
    return this.residencePermitClient.getOldStayAbroadList(auth)
  }

  async getOldCriminalRecordList({
    auth,
  }: TemplateApiModuleActionProps): Promise<CriminalRecord[]> {
    return this.residencePermitClient.getOldCriminalRecordList(auth)
  }

  async getOldStudyItem({
    auth,
  }: TemplateApiModuleActionProps): Promise<Study | undefined> {
    return this.residencePermitClient.getOldStudyItem(auth)
  }

  async getOldPassportItem({
    auth,
  }: TemplateApiModuleActionProps): Promise<Passport | undefined> {
    return this.residencePermitClient.getOldPassportItem(auth)
  }

  async getOldAgentItem({
    auth,
  }: TemplateApiModuleActionProps): Promise<Agent | undefined> {
    return this.residencePermitClient.getOldAgentItem(auth)
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const isPayment:
      | { fulfilled: boolean }
      | undefined = await this.sharedTemplateAPIService.getPaymentStatus(
      auth,
      application.id,
    )

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const answers = application.answers as ResidencePermitRenewalAnswers

    // Submit the application
    await this.residencePermitClient.submitApplicationForRenewal(auth)
  }
}
