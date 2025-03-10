import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards, UseInterceptors } from '@nestjs/common'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/judicial-system/auth'
import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import type { User } from '@island.is/judicial-system/types'

import { BackendApi } from '../../data-sources'
import { CaseInterceptor } from './interceptors/case.interceptor'
import { CaseQueryInput } from './dto/case.input'
import { Case } from './models/case.model'
import { UpdateCaseInput } from './dto/updateCase.input'
import { TransitionCaseInput } from './dto/transitionCase.input'

@UseGuards(new JwtGraphQlAuthGuard(true))
@Resolver(() => Case)
export class LimitedAccessCaseResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => Case, { nullable: true })
  @UseInterceptors(CaseInterceptor)
  async limitedAccessCase(
    @Args('input', { type: () => CaseQueryInput })
    input: CaseQueryInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendApi },
  ): Promise<Case> {
    this.logger.debug(`Getting case ${input.id}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_CASE,
      backendApi.limitedAccessGetCase(input.id),
      input.id,
    )
  }

  @Mutation(() => Case, { nullable: true })
  @UseInterceptors(CaseInterceptor)
  limitedAccessUpdateCase(
    @Args('input', { type: () => UpdateCaseInput })
    input: UpdateCaseInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendApi },
  ): Promise<Case> {
    const { id, ...updateCase } = input

    this.logger.debug(`Updating case ${id}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_CASE,
      backendApi.limitedAccessUpdateCase(id, updateCase),
      id,
    )
  }

  @Mutation(() => Case, { nullable: true })
  @UseInterceptors(CaseInterceptor)
  limitedAccessTransitionCase(
    @Args('input', { type: () => TransitionCaseInput })
    input: TransitionCaseInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendApi },
  ): Promise<Case> {
    const { id, ...transitionCase } = input

    this.logger.debug(`Transitioning case ${id}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.TRANSITION_CASE,
      backendApi.limitedAccessTransitionCase(id, transitionCase),
      id,
    )
  }
}
