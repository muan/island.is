import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { EducationPaths } from './paths'

export const educationNavigation: PortalNavigationItem = {
  name: m.education,
  path: EducationPaths.EducationRoot,
  icon: {
    icon: 'school',
  },
  description: m.educationDescription,
  children: [
    {
      name: m.myEducation,
      path: EducationPaths.EducationRoot,
    },
    {
      name: m.educationAssessment,
      path: EducationPaths.EducationAssessment,
    },
    {
      name: m.educationGraduation,
      path: EducationPaths.EducationHaskoliGraduation,
      children: [
        {
          name: m.overview,
          navHide: true,
          path: EducationPaths.EducationHaskoliGraduationDetail,
        },
      ],
    },
  ],
}
