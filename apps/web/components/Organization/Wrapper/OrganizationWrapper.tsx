import React, { ReactNode, useEffect, useState, useMemo } from 'react'
import { useWindowSize } from 'react-use'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { theme } from '@island.is/island-ui/theme'
import { LayoutProps } from '@island.is/web/layouts/main'
import {
  Image,
  Organization,
  OrganizationPage,
} from '@island.is/web/graphql/schema'
import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  Navigation,
  NavigationItem,
  ProfileCard,
  Stack,
  Text,
  Button,
  Inline,
} from '@island.is/island-ui/core'
import {
  HeadWithSocialSharing,
  LiveChatIncChatPanel,
  Sticky,
  SidebarShipSearchInput,
  Webreader,
  SearchBox,
} from '@island.is/web/components'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { usePlausiblePageview } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { WatsonChatPanel } from '@island.is/web/components'

import { SyslumennHeader, SyslumennFooter } from './Themes/SyslumennTheme'
import {
  SjukratryggingarHeader,
  SjukratryggingarFooter,
} from './Themes/SjukratryggingarTheme'
import { DigitalIcelandHeader } from './Themes/DigitalIcelandTheme'
import { DefaultHeader } from './Themes/DefaultTheme'
import { MannaudstorgFooter } from './Themes/MannaudstorgTheme'
import { liveChatIncConfig, watsonConfig } from './config'
import { LandlaeknirFooter } from './Themes/LandlaeknirTheme'
import { HeilbrigdisstofnunNordurlandsHeader } from './Themes/HeilbrigdisstofnunNordurlandsTheme'
import { LandlaeknirHeader } from './Themes/LandlaeknirTheme'
import { HeilbrigdisstofnunNordurlandsFooter } from './Themes/HeilbrigdisstofnunNordurlandsTheme'
import {
  UtlendingastofnunFooter,
  UtlendingastofnunHeader,
} from './Themes/UtlendingastofnunTheme'
import { FiskistofaHeader } from './Themes/FiskistofaTheme'
import { FiskistofaFooter } from './Themes/FiskistofaTheme'
import { LandskjorstjornFooter } from './Themes/LandkjorstjornTheme'
import { LatestNewsCardConnectedComponent } from '../LatestNewsCardConnectedComponent'
import { RikislogmadurHeader } from './Themes/RikislogmadurTheme'
import { RikislogmadurFooter } from './Themes/RikislogmadurTheme'
import { LandskjorstjornHeader } from './Themes/LandkjorstjornTheme'
import {
  FjarsyslaRikisinsHeader,
  FjarsyslaRikisinsFooter,
} from './Themes/FjarsyslaRikisinsTheme'
import { HeilbrigdisstofnunSudurlandsFooter } from './Themes/HeilbrigdisstofnunSudurlandsTheme'
import { HeilbrigdisstofnunSudurlandsHeader } from './Themes/HeilbrigdisstofnunSudurlandsTheme'
import {
  TryggingastofnunFooter,
  TryggingastofnunHeader,
} from './Themes/TryggingastofnunTheme'
import { SAkFooter, SAkHeader } from './Themes/SAkTheme'
import { GevFooter, GevHeader } from './Themes/GevTheme'
import { HveHeader, HveFooter } from './Themes/HveTheme'
import { ShhFooter, ShhHeader } from './Themes/SHHTheme'
import {
  HeilbrigdisstofnunAusturlandsFooter,
  HeilbrigdisstofnunAusturlandsHeader,
} from './Themes/HeilbrigdisstofnunAusturlandsTheme'
import { UniversityStudiesHeader } from './Themes/UniversityStudiesTheme'
import {
  IcelandicNaturalDisasterInsuranceHeader,
  IcelandicNaturalDisasterInsuranceFooter,
} from './Themes/IcelandicNaturalDisasterInsuranceTheme'
import {
  TransportAuthorityFooter,
  TransportAuthorityHeader,
} from './Themes/TransportAuthorityTheme'

import * as styles from './OrganizationWrapper.css'

interface NavigationData {
  title: string
  activeItemTitle?: string
  items: NavigationItem[]
}

interface WrapperProps {
  pageTitle: string
  pageDescription?: string
  pageFeaturedImage?: Image
  organizationPage: OrganizationPage
  breadcrumbItems?: BreadCrumbItem[]
  mainContent?: ReactNode
  sidebarContent?: ReactNode
  navigationData: NavigationData
  fullWidthContent?: boolean
  stickySidebar?: boolean
  minimal?: boolean
  showSecondaryMenu?: boolean
  showExternalLinks?: boolean
  showReadSpeaker?: boolean
}

interface HeaderProps {
  organizationPage: OrganizationPage
}

export const lightThemes = [
  'digital_iceland',
  'default',
  'fiskistofa',
  'landing_page',
  'tryggingastofnun',
  'hve',
  'hsa',
  'haskolanam',
  'nti',
  'samgongustofa',
]
export const footerEnabled = [
  'syslumenn',
  'district-commissioner',

  'utlendingastofnun',
  'directorate-of-immigration',

  'landlaeknir',
  'directorate-of-health',

  'sjukratryggingar',
  'icelandic-health-insurance',

  'mannaudstorg',

  'fiskistofa',
  'directorate-of-fisheries',

  'landskjorstjorn',

  'hsn',
  'hsu',

  'rikislogmadur',
  'office-of-the-attorney-general-civil-affairs',

  'fjarsyslan',
  'the-financial-management-authority',

  'sak',

  'hve',

  'tryggingastofnun',
  'insurance-administration',

  'gev',

  'shh',

  'hsa',

  'nti',

  'samgongustofa',
  'transport-authority',
]

export const getThemeConfig = (
  theme: string,
  slug: string,
): { themeConfig: Partial<LayoutProps> } => {
  let footerVersion: LayoutProps['footerVersion'] = 'default'

  if (footerEnabled.includes(slug) || theme === 'landing_page') {
    footerVersion = 'organization'
  }

  if (
    theme === 'sjukratryggingar' ||
    theme === 'rikislogmadur' ||
    theme === 'tryggingastofnun' ||
    theme === 'nti'
  )
    return {
      themeConfig: {
        headerButtonColorScheme: 'blueberry',
        headerColorScheme: 'blueberry',
        footerVersion,
      },
    }

  const isLightTheme = lightThemes.includes(theme)
  return !isLightTheme
    ? {
        themeConfig: {
          headerColorScheme: 'white',
          headerButtonColorScheme: 'negative',
          footerVersion,
        },
      }
    : { themeConfig: { footerVersion } }
}

export const OrganizationHeader: React.FC<HeaderProps> = ({
  organizationPage,
}) => {
  switch (organizationPage.theme) {
    case 'syslumenn':
      return <SyslumennHeader organizationPage={organizationPage} />
    case 'sjukratryggingar':
      return <SjukratryggingarHeader organizationPage={organizationPage} />
    case 'utlendingastofnun':
      return <UtlendingastofnunHeader organizationPage={organizationPage} />
    case 'digital_iceland':
      return <DigitalIcelandHeader organizationPage={organizationPage} />
    case 'hsn':
      return (
        <HeilbrigdisstofnunNordurlandsHeader
          organizationPage={organizationPage}
        />
      )
    case 'hsu':
      return (
        <HeilbrigdisstofnunSudurlandsHeader
          organizationPage={organizationPage}
        />
      )
    case 'landlaeknir':
      return <LandlaeknirHeader organizationPage={organizationPage} />
    case 'fiskistofa':
      return <FiskistofaHeader organizationPage={organizationPage} />
    case 'rikislogmadur':
      return <RikislogmadurHeader organizationPage={organizationPage} />
    case 'landskjorstjorn':
      return <LandskjorstjornHeader organizationPage={organizationPage} />
    case 'landing_page':
      return null
    case 'fjarsysla-rikisins':
      return <FjarsyslaRikisinsHeader organizationPage={organizationPage} />
    case 'tryggingastofnun':
      return <TryggingastofnunHeader organizationPage={organizationPage} />
    case 'sak':
      return <SAkHeader organizationPage={organizationPage} />
    case 'gev':
      return <GevHeader organizationPage={organizationPage} />
    case 'hve':
      return <HveHeader organizationPage={organizationPage} />
    case 'shh':
      return <ShhHeader organizationPage={organizationPage} />
    case 'hsa':
      return (
        <HeilbrigdisstofnunAusturlandsHeader
          organizationPage={organizationPage}
        />
      )
    case 'haskolanam':
      return <UniversityStudiesHeader organizationPage={organizationPage} />
    case 'nti':
      return (
        <IcelandicNaturalDisasterInsuranceHeader
          organizationPage={organizationPage}
        />
      )
    case 'samgongustofa':
      return <TransportAuthorityHeader organizationPage={organizationPage} />
    default:
      return <DefaultHeader organizationPage={organizationPage} />
  }
}

interface ExternalLinksProps {
  organizationPage: OrganizationPage
  showOnMobile?: boolean
}

export const OrganizationExternalLinks: React.FC<ExternalLinksProps> = ({
  organizationPage,
  showOnMobile = true,
}) => {
  if (organizationPage.externalLinks?.length) {
    const mobileDisplay = showOnMobile ? 'flex' : 'none'
    return (
      <Box
        display={[mobileDisplay, mobileDisplay, 'flex', 'flex']}
        justifyContent={[
          'center',
          showOnMobile ? 'flexEnd' : 'center',
          'flexEnd',
        ]}
        marginBottom={4}
      >
        <Inline
          flexWrap={
            organizationPage.externalLinks?.length === 2 ? 'nowrap' : 'wrap'
          }
          space={2}
        >
          {organizationPage.externalLinks.map((link, index) => {
            // Sjukratryggingar's external links have custom styled buttons
            const isSjukratryggingar =
              organizationPage.slug === 'sjukratryggingar' ||
              organizationPage.slug === 'icelandic-health-insurance'

            let variant = undefined
            if (
              isSjukratryggingar &&
              organizationPage.externalLinks.length === 2
            ) {
              variant = index === 0 ? 'primary' : 'ghost'
            }

            return (
              <Link
                href={link.url}
                key={'organization-external-link-' + index}
                pureChildren={true}
              >
                <Button
                  as="a"
                  variant={variant}
                  icon={isSjukratryggingar ? 'lockClosed' : 'open'}
                  iconType="outline"
                  size="medium"
                >
                  <Box paddingY={[0, 2]} paddingLeft={[0, 2]}>
                    {link.text}
                  </Box>
                </Button>
              </Link>
            )
          })}
        </Inline>
      </Box>
    )
  }
  return null
}

interface FooterProps {
  organizations: Array<Organization>
  force?: boolean
}

export const OrganizationFooter: React.FC<FooterProps> = ({
  organizations,
  force = false,
}) => {
  const organization = force
    ? organizations[0]
    : organizations.find((x) => footerEnabled.includes(x.slug))

  const namespace = useMemo(
    () => JSON.parse(organization?.namespace?.fields ?? '{}'),
    [],
  )

  let OrganizationFooterComponent = null

  switch (organization?.slug) {
    case 'syslumenn':
    case 'district-commissioner':
      OrganizationFooterComponent = (
        <SyslumennFooter
          title={organization.title}
          logo={organization.logo?.url}
          footerItems={organization.footerItems}
          namespace={namespace}
        />
      )
      break
    case 'sjukratryggingar':
    case 'icelandic-health-insurance':
      OrganizationFooterComponent = (
        <SjukratryggingarFooter
          footerItems={organization.footerItems}
          namespace={namespace}
          organizationSlug={organization.slug}
        />
      )
      break
    case 'utlendingastofnun':
    case 'directorate-of-immigration':
      OrganizationFooterComponent = (
        <UtlendingastofnunFooter
          title={organization.title}
          logo={organization.logo?.url}
          footerItems={organization.footerItems}
        />
      )
      break
    case 'mannaudstorg':
      OrganizationFooterComponent = (
        <MannaudstorgFooter
          title={organization.title}
          logoSrc={organization.logo?.url}
          footerItems={organization.footerItems}
        />
      )
      break
    case 'landlaeknir':
    case 'directorate-of-health':
      OrganizationFooterComponent = (
        <LandlaeknirFooter
          footerItems={organization.footerItems}
          namespace={namespace}
        />
      )
      break
    case 'hsn':
      OrganizationFooterComponent = (
        <HeilbrigdisstofnunNordurlandsFooter
          footerItems={organization.footerItems}
          namespace={namespace}
        />
      )
      break
    case 'hsu':
      OrganizationFooterComponent = (
        <HeilbrigdisstofnunSudurlandsFooter
          footerItems={organization.footerItems}
          namespace={namespace}
        />
      )
      break
    case 'fiskistofa':
    case 'directorate-of-fisheries':
      OrganizationFooterComponent = (
        <FiskistofaFooter
          footerItems={organization.footerItems}
          namespace={namespace}
        />
      )
      break
    case 'landskjorstjorn':
      OrganizationFooterComponent = (
        <LandskjorstjornFooter
          footerItems={organization.footerItems}
          namespace={namespace}
        />
      )
      break
    case 'rikislogmadur':
    case 'office-of-the-attorney-general-civil-affairs':
      OrganizationFooterComponent = (
        <RikislogmadurFooter
          title={organization.title}
          footerItems={organization.footerItems}
          logo={organization.logo?.url}
        />
      )
      break
    case 'sak':
    case 'sjukrahusid-akureyri':
    case 'akureyri-hospital':
      OrganizationFooterComponent = (
        <SAkFooter
          title={organization.title}
          footerItems={organization.footerItems}
          logo={organization.logo?.url}
        />
      )
      break
    case 'fjarsysla-rikisins':
    case 'the-financial-management-authority':
      OrganizationFooterComponent = (
        <FjarsyslaRikisinsFooter
          namespace={namespace}
          title={organization.title}
        />
      )
      break
    case 'hve':
      OrganizationFooterComponent = (
        <HveFooter
          footerItems={organization.footerItems}
          namespace={namespace}
          logo={organization.logo?.url}
          title={organization.title}
        />
      )
      break
    case 'tryggingastofnun':
    case 'insurance-administration':
      OrganizationFooterComponent = (
        <TryggingastofnunFooter
          footerItems={organization.footerItems}
          namespace={namespace}
        />
      )
      break
    case 'gev':
      OrganizationFooterComponent = (
        <GevFooter
          title={organization.title}
          namespace={namespace}
          footerItems={organization.footerItems}
        />
      )
      break
    case 'shh':
    case 'samskiptamidstoed-heyrnarlausra-og-heyrnarskertra':
    case 'the-communication-center-for-the-deaf-and-hearing-impaired':
      OrganizationFooterComponent = (
        <ShhFooter
          title={organization.title}
          namespace={namespace}
          footerItems={organization.footerItems}
        />
      )
      break
    case 'hsa':
      OrganizationFooterComponent = (
        <HeilbrigdisstofnunAusturlandsFooter
          title={organization.title}
          namespace={namespace}
          footerItems={organization.footerItems}
        />
      )
      break
    case 'nti':
      OrganizationFooterComponent = (
        <IcelandicNaturalDisasterInsuranceFooter
          footerItems={organization.footerItems}
          namespace={namespace}
        />
      )
      break
    case 'samgongustofa':
    case 'transport-authority':
      OrganizationFooterComponent = (
        <TransportAuthorityFooter
          title={organization.title}
          footerItems={organization.footerItems}
          logo={organization.logo?.url}
        />
      )
      break
  }

  return OrganizationFooterComponent
}

export const OrganizationChatPanel = ({
  organizationIds,
}: {
  organizationIds: string[]
  pushUp?: boolean
}) => {
  const { activeLocale } = useI18n()

  const organizationIdWithLiveChat = organizationIds.find((id) => {
    return id in liveChatIncConfig
  })

  if (organizationIdWithLiveChat) {
    return (
      <LiveChatIncChatPanel
        {...liveChatIncConfig[organizationIdWithLiveChat]}
      />
    )
  }

  const organizationIdWithWatson = organizationIds.find((id) => {
    return id in watsonConfig[activeLocale]
  })

  if (organizationIdWithWatson) {
    return (
      <WatsonChatPanel
        {...watsonConfig[activeLocale][organizationIdWithWatson]}
      />
    )
  }

  return null
}

const SecondaryMenu = ({
  title,
  items,
}: {
  title: string
  items: NavigationItem[]
}) => (
  <Box
    background="purple100"
    borderRadius="large"
    padding={[3, 3, 4]}
    marginY={3}
  >
    <Stack space={[1, 1, 2]}>
      <Text variant="eyebrow" as="h2">
        {title}
      </Text>
      {items.map((link) => (
        <Link key={link.href} href={link.href} underline="normal">
          <Text
            key={link.href}
            as="span"
            variant={link.active ? 'h5' : 'default'}
          >
            {link.title}
          </Text>
        </Link>
      ))}
    </Stack>
  </Box>
)

const getActiveNavigationItemTitle = (
  navigationItems: NavigationItem[],
  clientUrl: string,
) => {
  for (const item of navigationItems) {
    if (clientUrl === item.href) {
      return item.title
    }
    for (const childItem of item.items) {
      if (clientUrl === childItem.href) {
        return childItem.title
      }
    }
  }
}

const renderConnectedComponent = (slice) => {
  if (!slice?.componentType) return null

  switch (slice.componentType) {
    case 'LatestNewsCard':
      return (
        <LatestNewsCardConnectedComponent key={slice?.id} {...slice?.json} />
      )
    case 'Fiskistofa/ShipSearchSidebarInput':
      return (
        <SidebarShipSearchInput key={slice?.id} namespace={slice?.json ?? {}} />
      )
    case 'OrganizationSearchBox':
      return <SearchBox key={slice?.id} {...slice?.json} />
    default:
      return null
  }
}

export const OrganizationWrapper: React.FC<WrapperProps> = ({
  pageTitle,
  pageDescription,
  pageFeaturedImage,
  organizationPage,
  breadcrumbItems,
  mainContent,
  sidebarContent,
  navigationData,
  fullWidthContent = false,
  stickySidebar = true,
  children,
  minimal = false,
  showSecondaryMenu = true,
  showExternalLinks = false,
  showReadSpeaker = true,
}) => {
  const router = useRouter()
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState<boolean | undefined>()

  usePlausiblePageview(organizationPage.organization?.trackingDomain)

  useEffect(() => setIsMobile(width < theme.breakpoints.md), [width])

  const secondaryNavList: NavigationItem[] =
    organizationPage.secondaryMenu?.childrenLinks.map(({ text, url }) => ({
      title: text,
      href: url,
      active: router.asPath === url,
    })) ?? []

  const activeNavigationItemTitle = useMemo(
    () => getActiveNavigationItemTitle(navigationData.items, router.asPath),
    [navigationData.items, router.asPath],
  )

  const metaTitleSuffix =
    pageTitle !== organizationPage.title ? ` | ${organizationPage.title}` : ''

  const SidebarContainer = stickySidebar ? Sticky : Box

  return (
    <>
      <HeadWithSocialSharing
        title={`${pageTitle}${metaTitleSuffix}`}
        description={pageDescription}
        imageUrl={pageFeaturedImage?.url}
        imageContentType={pageFeaturedImage?.contentType}
        imageWidth={pageFeaturedImage?.width?.toString()}
        imageHeight={pageFeaturedImage?.height?.toString()}
      />
      <OrganizationHeader organizationPage={organizationPage} />
      {!minimal && (
        <SidebarLayout
          paddingTop={[2, 2, 9]}
          paddingBottom={[4, 4, 4]}
          isSticky={false}
          fullWidthContent={fullWidthContent}
          sidebarContent={
            <SidebarContainer>
              <Navigation
                baseId="pageNav"
                items={navigationData.items}
                title={navigationData.title}
                activeItemTitle={activeNavigationItemTitle}
                renderLink={(link, item) => {
                  return item?.href ? (
                    <NextLink href={item?.href}>{link}</NextLink>
                  ) : (
                    link
                  )
                }}
              />
              {showSecondaryMenu && (
                <>
                  {organizationPage.secondaryMenu &&
                    secondaryNavList.length > 0 && (
                      <SecondaryMenu
                        title={organizationPage.secondaryMenu.name}
                        items={secondaryNavList}
                      />
                    )}
                  <Box
                    marginY={
                      organizationPage.secondaryMenu &&
                      secondaryNavList.length > 0
                        ? 0
                        : 3
                    }
                    className={styles.sidebarCardContainer}
                  >
                    {organizationPage.sidebarCards.map((card) => {
                      if (card.__typename === 'SidebarCard') {
                        return (
                          <ProfileCard
                            key={card.id}
                            title={card.title}
                            description={card.contentString}
                            link={card.link}
                            image={
                              card.image?.url ||
                              'https://images.ctfassets.net/8k0h54kbe6bj/6jpT5mePCNk02nVrzVLzt2/6adca7c10cc927d25597452d59c2a873/bitmap.png'
                            }
                            size="small"
                          />
                        )
                      }

                      if (card.__typename === 'ConnectedComponent') {
                        return renderConnectedComponent(card)
                      }

                      return null
                    })}
                  </Box>
                </>
              )}
              {sidebarContent}
            </SidebarContainer>
          }
        >
          {isMobile && (
            <Box className={styles.menuStyle}>
              {showExternalLinks && (
                <OrganizationExternalLinks
                  organizationPage={organizationPage}
                  showOnMobile={true}
                />
              )}
              <Box marginY={2}>
                <Navigation
                  baseId="pageNavMobile"
                  isMenuDialog={true}
                  items={navigationData.items}
                  title={navigationData.title}
                  activeItemTitle={activeNavigationItemTitle}
                  renderLink={(link, item) => {
                    return item?.href ? (
                      <NextLink href={item?.href}>{link}</NextLink>
                    ) : (
                      link
                    )
                  }}
                />
              </Box>
              {organizationPage.secondaryMenu && (
                <Box marginY={2}>
                  <Navigation
                    baseId="secondaryNav"
                    colorScheme="purple"
                    isMenuDialog={true}
                    title={organizationPage.secondaryMenu.name}
                    items={secondaryNavList}
                    renderLink={(link, item) => {
                      return item?.href ? (
                        <NextLink href={item?.href}>{link}</NextLink>
                      ) : (
                        link
                      )
                    }}
                  />
                </Box>
              )}
            </Box>
          )}

          <GridContainer>
            <GridRow>
              <GridColumn
                span={fullWidthContent ? ['9/9', '9/9', '7/9'] : '9/9'}
                offset={fullWidthContent ? ['0', '0', '1/9'] : '0'}
              >
                {showExternalLinks && (
                  <OrganizationExternalLinks
                    organizationPage={organizationPage}
                    showOnMobile={false}
                  />
                )}
                {breadcrumbItems && (
                  <Breadcrumbs
                    items={breadcrumbItems ?? []}
                    renderLink={(link, item) => {
                      return item?.href ? (
                        <NextLink href={item?.href}>{link}</NextLink>
                      ) : (
                        link
                      )
                    }}
                  />
                )}

                {showReadSpeaker && (
                  <Webreader
                    marginTop={breadcrumbItems?.length ? 3 : 0}
                    marginBottom={breadcrumbItems?.length ? 0 : 3}
                    readId={null}
                    readClass="rs_read"
                  />
                )}

                {pageDescription && (
                  <Box
                    className="rs_read"
                    paddingTop={[2, 2, breadcrumbItems ? 5 : 0]}
                  >
                    <Text variant="default">{pageDescription}</Text>
                  </Box>
                )}
              </GridColumn>
            </GridRow>
          </GridContainer>

          {isMobile && sidebarContent}

          <Box className="rs_read" paddingTop={fullWidthContent ? 0 : 4}>
            {mainContent ?? children}
          </Box>
        </SidebarLayout>
      )}

      {minimal && (
        <GridContainer>
          <GridRow>
            <GridColumn
              paddingTop={6}
              span={['12/12', '12/12', '10/12']}
              offset={['0', '0', '1/12']}
              className="rs_read"
            >
              {mainContent}
            </GridColumn>
          </GridRow>
        </GridContainer>
      )}
      {!!mainContent && <Box className="rs_read">{children}</Box>}
      {!minimal && (
        <Box className="rs_read">
          <OrganizationFooter
            organizations={[organizationPage.organization]}
            force={true}
          />
        </Box>
      )}
      <OrganizationChatPanel
        organizationIds={[organizationPage?.organization?.id]}
      />
    </>
  )
}
