import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { ILifeEventPage } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { ArticleCategory, mapArticleCategory } from './articleCategory.model'
import { mapDocument, SliceUnion } from '../unions/slice.union'

@ObjectType()
export class LifeEventPage {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field(() => String, { nullable: true })
  shortTitle?: string | null

  @Field()
  slug!: string

  @Field({ nullable: true })
  intro?: string

  @Field({ nullable: true })
  shortIntro?: string

  @CacheField(() => Image, { nullable: true })
  image?: Image | null

  @CacheField(() => Image, { nullable: true })
  thumbnail?: Image | null

  @CacheField(() => Image, { nullable: true })
  tinyThumbnail?: Image | null

  @CacheField(() => [SliceUnion])
  content!: Array<typeof SliceUnion>

  @CacheField(() => ArticleCategory, { nullable: true })
  category?: ArticleCategory | null

  @Field({ nullable: true })
  seeMoreText?: string

  @Field({ nullable: true })
  pageType?: 'Life Event' | 'Digital Iceland Service'

  @CacheField(() => Image, { nullable: true })
  featuredImage?: Image | null
}

export const mapLifeEventPage = ({
  fields,
  sys,
}: ILifeEventPage): LifeEventPage => ({
  id: sys.id,
  title: fields.title ?? '',
  shortTitle: fields.shortTitle ?? '',
  slug: fields.slug ?? '',
  intro: fields.intro ?? '',
  image: fields.image ? mapImage(fields.image) : null,
  thumbnail: fields.thumbnail ? mapImage(fields.thumbnail) : null,
  tinyThumbnail: fields.tinyThumbnail ? mapImage(fields.tinyThumbnail) : null,
  content: fields?.content
    ? mapDocument(fields.content, sys.id + ':content')
    : [],
  category: fields.category ? mapArticleCategory(fields.category) : null,
  shortIntro: fields.shortIntro ?? '',
  seeMoreText: fields.seeMoreText ?? '',
  pageType: fields.pageType ?? 'Life Event',
  featuredImage: fields.featuredImage ? mapImage(fields.featuredImage) : null,
})
