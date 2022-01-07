import { Query, Resolver, Context, ResolveField, Parent } from '@nestjs/graphql'

import type { User as TUser } from '@island.is/air-discount-scheme/types'
import {
  Flight,
  FlightLeg as TFlightLeg,
} from '@island.is/air-discount-scheme/types'
import { FlightLeg } from '../flightLeg'
import { CurrentUser } from '../decorators'
import { AuthUser } from '../auth/types'
import { User } from './models'
import { Inject } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { getRole } from '../auth/roles'
//import { Role } from '@island.is/air-discount-scheme/types'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes('@vegagerdin.is/air-discount-scheme-scope')
@Resolver(() => User)
export class UserResolver {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {}

  @Query(() => User, { nullable: true })
  async user(@CurrentUser() user: AuthUser): Promise<User | undefined> {
    console.log('user resolver API')
    console.log(user)
    if (!user) {
      return null
    }

    return user as User
  }

  @ResolveField('role')
  resolveRole(@CurrentUser() user: AuthUser): string {
    return getRole(user)
  }

  @ResolveField('meetsADSRequirements')
  resolveMeetsADSRequirements(@Parent() user: TUser): boolean {
    if (user.fund) {
      return user.fund.credit === user.fund.total - user.fund.used
    }
    return false
  }

  @ResolveField('flightLegs', () => [FlightLeg])
  async resolveFlights(
    @CurrentUser() user: AuthUser,
    @Context('dataSources') { backendApi },
  ): Promise<TFlightLeg[]> {
    console.log('before backend getuserlations')
    const relations: TUser[] = await backendApi.getUserRelations(
      user.nationalId,
    )
    console.log(relations)
    return relations.reduce(
      (promise: Promise<FlightLeg[]>, relation: TUser) => {
        return promise.then(async (acc) => {
          const flights: Flight[] = await backendApi.getUserFlights(
            relation.nationalId,
          )
          const flightLegs = flights.reduce((acc, flight) => {
            const legs = flight.flightLegs.map(
              ({ id, origin, destination }) => ({
                flight: {
                  ...flight,
                  user: relation,
                },
                id,
                origin,
                destination,
              }),
            )
            return [...acc, ...legs]
          }, [])
          return [...acc, ...flightLegs]
        })
      },
      Promise.resolve([]),
    ) as Promise<TFlightLeg[]>
  }
}
