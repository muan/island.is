import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { IntellectualPropertyService } from './intellectualProperty.service'
import { Trademark } from './models/getTrademark.model'
import { Patent } from './models/getPatents.model'
import { Design } from './models/getDesign.model'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard)
@Audit({ namespace: '@island.is/api/intellectual-property' })
export class IntellectualPropertyResolver {
  constructor(private readonly ipService: IntellectualPropertyService) {}

  @Scopes(ApiScope.internal)
  @Query(() => [Trademark], {
    name: 'intellectualPropertyTrademarks',
    nullable: true,
  })
  @Audit()
  getIntellectualPropertyTrademarks(@CurrentUser() user: User) {
    return this.ipService.getTrademarks(user)
  }

  @Scopes(ApiScope.internal)
  @Query(() => [Patent], {
    name: 'intellectualPropertyPatents',
    nullable: true,
  })
  @Audit()
  getIntellectualPropertyPatents(@CurrentUser() user: User) {
    return this.ipService.getPatents(user)
  }

  @Scopes(ApiScope.internal)
  @Query(() => [Design], {
    name: 'intellectualPropertyDesigns',
    nullable: true,
  })
  @Audit()
  getIntellectualPropertyDesigns(@CurrentUser() user: User) {
    return this.ipService.getDesigns(user)
  }
}
