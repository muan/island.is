import React, { FC, useEffect, useState } from 'react'
import Header from '../Header/Header'
import {
  Box,
  ToastContainer,
  Navigation,
  NavigationItem,
  Hidden,
} from '@island.is/island-ui/core'
import ContentBreadcrumbs from '../../components/ContentBreadcrumbs/ContentBreadcrumbs'
import AuthOverlay from '../Loaders/AuthOverlay/AuthOverlay'
import {
  m,
  ServicePortalNavigationItem,
  ServicePortalPath,
  useScrollTopOnUpdate,
} from '@island.is/service-portal/core'
import { useLocation, matchPath } from 'react-router-dom'
import { useLocale, useNamespaces } from '@island.is/localization'
import MobileMenu from '../MobileMenu/MobileMenu'
import { RemoveScroll } from 'react-remove-scroll'
import { GlobalAlertBannerSection } from '../AlertBanners/GlobalAlertBannerSection'
import {
  GET_ORGANIZATIONS_QUERY,
  Organization,
  useAlertBanners,
} from '@island.is/service-portal/graphql'
import { useMeasure } from 'react-use'
import InstitutionPanel from '../InstitutionPanel/InstitutionPanel'
import { useQuery } from '@apollo/client'
import SidebarLayout from './SidebarLayout'
import Sticky from '../Sticky/Sticky'
import { Link as ReactLink } from 'react-router-dom'
import Sidemenu from '../Sidemenu/Sidemenu'
import * as styles from './Layout.css'
import GoBack from '../GoBack/GoBack'
import { useDynamicRoutesWithNavigation } from '@island.is/service-portal/core'
import {
  getNavigationByPath,
  MAIN_NAVIGATION,
} from '../../lib/masterNavigation'

const Layout: FC = ({ children }) => {
  useNamespaces(['service.portal', 'global'])
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const [currentOrganization, setCurrentOrganization] = useState<
    Organization | undefined
  >(undefined)
  const { pathname } = useLocation()
  useScrollTopOnUpdate([pathname])
  const { formatMessage } = useLocale()

  const [isDashboard, setIsDashboard] = useState(true)
  const banners = useAlertBanners()
  const [ref, { height }] = useMeasure()
  const globalBanners = banners.filter((banner) =>
    banner.servicePortalPaths?.includes('*'),
  )
  const subNavItems: NavigationItem[] = []

  const mapChildren = (item: ServicePortalNavigationItem): any => {
    if (item.children) {
      return {
        title: formatMessage(item.name),
        href: item.path,
        active: matchPath(pathname, {
          path: item.path,
          exact: true,
          strict: false,
        }),
        items: item.children
          .filter((x) => !x.navHide)
          .map((child) => {
            return mapChildren(child)
          }),
      }
    } else {
      return {
        title: formatMessage(item.name),
        href: item.path,
        active: pathname === item.path,
      }
    }
  }

  const sidemenuNavigation = getNavigationByPath(pathname)
  if (sidemenuNavigation) {
    sidemenuNavigation.children
      ?.filter((item) => !item.navHide)
      ?.map((item: ServicePortalNavigationItem) =>
        subNavItems.push(mapChildren(item)),
      )
  }

  console.log(sidemenuNavigation)

  useEffect(() => {
    if (
      pathname === ServicePortalPath.MinarSidurPath + '/' ||
      pathname === ServicePortalPath.MinarSidurRoot
    ) {
      setIsDashboard(true)
    } else {
      setIsDashboard(false)
    }
  }, [pathname])

  const defaultOrg: Organization = {
    email: '',
    footerItems: [],
    id: '123',
    phone: '1234123',
    publishedMaterialSearchFilterGenericTags: [],
    shortTitle: 'Ísland.is',
    slug: 'island.is',
    tag: [],
    title: 'Stafrænt Ísland',
  }

  const { data: orgData, loading } = useQuery(GET_ORGANIZATIONS_QUERY)
  const organizations = orgData?.getOrganizations?.items || {}

  useEffect(() => {
    if (organizations && !loading) {
      const org = organizations.find(
        (org: Organization) => org.id === sidemenuNavigation?.serviceProvider,
      )
      setCurrentOrganization(org ?? defaultOrg)
    }
  }, [organizations, loading, sidemenuNavigation?.serviceProvider])

  return (
    <>
      <div className={sideMenuOpen ? styles.overlay : undefined}>
        <AuthOverlay />
        <ToastContainer useKeyframeStyles={false} />
        {globalBanners.length > 0 && (
          <GlobalAlertBannerSection ref={ref} banners={globalBanners} />
        )}
        <Header
          setSideMenuOpen={(set: boolean) => setSideMenuOpen(set)}
          sideMenuOpen={sideMenuOpen}
          position={height ? height : 0}
        />
        {!isDashboard && (
          <SidebarLayout
            isSticky={false}
            sidebarContent={
              <Sticky>
                <Box style={{ marginTop: height }}>
                  <GoBack />
                  <Box marginBottom={3}>
                    <InstitutionPanel
                      institution={currentOrganization?.title ?? ''}
                      institutionTitle={formatMessage(m.serviceProvider)}
                      locale="is"
                      linkHref={currentOrganization?.link ?? ''}
                      img={currentOrganization?.logo?.url ?? ''}
                      imgContainerDisplay={['block', 'block', 'block', 'block']}
                    />
                  </Box>
                  {subNavItems.length > 0 && (
                    <Box background="blue100">
                      <Navigation
                        renderLink={(link, item) => {
                          return item?.href ? (
                            <ReactLink to={item?.href}>{link}</ReactLink>
                          ) : (
                            link
                          )
                        }}
                        baseId={'service-portal-navigation'}
                        title={formatMessage(
                          sidemenuNavigation?.name ?? m.tableOfContents,
                        )}
                        items={subNavItems}
                        expand
                      />
                    </Box>
                  )}
                </Box>
              </Sticky>
            }
          >
            <Box as="main" component="main" style={{ marginTop: height }}>
              <ContentBreadcrumbs
                tag={{
                  variant: 'purple',
                  href: currentOrganization?.link ?? '',
                  children: currentOrganization?.title ?? '',
                  active: currentOrganization?.link ? true : false,
                }}
              />
              {subNavItems.length > 0 && (
                <Hidden above="sm">
                  <Box paddingBottom={3}>
                    <Navigation
                      renderLink={(link, item) => {
                        return item?.href ? (
                          <ReactLink to={item?.href}>{link}</ReactLink>
                        ) : (
                          link
                        )
                      }}
                      baseId={'service-portal-mobile-navigation'}
                      title={
                        sidemenuNavigation?.name
                          ? formatMessage(sidemenuNavigation?.name)
                          : formatMessage(m.tableOfContents)
                      }
                      items={subNavItems}
                      isMenuDialog={true}
                    />
                  </Box>
                </Hidden>
              )}
              {children}
            </Box>
          </SidebarLayout>
        )}
        {isDashboard && (
          <Box as="main" component="main" style={{ marginTop: height }}>
            <ContentBreadcrumbs />
            {children}
          </Box>
        )}
      </div>

      <Sidemenu
        position={height}
        setSideMenuOpen={(set: boolean) => setSideMenuOpen(set)}
        sideMenuOpen={sideMenuOpen}
      />
    </>
  )
}
export default Layout
