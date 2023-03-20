import { Module } from '@nestjs/common'
import { AuthModule } from '@island.is/auth-nest-tools'
import { ConsultationPortalClientModule } from '@island.is/clients/consultation-portal'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { CaseResultResolver } from './cases/cases.resolver'
import { CaseResultService } from './cases/cases.service'
import { DocumentService } from './documents/documents.service'
import { DocumentResolver } from './documents/documents.resolver'
import { AllTypesResultService } from './types/types.service'
import { AllTypesResultResolver } from './types/types.resolver'
import { UserAdviceResultService } from './user/userAdvice.services'
import { UserAdviceResultResolver } from './user/userAdvice.resolver'
import { StatisticsResultService } from './statistics/statistics.service'
import { StatisticsResultResolver } from './statistics/statistics.resolver'

@Module({
  providers: [
    CaseResultResolver,
    CaseResultService,
    DocumentService,
    DocumentResolver,
    AllTypesResultService,
    AllTypesResultResolver,
    UserAdviceResultService,
    UserAdviceResultResolver,
    StatisticsResultService,
    StatisticsResultResolver,
  ],
  imports: [ConsultationPortalClientModule, AuthModule, FeatureFlagModule],
  exports: [],
})
export class ConsultationPortalModule {}
