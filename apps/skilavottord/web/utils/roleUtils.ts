import startCase from 'lodash/startCase'

import { Locale } from '@island.is/shared/types'
import { Role } from '@island.is/skilavottord-web/graphql/schema'

export const getRoleTranslation = (role: Role, locale: Locale): string => {
  switch (role) {
    case Role.developer:
      return locale === 'is' ? 'Forritari' : 'Developer'
    case 'recyclingCompany':
      return locale === 'is' ? 'Móttökuaðili' : 'Recycling Company'
    case 'recyclingCompanyAdmin':
      return locale === 'is' ? 'Móttökuaðili Stjóri' : 'Recycling Company Admin'
    case 'recyclingFund':
      return locale === 'is' ? 'Úrvinnslusjóður' : 'Recycling Fund'
    default:
      return startCase(role)
  }
}
