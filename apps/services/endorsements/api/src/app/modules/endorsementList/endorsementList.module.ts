import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { EndorsementList } from './endorsementList.model'
import { EndorsementListController } from './endorsementList.controller'
import { EndorsementListService } from './endorsementList.service'
import { Endorsement } from '../endorsement/models/endorsement.model'
import {
  NationalRegistryApi,
  NationalRegistryConfig,
} from '@island.is/clients/national-registry-v1'
import { environment } from '../../../environments'
import { EmailModule } from '@island.is/email-service'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'

export interface Config {
  nationalRegistry: NationalRegistryConfig
}

@Module({
  imports: [
    NationalRegistryClientModule,
    SequelizeModule.forFeature([EndorsementList, Endorsement]),
    EmailModule.register(environment.emailOptions),
  ],
  controllers: [EndorsementListController],
  providers: [
    EndorsementListService,
    {
      provide: NationalRegistryApi,
      // See method doc for disable reason.
      // eslint-disable-next-line local-rules/no-async-module-init
      useFactory: async () =>
        NationalRegistryApi.instantiateClass(environment.nationalRegistry),
    },
  ],
  exports: [EndorsementListService],
})
export class EndorsementListModule {}
