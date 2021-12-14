import { PersonalRepresentativePermissionController } from './personalRepresentativePermission.controller'
import { Module } from '@nestjs/common'
import {
  PersonalRepresentative,
  PersonalRepresentativeAccess,
  PersonalRepresentativeAccessService,
  PersonalRepresentativeRight,
  PersonalRepresentativeService,
} from '@island.is/auth-api-lib/personal-representative'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [
    SequelizeModule.forFeature([
      PersonalRepresentativeAccess,
      PersonalRepresentativeRight,
      PersonalRepresentative,
    ]),
  ],
  controllers: [PersonalRepresentativePermissionController],
  providers: [
    PersonalRepresentativeAccessService,
    PersonalRepresentativeService,
  ],
})
export class PersonalRepresentativePermissionModule {}
