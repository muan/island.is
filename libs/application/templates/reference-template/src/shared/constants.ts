import { ApplicationTemplateAPIAction } from '@island.is/application/core'

export enum ApiActions {
  createApplication = 'createApplication',
  doStuffThatFails = 'doStuffThatFails',
  completeApplication = 'completeApplication',
  getReferenceData = 'getReferenceData',
  getAnotherReferenceData = 'getAnotherReferenceData',
}

export const ReferenceApplicationDataProviders = {
  anotherReferenceProvider: {
    dataProviderType: 'anotherReferenceProvider',
    apiModuleAction: ApiActions.getAnotherReferenceData,
    externalDataId: 'anotherReference',
    shouldPersistToExternalData: true,
  },
  referenceProvider: {
    dataProviderType: 'referenceProvider',
    apiModuleAction: ApiActions.getReferenceData,
    externalDataId: 'reference',
    //shouldPersistToExternalData: false,
    useMockData: false,
    mockData: {
      response: {
        data: {
          stone: 'stones',
        },
      },
      success: true,
    },
  },
} as ReferenceApplicationDataProviders

export interface ReferenceApplicationDataProviders {
  referenceProvider: ApplicationTemplateAPIAction
  anotherReferenceProvider: ApplicationTemplateAPIAction
}
