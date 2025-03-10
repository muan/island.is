import React, { useContext } from 'react'

import { UserContext } from '@island.is/judicial-system-web/src/components'
import { UserRole } from '@island.is/judicial-system-web/src/graphql/schema'

import PrisonCases from './PrisonCases'
import Cases from './Cases'

export const AllCases: React.FC = () => {
  const { user } = useContext(UserContext)

  if (user?.role === UserRole.STAFF) {
    return <PrisonCases />
  }

  return <Cases />
}

export default AllCases
