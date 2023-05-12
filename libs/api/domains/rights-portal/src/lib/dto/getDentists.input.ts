import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetDentistsInput {
  @Field()
  dateFrom!: string

  @Field()
  dateTo!: string
}
