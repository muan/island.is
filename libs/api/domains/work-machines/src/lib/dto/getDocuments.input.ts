import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { FileType } from '../api-domains-work-machines.types'
import { IsEnum, IsOptional } from 'class-validator'

registerEnumType(FileType, { name: 'WorkMachinesFileType' })

@InputType('WorkMachinesCollectionDocumentInput')
export class GetDocumentsInput {
  @Field(() => FileType, { nullable: true })
  @IsEnum(FileType)
  @IsOptional()
  fileType?: FileType
}
