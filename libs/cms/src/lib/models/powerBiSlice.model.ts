import { CacheField } from '@island.is/nest/graphql'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import { SystemMetadata } from '@island.is/shared/types'
import { IPowerBiSlice } from '../generated/contentfulTypes'
import { GetPowerBiEmbedPropsFromServerResponse } from '../dto/getPowerBiEmbedPropsFromServer.response'

@ObjectType()
export class PowerBiSlice {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @Field(() => graphqlTypeJson, { nullable: true })
  powerBiEmbedProps?: Record<string, unknown>

  @Field({ nullable: true })
  workspaceId?: string

  @Field({ nullable: true })
  reportId?: string

  @Field({ nullable: true })
  owner?: 'Fiskistofa'

  @CacheField(() => GetPowerBiEmbedPropsFromServerResponse, { nullable: true })
  powerBiEmbedPropsFromServer?: GetPowerBiEmbedPropsFromServerResponse | null
}

export const mapPowerBiSlice = ({
  fields,
  sys,
}: IPowerBiSlice): SystemMetadata<PowerBiSlice> => {
  return {
    typename: 'PowerBiSlice',
    id: sys.id,
    title: fields.title ?? '',
    powerBiEmbedProps: fields.config ?? null,
    workspaceId: fields.workSpaceId,
    reportId: fields.reportId,
    owner: fields.owner,
    powerBiEmbedPropsFromServer: null,
  }
}
