import { ServicePortalNavigationItem } from '../service-portal-core'
import { m } from '../messages'
import { ServicePortalPath } from './paths'

export const servicePortalMasterNavigation: ServicePortalNavigationItem[] = [
  {
    name: m.overview,
    systemRoute: true,
    path: ServicePortalPath.MinarSidurRoot,
    icon: {
      icon: 'home',
    },
    children: [
      // Yfirlit
      {
        name: m.overview,
        systemRoute: true,
        path: ServicePortalPath.MinarSidurRoot,
        icon: {
          icon: 'home',
        },
        dataTestId: 'nav-overview'
      },

      // Rafraen skjol
      {
        name: m.documents,
        path: ServicePortalPath.ElectronicDocumentsRoot,
        icon: {
          icon: 'reader',
        },
        subscribesTo: 'documents',
        dataTestId: 'nav-documents'
      },

      // Umsoknir
      {
        name: m.applications,
        path: ServicePortalPath.ApplicationRoot,
        icon: {
          icon: 'fileTrayFull',
        },
      dataTestId: 'nav-applications'
      },

      // Company
      {
        name: m.companyTitle,
        path: ServicePortalPath.Company,
        icon: {
          icon: 'business',
        },
      dataTestId: 'nav-company'
      },

      // Min Gogn
      {
        name: m.userInfo,
        path: ServicePortalPath.MyInfoRoot,
        icon: {
          icon: 'person',
        },
        children: [
          {
            name: m.detailInfo,
            navHide: true,
            path: ServicePortalPath.UserInfo,
          },
          {
            name: m.family,
            navHide: true,
            path: ServicePortalPath.FamilyRoot,
            children: [
              {
                name: m.familySpouse,
                navHide: true,
                path: ServicePortalPath.Spouse,
              },
              {
                name: m.familyChild,
                navHide: true,
                path: ServicePortalPath.Child,
              },
            ],
          },
          {
            // Petitions
            name: m.endorsements,
            path: ServicePortalPath.Petitions,
          },
          {
            // Petitions Admin
            name: m.endorsementsAdmin,
            path: ServicePortalPath.PetitionsAdminView,
          },
        ],
      },
      // Mín skírteini
      {
        name: m.licenses,
        path: ServicePortalPath.LicensesRoot,

        icon: {
          icon: 'wallet',
        },
        children: [
          {
            navHide: true,
            name: m.drivingLicense,
            path: ServicePortalPath.LicensesDrivingDetail,
          },
        ],
      dataTestId: 'nav-licenses'
      },
      // Starfsleyfi
      {
        name: m.educationLicense,
        path: ServicePortalPath.EducationLicense,
        icon: {
          icon: 'receipt',
        },
      dataTestId: 'nav-educationLicense'
      },
      // Mín réttindi
      {
        name: m.delegation,
        path: ServicePortalPath.MyLicensesRoot,
        icon: {
          icon: 'receipt',
        },
        children: [
          {
            name: m.parentalLeave,
            path: ServicePortalPath.ParentalLeave,
          },
        ],
      dataTestId: 'nav-delegation'
      },
      // Menntun
      {
        name: m.education,
        path: ServicePortalPath.EducationRoot,
        icon: {
          icon: 'school',
        },
      dataTestId: 'nav-education'
      },
      {
        name: m.documentProvider,
        path: ServicePortalPath.DocumentProviderRoot,
        icon: {
          icon: 'receipt',
        },
        // The first release will only contain "Skjalaveitur" and only for the project owners.
        // Therefore 'children' are temporarily disabled to enhance the UX of the owners.
        // children: [
        //   {
        //     name: defineMessage({
        //       id: 'service.portal:document-provider-document-providers',
        //       defaultMessage: 'Skjalaveitendur',
        //     }),
        //     path: ServicePortalPath.DocumentProviderDocumentProviders,
        //   },
        //   {
        //     name: defineMessage({
        //       id: 'service.portal:document-provider-my-categories',
        //       defaultMessage: 'Mínar flokkar',
        //     }),
        //     path: ServicePortalPath.DocumentProviderMyCategories,
        //   },
        //   {
        //     name: defineMessage({
        //       id: 'service.portal:document-provider-settings',
        //       defaultMessage: 'Stillingar',
        //     }),
        //     path: ServicePortalPath.DocumentProviderSettingsRoot,
        //   },
        //   {
        //     name: defineMessage({
        //       id: 'service.portal:document-provider-technical-info',
        //       defaultMessage: 'Tæknilegar upplýsingar',
        //     }),
        //     path: ServicePortalPath.DocumentProviderTechnicalInfo,
        //   },
        //   {
        //     name: defineMessage({
        //       id: 'service.portal:document-provider-statistics',
        //       defaultMessage: 'Tölfræði',
        //     }),
        //     path: ServicePortalPath.DocumentProviderStatistics,
        //   },
        // ],
      },

      // Mannanafnaskrá
      {
        name: m.icelandicNamesRegistry,
        path: ServicePortalPath.IcelandicNamesRegistryRoot,
        icon: {
          icon: 'fileTrayFull',
        },
      },

      // Fasteignir
      {
        name: m.realEstate,
        path: ServicePortalPath.AssetsRoot,
        icon: {
          icon: 'home',
        },
        children: [
          {
            name: 'id',
            navHide: true,
            path: ServicePortalPath.AssetsRealEstateDetail,
          },
        ],
      },

      // Fjarmal
      {
        name: m.finance,
        path: ServicePortalPath.FinanceRoot,
        children: [
          {
            name: m.financeStatus,
            path: ServicePortalPath.FinanceStatus,
          },
          {
            name: m.financeTransactions,
            path: ServicePortalPath.FinanceTransactions,
          },
          {
            name: m.financeBills,
            path: ServicePortalPath.FinanceBills,
          },
          {
            name: m.financeSchedules,
            path: ServicePortalPath.FinanceSchedule,
          },
          {
            name: m.financeEmployeeClaims,
            path: ServicePortalPath.FinanceEmployeeClaims,
          },
          {
            name: m.financeLocalTax,
            path: ServicePortalPath.FinanceLocalTax,
          },
        ],
        icon: {
          icon: 'cellular',
        },
      },

      // Ökutæki
      {
        name: m.vehicles,
        path: ServicePortalPath.AssetsMyVehicles,
        icon: {
          icon: 'car',
        },
        children: [
          {
            name: m.myVehicles,
            path: ServicePortalPath.AssetsMyVehicles,
            children: [
              {
                // Path param reference
                name: 'id',
                navHide: true,
                path: ServicePortalPath.AssetsVehiclesDetail,
              },
            ],
          },
          // {
          //   name: m.vehiclesLookup,
          //   path: ServicePortalPath.AssetsVehiclesLookup,
          // },
          {
            name: m.vehiclesHistory,
            path: ServicePortalPath.AssetsVehiclesHistory,
          },
        ],
      },

      // Stillingar - hidden from nav
      {
        name: m.settings,
        navHide: true,
        children: [
          {
            name: m.accessControl,
            path: ServicePortalPath.SettingsAccessControl,
            children: [
              {
                name: m.accessControlGrant,
                path: ServicePortalPath.SettingsAccessControlGrant,
              },
              {
                name: m.accessControlAccess,
                path: ServicePortalPath.SettingsAccessControlAccess,
              },
            ],
          },
          {
            name: m.mySettings,
            path: ServicePortalPath.SettingsPersonalInformation,
          },
          {
            name: m.email,
            path: ServicePortalPath.SettingsPersonalInformationEditEmail,
          },
          {
            name: m.phone,
            path: ServicePortalPath.SettingsPersonalInformationEditPhoneNumber,
          },
          {
            name: m.nudge,
            path: ServicePortalPath.SettingsPersonalInformationEditNudge,
          },
          {
            name: m.language,
            path: ServicePortalPath.SettingsPersonalInformationEditLanguage,
          },
        ],
      },
      {
        name: m.accessControl,
        path: ServicePortalPath.SettingsAccessControl,
        icon: {
          icon: 'people',
        },
      },
    ],
  },
]
