import React, { useContext, useMemo } from 'react'
import cn from 'classnames'

import { theme } from '@island.is/island-ui/theme'
import { Box, Text } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { capitalize } from '@island.is/judicial-system/formatters'
import {
  CaseListEntry,
  isExtendedCourtRole,
} from '@island.is/judicial-system/types'
import { tables, core } from '@island.is/judicial-system-web/messages'
import {
  useSortCases,
  useViewport,
} from '@island.is/judicial-system-web/src/utils/hooks'

import {
  UserContext,
  TagAppealState,
  TagCaseState,
} from '@island.is/judicial-system-web/src/components'

import {
  ColumnCaseType,
  CourtCaseNumber,
  DefendantInfo,
  SortButton,
  TableContainer,
  TableHeaderText,
  DurationDate,
  getDurationDate,
} from '@island.is/judicial-system-web/src/components/Table'

import MobilePastCase from './MobilePastCase'
import * as styles from '../Table.css'

interface Props {
  cases: CaseListEntry[]
  onRowClick: (id: string) => void
  loading?: boolean
  testid?: string
}

const PastCasesTable: React.FC<Props> = (props) => {
  const { cases, onRowClick, loading = false, testid } = props
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  const { sortedData, requestSort, getClassNamesFor } = useSortCases(
    'createdAt',
    'descending',
    cases,
  )
  const pastCasesData = useMemo(
    () =>
      cases.sort((a: CaseListEntry, b: CaseListEntry) =>
        a['created'].localeCompare(b['created']),
      ),
    [cases],
  )

  const { width } = useViewport()

  return width < theme.breakpoints.md ? (
    <>
      {pastCasesData.map((theCase) => (
        <Box marginTop={2} key={theCase.id}>
          <MobilePastCase
            theCase={theCase}
            onClick={() => onRowClick(theCase.id)}
            isCourtRole={false}
          >
            <DurationDate
              key={`${theCase.id}-duration-date`}
              date={getDurationDate(
                theCase.state,
                theCase.validToDate,
                theCase.initialRulingDate,
                theCase.courtEndTime,
              )}
            />
          </MobilePastCase>
        </Box>
      ))}
    </>
  ) : (
    <TableContainer
      loading={loading}
      testid={testid}
      tableHeader={
        <>
          <TableHeaderText title={formatMessage(tables.caseNumber)} />
          <th className={cn(styles.th, styles.largeColumn)}>
            <SortButton
              title={capitalize(formatMessage(core.defendant, { suffix: 'i' }))}
              onClick={() => requestSort('defendant')}
              sortAsc={getClassNamesFor('defendant') === 'ascending'}
              sortDes={getClassNamesFor('defendant') === 'descending'}
            />
          </th>
          <TableHeaderText title={formatMessage(tables.type)} />
          <TableHeaderText title={formatMessage(tables.state)} />
          <TableHeaderText title={formatMessage(tables.duration)} />
        </>
      }
    >
      {sortedData.map((column) => {
        return (
          <tr
            className={styles.row}
            onClick={() => onRowClick(column.id)}
            key={column.id}
          >
            <td>
              <CourtCaseNumber
                courtCaseNumber={column.courtCaseNumber}
                policeCaseNumbers={column.policeCaseNumbers}
                appealCaseNumber={column.appealCaseNumber}
              />
            </td>
            <td className={cn(styles.td, styles.largeColumn)}>
              <DefendantInfo defendants={column.defendants} />
            </td>
            <td>
              <ColumnCaseType
                type={column.type}
                decision={column?.decision}
                parentCaseId={column.parentCaseId}
              />
            </td>
            <td>
              <Box marginRight={1} marginBottom={1}>
                <TagCaseState
                  caseState={column.state}
                  caseType={column.type}
                  isCourtRole={
                    user?.role ? isExtendedCourtRole(user.role) : false
                  }
                  isValidToDateInThePast={column.isValidToDateInThePast}
                />
              </Box>
              {column.appealState && (
                <TagAppealState
                  appealState={column.appealState}
                  appealRulingDecision={column.appealRulingDecision}
                />
              )}
            </td>
            <td>
              <Text>
                {getDurationDate(
                  column.state,
                  column.validToDate,
                  column.initialRulingDate,
                  column.courtEndTime,
                )}
              </Text>
            </td>
          </tr>
        )
      })}
    </TableContainer>
  )
}

export default PastCasesTable
