import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import partition from 'lodash/partition'
import { useQuery } from '@apollo/client'

import { AlertMessage, Box, Tabs, Text } from '@island.is/island-ui/core'
import {
  CaseListEntry,
  completedCaseStates,
  isIndictmentCase,
} from '@island.is/judicial-system/types'

import {
  PageHeader,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { titles, errors } from '@island.is/judicial-system-web/messages'
import { CasesQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import TableSkeleton from '@island.is/judicial-system-web/src/routes/Shared/Cases/TableSkeleton'
import SharedPageLayout from '@island.is/judicial-system-web/src/components/SharedPageLayout/SharedPageLayout'

import DefenderCasesTable from './DefenderCasesTable'
import { defenderCases as m } from './Cases.strings'
import * as styles from './Cases.css'

export const Cases: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  const availableTabs = ['active', 'completed']

  const [activeTab, setActiveTab] = useState<string>(() => {
    const selectedTab = localStorage.getItem('CASE_ACTIVE_TAB')
    return selectedTab && availableTabs.includes(selectedTab)
      ? selectedTab
      : availableTabs[0]
  })
  useEffect(() => {
    window.localStorage.setItem('CASE_ACTIVE_TAB', activeTab)
  }, [activeTab])

  const { data, error, loading } = useQuery<{
    cases?: CaseListEntry[]
  }>(CasesQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })
  const cases = data?.cases

  const [activeCases, completedCases]: [
    CaseListEntry[],
    CaseListEntry[],
  ] = useMemo(() => {
    if (!cases) {
      return [[], []]
    }

    return partition(cases, (c) => {
      if (isIndictmentCase(c.type)) {
        return !completedCaseStates.includes(c.state)
      } else {
        return !(completedCaseStates.includes(c.state) && c.rulingDate)
      }
    })
  }, [cases])

  return (
    <SharedPageLayout>
      <PageHeader title={formatMessage(titles.defender.cases)} />
      {error ? (
        <div
          className={styles.infoContainer}
          data-testid="custody-requests-error"
        >
          <AlertMessage
            title={formatMessage(errors.failedToFetchDataFromDbTitle)}
            message={formatMessage(errors.failedToFetchDataFromDbMessage)}
            type="error"
          />
        </div>
      ) : loading || !user ? (
        <TableSkeleton />
      ) : (
        <Box marginBottom={5}>
          <Text as="h1" variant="h1" marginBottom={1}>
            {formatMessage(m.casesTitle)}
          </Text>
          <Text as="h4"> {formatMessage(m.casesSubtitle)}</Text>
        </Box>
      )}

      <Tabs
        size="md"
        contentBackground="white"
        selected={activeTab}
        label=""
        onChange={(tabId) => {
          setActiveTab(tabId)
        }}
        tabs={[
          {
            id: 'active',
            label: formatMessage(m.activeCasesTabLabel),
            content: <DefenderCasesTable cases={activeCases} />,
          },
          {
            id: 'completed',
            label: formatMessage(m.completedCasesTabLabel),
            content: (
              <DefenderCasesTable
                cases={completedCases}
                showingCompletedCases={true}
              />
            ),
          },
        ]}
      />
    </SharedPageLayout>
  )
}

export default Cases
