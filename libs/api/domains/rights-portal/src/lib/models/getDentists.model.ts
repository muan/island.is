import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalDentists')
export class Dentists {
  @Field(() => String, { nullable: true })
  currentDentistName?: string | null

  @Field(() => [DentistBill], { nullable: true })
  billHistory?: Array<DentistBill> | null
}

@ObjectType('RightsPortalDentistBill')
export class DentistBill {
  @Field(() => Int, { nullable: true })
  number?: number | null

  @Field(() => Int, { nullable: true })
  amount?: number | null

  @Field(() => Int, { nullable: true })
  coveredAmount?: number | null

  @Field(() => Date, { nullable: true })
  date?: Date | null

  @Field(() => Date, { nullable: true })
  refundDate?: Date | null
}
