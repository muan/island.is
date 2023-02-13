import {
  Controller,
  Get,
  ParseArrayPipe,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import { ClientsService, ResourcesService } from '@island.is/auth-api-lib'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { AuthScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

import { ClientDto } from './client.dto'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AuthScope.delegations)
@ApiSecurity('ias', [AuthScope.delegations])
@ApiTags('/clients')
@Controller({
  path: 'clients',
  version: ['1'],
})
@Audit({ namespace: '@island.is/auth/delegation-api/clients' })
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly resourcesService: ResourcesService,
  ) {}

  @Get()
  @Documentation({
    response: { status: 200, type: [ClientDto] },
    request: {
      query: {
        lang: {
          description: 'The language to return the client name in.',
          required: false,
          type: 'string',
        },
        clientIds: {
          description: 'List of clientIds to filter by.',
          required: false,
          schema: {
            type: 'array',
            items: {
              type: 'string',
              example: ['@island.is/web', '@admin.island.is/web'],
            },
          },
        },
      },
    },
  })
  @Audit<ClientDto[]>({
    resources: (clients) => clients.map((client) => client.clientId),
  })
  async findAll(
    @Query('lang') lang?: string,
    @Query(
      'clientIds',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    clientIds?: string[],
  ): Promise<ClientDto[]> {
    const clients = await this.clientsService.findAllWithTranslation(
      clientIds,
      lang,
    )

    if (!clients) {
      return []
    }

    return clients.map((client) => {
      // Todo: This is a temporary solution until we have linked clients to domains
      const domainName = client.clientId.split('/')[0]

      return {
        clientId: client.clientId,
        clientName: client.clientName ?? client.clientId,
        domainName,
      }
    })
  }
}
