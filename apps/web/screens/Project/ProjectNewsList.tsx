import { BreadCrumbItem } from '@island.is/island-ui/core'
import { HeadWithSocialSharing, NewsList } from '@island.is/web/components'
import { NewsListSidebar } from '@island.is/web/components'
import {
  GetContentSlugQuery,
  GetContentSlugQueryVariables,
  GetGenericTagBySlugQuery,
  GetGenericTagBySlugQueryVariables,
  GetNamespaceQuery,
  GetNewsDatesQuery,
  GetNewsQuery,
  ProjectPage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetNewsArgs,
  QueryGetNewsDatesArgs,
  QueryGetProjectPageArgs,
} from '@island.is/web/graphql/schema'
import { linkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { LayoutProps, withMainLayout } from '@island.is/web/layouts/main'
import type { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { Locale } from 'locale'
import capitalize from 'lodash/capitalize'
import { useRouter } from 'next/router'
import {
  GET_CONTENT_SLUG,
  GET_NAMESPACE_QUERY,
  GET_NEWS_DATES_QUERY,
  GET_NEWS_QUERY,
} from '../queries'
import { GET_GENERIC_TAG_BY_SLUG_QUERY } from '../queries/GenericTag'
import { GET_PROJECT_PAGE_QUERY } from '../queries/Project'
import { ProjectWrapper } from './components/ProjectWrapper'
import { getThemeConfig } from './utils'

const PERPAGE = 10

interface ProjectNewsListProps {
  projectPage: ProjectPage
  newsList: GetNewsQuery['getNews']['items']
  total: number
  datesMap: { [year: string]: number[] }
  selectedYear: number
  selectedMonth: number
  selectedPage: number
  selectedTag: string
  namespace: GetNamespaceQuery['getNamespace']
  locale: Locale
}

const ProjectNewsList: Screen<ProjectNewsListProps> = ({
  projectPage,
  newsList,
  total,
  datesMap,
  selectedYear,
  selectedMonth,
  selectedPage,
  selectedTag,
  namespace,
  locale,
}) => {
  const router = useRouter()
  const { getMonthByIndex } = useDateUtils()
  useContentfulId(projectPage.id)
  useLocalLinkTypeResolver()

  const n = useNamespace(namespace)

  const newsOverviewUrl = linkResolver(
    'projectnewsoverview',
    [projectPage.slug],
    locale,
  ).href

  const breadCrumbs: BreadCrumbItem[] = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
      typename: 'homepage',
    },
    {
      title: projectPage.title,
      href: linkResolver('projectpage', [projectPage.slug], locale).href,
      typename: 'projectpage',
    },
  ]

  const baseRouterPath = router.asPath.split('?')[0].split('#')[0]

  const currentNavItem = projectPage.sidebarLinks.find(
    ({ primaryLink }) => primaryLink?.url === baseRouterPath,
  )?.primaryLink

  const newsTitle =
    currentNavItem?.text ??
    newsList[0]?.genericTags.find((x) => x.slug === selectedTag)?.title ??
    n('newsTitle', 'Fréttir og tilkynningar')

  const allYearsString = n('allYears', 'Allar fréttir')
  const allMonthsString = n('allMonths', 'Allt árið')
  const years = Object.keys(datesMap)
  const months = datesMap[selectedYear] ?? []

  const yearOptions = [
    {
      label: allYearsString,
      value: allYearsString,
    },
    ...years.map((year) => ({
      label: year,
      value: year,
    })),
  ]

  const monthOptions = [
    {
      label: allMonthsString,
      value: undefined,
    },
    ...months.map((month) => ({
      label: capitalize(getMonthByIndex(month - 1)), // api returns months with index starting from 1 not 0 so we compensate
      value: month,
    })),
  ]

  return (
    <>
      <ProjectWrapper
        projectPage={projectPage}
        breadcrumbItems={breadCrumbs}
        sidebarNavigationTitle={n('navigationTitle', 'Efnisyfirlit')}
        withSidebar={true}
        sidebarContent={
          <NewsListSidebar
            months={months}
            namespace={namespace}
            newsOverviewUrl={newsOverviewUrl}
            selectedMonth={selectedMonth}
            selectedTag={selectedTag}
            selectedYear={selectedYear}
            title={newsTitle}
            yearOptions={yearOptions}
          />
        }
      >
        <NewsList
          namespace={namespace}
          newsItemLinkType="projectnews"
          newsOverviewUrl={newsOverviewUrl}
          newsList={newsList}
          parentPageSlug={projectPage.slug}
          selectedMonth={selectedMonth}
          selectedPage={selectedPage}
          selectedTag={selectedTag}
          selectedYear={selectedYear}
          total={total}
          yearOptions={yearOptions}
          monthOptions={monthOptions}
          title={newsTitle}
          newsPerPage={10}
          newsTags={projectPage.secondaryNewsTags}
        />
      </ProjectWrapper>
      <HeadWithSocialSharing
        title={`${newsTitle} | ${projectPage.title}`}
        description={projectPage.featuredDescription}
        imageUrl={projectPage.featuredImage?.url}
        imageWidth={projectPage.featuredImage?.width?.toString()}
        imageHeight={projectPage.featuredImage?.height?.toString()}
        imageContentType={projectPage.featuredImage?.contentType}
      />
    </>
  )
}

const createDatesMap = (datesList) => {
  return datesList.reduce((datesMap, date) => {
    const [year, month] = date.split('-')
    if (datesMap[year]) {
      datesMap[year].push(parseInt(month)) // we can assume each month only appears once
    } else {
      datesMap[year] = [parseInt(month)]
    }
    return datesMap
  }, {})
}

const getIntParam = (s: string | string[]) => {
  const i = parseInt(Array.isArray(s) ? s[0] : s, 10)
  if (!isNaN(i)) return i
}

ProjectNewsList.getInitialProps = async ({ apolloClient, query, locale }) => {
  const year = getIntParam(query.y)
  const month = year && getIntParam(query.m)
  const selectedPage = getIntParam(query.page) ?? 1

  const projectPage = (
    await Promise.resolve(
      apolloClient.query<Query, QueryGetProjectPageArgs>({
        query: GET_PROJECT_PAGE_QUERY,
        variables: {
          input: {
            slug: query.slug as string,
            lang: locale as Locale,
          },
        },
      }),
    )
  ).data?.getProjectPage

  if (!projectPage) {
    throw new CustomNextError(
      404,
      `Could not find project page with slug: ${query.slug}`,
    )
  }

  const tag = (query.tag as string) ?? projectPage?.newsTag?.slug ?? ''

  const [
    {
      data: { getNewsDates: newsDatesList },
    },
    {
      data: {
        getNews: { items: newsList, total },
      },
    },
    genericTagResponse,
    namespace,
  ] = await Promise.all([
    apolloClient.query<GetNewsDatesQuery, QueryGetNewsDatesArgs>({
      query: GET_NEWS_DATES_QUERY,
      variables: {
        input: {
          lang: locale as Locale,
          tag,
        },
      },
    }),
    apolloClient.query<GetNewsQuery, QueryGetNewsArgs>({
      query: GET_NEWS_QUERY,
      variables: {
        input: {
          lang: locale as Locale,
          size: PERPAGE,
          page: selectedPage,
          year,
          month,
          tags: [tag],
        },
      },
    }),
    query.tag
      ? apolloClient.query<
          GetGenericTagBySlugQuery,
          GetGenericTagBySlugQueryVariables
        >({
          query: GET_GENERIC_TAG_BY_SLUG_QUERY,
          variables: {
            input: {
              lang: locale as Locale,
              slug: query.tag as string,
            },
          },
        })
      : null,
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            lang: locale as Locale,
            namespace: 'NewsList',
          },
        },
      })
      .then((variables) => {
        // map data here to reduce data processing in component
        return JSON.parse(variables.data.getNamespace.fields)
      }),
  ])

  const genericTag = genericTagResponse?.data?.getGenericTagBySlug

  const languageToggleQueryParams: LayoutProps['languageToggleQueryParams'] = {
    en: {},
    is: {},
    [locale as Locale]: genericTag?.slug ? { tag: genericTag.slug } : {},
  }

  if (genericTag?.id) {
    const contentSlugResponse = await apolloClient.query<
      GetContentSlugQuery,
      GetContentSlugQueryVariables
    >({
      query: GET_CONTENT_SLUG,
      variables: {
        input: {
          id: genericTag.id,
        },
      },
    })

    const slugs = contentSlugResponse?.data?.getContentSlug?.slug ?? {
      en: '',
      is: '',
    }

    for (const lang of Object.keys(slugs)) {
      languageToggleQueryParams[lang as Locale] = { tag: slugs[lang] }
    }
  }

  return {
    projectPage,
    newsList: projectPage?.newsTag ? newsList : [],
    total,
    selectedYear: year,
    selectedMonth: month,
    selectedTag: tag,
    datesMap: createDatesMap(newsDatesList),
    selectedPage,
    namespace,
    locale: locale as Locale,
    languageToggleQueryParams,
    ...getThemeConfig(projectPage?.theme),
  }
}

export default withMainLayout(ProjectNewsList)
