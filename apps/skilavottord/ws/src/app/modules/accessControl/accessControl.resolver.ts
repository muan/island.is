import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'
import { NotFoundException, BadRequestException } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'

import { Authorize, CurrentUser, User, Role } from '../auth'

import { AccessControlModel } from './accessControl.model'
import { AccessControlService } from './accessControl.service'
import {
  UpdateAccessControlInput,
  CreateAccessControlInput,
  DeleteAccessControlInput,
} from './accessControl.input'

@Authorize({
  roles: [Role.developer, Role.recyclingFund],
})
@Resolver(() => AccessControlModel)
export class AccessControlResolver {
  constructor(private accessControlService: AccessControlService) {}

  private verifyDeveloperAccess(user: User, role: Role) {
    const isDeveloper = user.role === Role.developer
    if (!isDeveloper && role === Role.developer) {
      throw new ApolloError('Only developers can modify developer access')
    }
  }

  private verifyRecyclingCompanyInput(
    input: CreateAccessControlInput | UpdateAccessControlInput,
  ) {
    if (input.role === Role.recyclingCompany && !input.partnerId) {
      throw new BadRequestException(
        `User is not recyclingCompany or partnerId not found`,
      )
    }
  }

  @Query(() => [AccessControlModel])
  async skilavottordAccessControls(
    @CurrentUser() user: User,
  ): Promise<AccessControlModel[]> {
    const isDeveloper = user.role === Role.developer
    return this.accessControlService.findAll(isDeveloper)
  }

  @Mutation(() => AccessControlModel)
  async createSkilavottordAccessControl(
    @Args('input', { type: () => CreateAccessControlInput })
    input: CreateAccessControlInput,
    @CurrentUser() user: User,
  ): Promise<AccessControlModel> {
    this.verifyDeveloperAccess(user, input.role)
    this.verifyRecyclingCompanyInput(input)
    return this.accessControlService.createAccess(input)
  }

  @Mutation(() => AccessControlModel)
  async updateSkilavottordAccessControl(
    @Args('input', { type: () => UpdateAccessControlInput })
    input: UpdateAccessControlInput,
    @CurrentUser() user: User,
  ): Promise<AccessControlModel> {
    console.log('-->update accessControl')
    this.verifyDeveloperAccess(user, input.role)
    this.verifyRecyclingCompanyInput(input)
    return this.accessControlService.updateAccess(input)
  }

  @Mutation(() => Boolean)
  async deleteSkilavottordAccessControl(
    @Args('input', { type: () => DeleteAccessControlInput })
    input: DeleteAccessControlInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    const accessControl = await this.accessControlService.findOne(
      input.nationalId,
    )
    this.verifyDeveloperAccess(user, accessControl.role)
    if (!accessControl) {
      throw new NotFoundException('AccessControl not found')
    }
    return this.accessControlService.deleteAccess(input)
  }
}
