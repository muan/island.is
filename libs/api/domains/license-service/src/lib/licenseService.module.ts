import { Cache as CacheManager } from 'cache-manager'
import { Module, CacheModule } from '@nestjs/common'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { CmsModule } from '@island.is/cms'
import { LicenseServiceService } from './licenseService.service'
import { MainResolver } from './graphql/main.resolver'
import {
  CONFIG_PROVIDER,
  GenericLicenseClient,
  GenericLicenseMetadata,
  GenericLicenseProviderId,
  GenericLicenseType,
  GenericLicenseOrganizationSlug,
  GENERIC_LICENSE_FACTORY,
  PassTemplateIds,
} from './licenceService.type'
import {
  GenericAdrLicenseModule,
  GenericAdrLicenseService,
  GenericAdrLicenseConfig,
} from './client/adr-license-client'
import {
  GenericFirearmLicenseModule,
  GenericFirearmLicenseService,
  GenericFirearmLicenseConfig,
} from './client/firearm-license-client'
import {
  GenericMachineLicenseModule,
  GenericMachineLicenseService,
  GenericMachineLicenseConfig,
} from './client/machine-license-client'

import {
  GenericDrivingLicenseApi,
  GenericDrivingLicenseConfig,
  GenericDrivingLicenseModule,
} from './client/driving-license-client'
import {
  GenericDisabilityLicenseModule,
  GenericDisabilityLicenseConfig,
  GenericDisabilityLicenseService,
} from './client/disability-license-client'

export const AVAILABLE_LICENSES: GenericLicenseMetadata[] = [
  {
    type: GenericLicenseType.FirearmLicense,
    provider: {
      id: GenericLicenseProviderId.NationalPoliceCommissioner,
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.FirearmLicense,
  },
  {
    type: GenericLicenseType.DriversLicense,
    provider: {
      id: GenericLicenseProviderId.NationalPoliceCommissioner,
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.DriversLicense,
  },
  {
    type: GenericLicenseType.AdrLicense,
    provider: {
      id: GenericLicenseProviderId.AdministrationOfOccupationalSafetyAndHealth,
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.AdrLicense,
  },
  {
    type: GenericLicenseType.MachineLicense,
    provider: {
      id: GenericLicenseProviderId.AdministrationOfOccupationalSafetyAndHealth,
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.MachineLicense,
  },
  {
    type: GenericLicenseType.DisabilityLicense,
    provider: {
      id: GenericLicenseProviderId.SocialInsuranceAdministration,
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.DisabilityLicense,
  },
]
@Module({
  imports: [
    CacheModule.register(),
    GenericFirearmLicenseModule,
    GenericAdrLicenseModule,
    GenericMachineLicenseModule,
    GenericDisabilityLicenseModule,
    GenericDrivingLicenseModule,
    CmsModule,
  ],
  providers: [
    MainResolver,
    LicenseServiceService,
    {
      provide: LOGGER_PROVIDER,
      useValue: logger,
    },
    {
      provide: CONFIG_PROVIDER,
      useFactory: (
        firearmConfig: ConfigType<typeof GenericFirearmLicenseConfig>,
        adrConfig: ConfigType<typeof GenericAdrLicenseConfig>,
        machineConfig: ConfigType<typeof GenericMachineLicenseConfig>,
        disabilityConfig: ConfigType<typeof GenericDisabilityLicenseConfig>,
        drivingConfig: ConfigType<typeof GenericDrivingLicenseConfig>,
      ) => {
        const ids: PassTemplateIds = {
          firearmLicense: firearmConfig.passTemplateId,
          adrLicense: adrConfig.passTemplateId,
          machineLicense: machineConfig.passTemplateId,
          disabilityLicense: disabilityConfig.passTemplateId,
          drivingLicense: drivingConfig.passTemplateId,
        }
        return ids
      },
      inject: [
        GenericFirearmLicenseConfig.KEY,
        GenericAdrLicenseConfig.KEY,
        GenericMachineLicenseConfig.KEY,
        GenericDisabilityLicenseConfig.KEY,
        GenericDrivingLicenseConfig.KEY,
      ],
    },
    {
      provide: GENERIC_LICENSE_FACTORY,
      useFactory: (
        genericFirearmService: GenericFirearmLicenseService,
        genericAdrService: GenericAdrLicenseService,
        genericMachineService: GenericMachineLicenseService,
        genericDisabilityService: GenericDisabilityLicenseService,
        genericDrivingLicenseApi: GenericDrivingLicenseApi,
      ) => async (
        type: GenericLicenseType,
      ): Promise<GenericLicenseClient<unknown> | null> => {
        switch (type) {
          case GenericLicenseType.DriversLicense:
            return genericDrivingLicenseApi
          case GenericLicenseType.AdrLicense:
            return genericAdrService
          case GenericLicenseType.MachineLicense:
            return genericMachineService
          case GenericLicenseType.FirearmLicense:
            return genericFirearmService
          case GenericLicenseType.DisabilityLicense:
            return genericDisabilityService
          default:
            return null
        }
      },
      inject: [
        GenericFirearmLicenseService,
        GenericAdrLicenseService,
        GenericMachineLicenseService,
        GenericDisabilityLicenseService,
        GenericDrivingLicenseApi,
      ],
    },
  ],
  exports: [LicenseServiceService],
})
export class LicenseServiceModule {}
