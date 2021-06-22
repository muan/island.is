import React, { useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import {
  GET_CUSTOMER_CHARGETYPE,
  GET_CUSTOMER_RECORDS,
} from '@island.is/service-portal/graphql'
import format from 'date-fns/format'
import FinanceTransactionsTable from '../../components/FinanceTransactionsTable/FinanceTransactionsTable'
import {
  CustomerChargeType,
  CustomerRecords,
} from './FinanceTransactionsData.types'
import DropdownExport from '../../components/DropdownExport/DropdownExport'
import { m } from '../../lib/messages'
import {
  Box,
  Text,
  Columns,
  Column,
  Stack,
  GridRow,
  GridColumn,
  DatePicker,
  SkeletonLoader,
  Select,
  AlertBanner,
  Hidden,
} from '@island.is/island-ui/core'
import { greidsluStadaHeaders } from '../../utils/dataHeaders'
import {
  exportHreyfingarCSV,
  exportHreyfingarXSLX,
} from '../../utils/filesHreyfingar'
import { downloadXlsxDocument } from '@island.is/service-portal/graphql'
import { useLocale, useNamespaces } from '@island.is/localization'

const ALL_CHARGE_TYPES = 'ALL_CHARGE_TYPES'

const FinanceTransactions = () => {
  useNamespaces('sp.finance-transactions')
  const { formatMessage } = useLocale()
  const { downloadSheet } = downloadXlsxDocument()

  const [fromDate, setFromDate] = useState<string>()
  const [toDate, setToDate] = useState<string>()
  const [dropdownSelect, setDropdownSelect] = useState<string[] | undefined>([])

  const { data: customerChartypeData } = useQuery<Query>(
    GET_CUSTOMER_CHARGETYPE,
  )
  const chargeTypeData: CustomerChargeType =
    customerChartypeData?.getCustomerChargeType || {}

  const [loadCustomerRecords, { data, loading, called }] = useLazyQuery(
    GET_CUSTOMER_RECORDS,
  )

  useEffect(() => {
    if (toDate && fromDate && dropdownSelect) {
      loadCustomerRecords({
        variables: {
          input: {
            chargeTypeID: dropdownSelect,
            dayFrom: fromDate,
            dayTo: toDate,
          },
        },
      })
    }
  }, [toDate, fromDate, dropdownSelect])

  function onDropdownSelect(selection: any) {
    const allChargeTypeValues = chargeTypeData?.chargeType?.map((ct) => ct.id)
    const selectedID =
      selection.value === ALL_CHARGE_TYPES
        ? allChargeTypeValues
        : [selection.value]
    setDropdownSelect(selectedID)
  }

  const recordsData: CustomerRecords = data?.getCustomerRecords || {}
  const recordsDataArray = recordsData?.records || []

  const allChargeTypes = { label: 'Allar færslur', value: ALL_CHARGE_TYPES }
  const chargeTypeSelect = (chargeTypeData?.chargeType || []).map((item) => ({
    label: item.name,
    value: item.id,
  }))

  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={2}>
        <Text variant="h1" as="h1">
          {formatMessage({
            id: 'sp.finance-transactions:title',
            defaultMessage: 'Hreyfingar',
          })}
        </Text>
        <Columns collapseBelow="sm">
          <Column width="8/12">
            <Text variant="intro">
              {formatMessage({
                id: 'sp.finance-transactions:intro',
                defaultMessage:
                  'Hafið samband við viðeigandi umsjónarmann til að fá frekari upplýsingar um stöðu og innheimtu.',
              })}
            </Text>
          </Column>
        </Columns>
        <Box marginTop={[1, 1, 2, 2, 5]}>
          {recordsDataArray.length > 0 ? (
            <GridRow>
              <GridColumn paddingBottom={2} span={['1/1', '12/12']}>
                <Hidden print={true}>
                  <Columns space="p2" align="right">
                    <Column width="content">
                      <DropdownExport
                        onGetCSV={() => exportHreyfingarCSV(recordsDataArray)}
                        onGetExcel={() =>
                          downloadSheet({
                            headers: greidsluStadaHeaders,
                            data: exportHreyfingarXSLX(recordsDataArray),
                          })
                        }
                      />
                    </Column>
                  </Columns>
                </Hidden>
              </GridColumn>
            </GridRow>
          ) : null}
          <GridRow>
            <GridColumn paddingBottom={[1, 0]} span={['1/1', '4/12']}>
              <Select
                name="faerslur"
                backgroundColor="blue"
                placeholder={formatMessage(m.transactions)}
                label={formatMessage(m.transactionsLabel)}
                size="sm"
                options={[allChargeTypes, ...chargeTypeSelect]}
                onChange={(sel) => onDropdownSelect(sel)}
              />
            </GridColumn>
            <GridColumn span={['1/1', '4/12']}>
              <DatePicker
                backgroundColor="blue"
                handleChange={(d) => {
                  const date = format(d, 'yyyy-MM-dd')
                  setFromDate(date)
                }}
                icon="calendar"
                iconType="outline"
                size="sm"
                label={formatMessage(m.dateFrom)}
                locale="is"
                placeholderText={formatMessage(m.chooseDate)}
              />
            </GridColumn>
            <GridColumn span={['1/1', '4/12']}>
              <DatePicker
                backgroundColor="blue"
                handleChange={(d) => {
                  const date = format(d, 'yyyy-MM-dd')
                  setToDate(date)
                }}
                icon="calendar"
                iconType="outline"
                size="sm"
                label={formatMessage(m.dateTo)}
                locale="is"
                placeholderText={formatMessage(m.chooseDate)}
              />
            </GridColumn>
          </GridRow>
        </Box>
        <Box marginTop={2}>
          {!called && !loading && (
            <AlertBanner
              description={formatMessage(m.selectForResults)}
              variant="info"
            />
          )}
          {loading && (
            <Box padding={3}>
              <SkeletonLoader space={1} height={40} repeat={5} />
            </Box>
          )}
          {recordsDataArray.length === 0 && called && !loading && (
            <AlertBanner
              description={formatMessage(m.noResultsTryAgain)}
              variant="warning"
            />
          )}
          {recordsDataArray.length > 0 ? (
            <FinanceTransactionsTable recordsArray={recordsDataArray} />
          ) : null}
        </Box>
      </Stack>
    </Box>
  )
}

export default FinanceTransactions
