import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  DataUploadResponse,
  EstateAsset,
  EstateMember,
  Person,
  PersonType,
  SyslumennService,
} from '@island.is/clients/syslumenn'
import {
  Answers as aodAnswers,
  OtherPropertiesEnum,
} from '@island.is/application/templates/announcement-of-death/types'
import { NationalRegistry, RoleConfirmationEnum, PickRole } from './types'
import {
  baseMapper,
  dummyAsset,
  dummyMember,
} from './announcement-of-death-utils'

import { isPerson } from 'kennitala'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { coreErrorMessages } from '@island.is/application/core'
import { TemplateApiError } from '@island.is/nest/problem'

@Injectable()
export class AnnouncementOfDeathService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly syslumennService: SyslumennService,
  ) {
    super(ApplicationTypes.ANNOUNCEMENT_OF_DEATH)
  }

  async deathNotice({
    application,
  }: TemplateApiModuleActionProps): Promise<Boolean> {
    const applicationData: any =
      application.externalData?.syslumennOnEntry?.data
    if (
      !applicationData?.estate?.caseNumber?.length ||
      applicationData.estate?.caseNumber.length === 0
    ) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.failedDataProviderSubmit,
          summary: coreErrorMessages.drivingLicenseNoTeachingRightsSummary,
        },
        400,
      )
    }
    return true
  }

  async syslumennOnEntry({ application, auth }: TemplateApiModuleActionProps) {
    const estates = await this.syslumennService.getEstateRegistrant(
      application.applicant,
    )

    // On entry shouldn't throw errors but rather be handled
    // in the frontend
    if (!estates?.length || estates.length === 0) {
      return {
        success: false,
        estates: [],
      }
    }

    for (const estate in estates) {
      estates[estate].assets = estates[estate].assets.map(baseMapper)
      estates[estate].vehicles = [
        ...estates[estate].vehicles,
        ...estates[estate].ships,
        ...estates[estate].flyers,
      ].map(baseMapper)
      estates[estate].estateMembers = estates[estate].estateMembers.map(
        baseMapper,
      )
      // TODO: remove once empty array diff problem is resolved
      //       in the application system (property dropped before deepmerge)
      estates[estate].assets.unshift(dummyAsset as EstateAsset)
      estates[estate].vehicles.unshift(dummyAsset as EstateAsset)
      estates[estate].estateMembers.unshift(dummyMember as EstateMember)
      estates[estate].guns.unshift(dummyAsset as EstateAsset)
    }

    const relationOptions = (await this.syslumennService.getEstateRelations())
      .relations

    return {
      success: true,
      estate: estates[0], // TODO: selector will be implemented in next iteration
      relationOptions,
    }
  }

  async assignElectedPerson({ application }: TemplateApiModuleActionProps) {
    const syslumennOnEntryData: any = application.externalData.syslumennOnEntry
    const electPerson: any = (application.answers?.pickRole as PickRole)
      .electPerson
    const electPersonNationalId: string =
      electPerson.electedPersonNationalId ?? ''

    if (!isPerson(electPersonNationalId)) {
      return {
        success: false,
      }
    }

    const changeEstateParams = {
      from: application.applicant,
      to: electPersonNationalId,
      caseNumber: syslumennOnEntryData?.data?.estate?.caseNumber ?? '',
    }
    try {
      await this.syslumennService.changeEstateRegistrant(
        changeEstateParams.from,
        changeEstateParams.to,
        changeEstateParams.caseNumber,
      )
    } catch (e) {
      return { success: false }
    }
  }

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    if (
      (application.answers?.pickRole as PickRole).roleConfirmation ===
      RoleConfirmationEnum.DELEGATE
    ) {
      const syslumennOnEntryData: any =
        application.externalData.syslumennOnEntry
      const electPerson: any = (application.answers?.pickRole as PickRole)
        .electPerson
      const electPersonNationalId: string =
        electPerson.electedPersonNationalId ?? ''

      if (!isPerson(electPersonNationalId)) {
        return {
          success: false,
        }
      }

      const changeEstateParams = {
        from: application.applicant,
        to: electPersonNationalId,
        caseNumber: syslumennOnEntryData?.data?.malsnumer ?? '',
      }
      try {
        await this.syslumennService.changeEstateRegistrant(
          changeEstateParams.from,
          changeEstateParams.to,
          changeEstateParams.caseNumber,
        )
      } catch (e) {
        return { success: false }
      }
    } else {
      const nationalRegistryData = application.externalData.nationalRegistry
        ?.data as NationalRegistry
      const person: Person = {
        name: nationalRegistryData?.fullName,
        ssn: application.applicant,
        phoneNumber: application.answers.applicantPhone as string,
        city: nationalRegistryData?.address.city,
        homeAddress: nationalRegistryData?.address.streetAddress,
        postalCode: nationalRegistryData?.address.postalCode,
        signed: false,
        type: PersonType.AnnouncerOfDeathCertificate,
        email: application.answers.applicantEmail as string,
      }

      const uploadDataName = 'andlatstilkynning1.0 '
      const uploadDataId = 'andlatstilkynning1.0 '

      const answers = (application.answers as unknown) as aodAnswers

      const otherProperties = answers?.otherProperties ?? []

      const extraData = {
        caseNumber: answers.caseNumber,
        notifier: JSON.stringify({
          name: answers.applicantName,
          ssn: application.applicant,
          phoneNumber: answers.applicantPhone,
          email: answers.applicantEmail,
          relation: answers.applicantRelation,
        }),
        knowledgeOfOtherWill: answers.knowledgeOfOtherWills,
        estateMembers: JSON.stringify(
          answers.estateMembers.members.filter((member) => !member?.dummy),
        ),
        assets: JSON.stringify(
          answers.assets.assets.filter((asset) => !asset?.dummy),
        ),
        vehicles: JSON.stringify(
          answers.vehicles.vehicles.filter((vehicle) => !vehicle?.dummy),
        ),
        bankcodeSecuritiesOrShares: otherProperties.includes(
          OtherPropertiesEnum.ACCOUNTS,
        )
          ? 'true'
          : 'false',
        selfOperatedCompany: otherProperties.includes(
          OtherPropertiesEnum.OWN_BUSINESS,
        )
          ? 'true'
          : 'false',
        occupationRightViaCondominium: otherProperties.includes(
          OtherPropertiesEnum.RESIDENCE,
        )
          ? 'true'
          : 'false',
        assetsAbroad: otherProperties.includes(
          OtherPropertiesEnum.ASSETS_ABROAD,
        )
          ? 'true'
          : 'false',
        districtCommissionerHasWill: answers.districtCommissionerHasWill.toString(),
        prenuptialAgreement: answers.marriageSettlement.toString(),
        certificateOfDeathAnnouncement: answers.certificateOfDeathAnnouncement,
        authorizationForFuneralExpenses: answers.authorizationForFuneralExpenses
          ? answers.authorizationForFuneralExpenses.toString()
          : 'false',
        financesDataCollectionPermission: answers.financesDataCollectionPermission
          ? answers.financesDataCollectionPermission.toString()
          : 'false',
        additionalInfo: answers.additionalInfo,
      }

      const result: DataUploadResponse = await this.syslumennService
        .uploadData(
          [person],
          undefined,
          extraData,
          uploadDataName,
          uploadDataId,
        )
        .catch((e) => {
          return {
            success: false,
            errorMessage: e.message,
          }
        })

      if (!result.success) {
        throw new Error(
          'Application submission failed on syslumadur upload data',
        )
      }
      return { success: result.success, id: result.caseNumber }
    }
  }
}
