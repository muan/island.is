import { useQuery } from '@apollo/client'
import { Alert, Button, Input, InputRow } from '@island.is/island-ui-native'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { client } from '../../graphql/client'
import { NATION_REGISTRY_USER_QUERY } from '../../graphql/queries/national-registry-user.query'
import { useIntl } from 'react-intl'
import { usePreferencesStore } from '../../stores/preferences-store'
import { testIDs } from '../../utils/test-ids'
import { navigateTo } from '../../lib/deep-linking'

export function formatNationalId(str: string = '') {
  return [str.substr(0, 6), str.substr(6, 4)].join('-')
}

export function TabPersonalInfo() {
  const intl = useIntl()
  const { dismiss, dismissed } = usePreferencesStore()
  const natRegRes = useQuery(NATION_REGISTRY_USER_QUERY, { client, fetchPolicy: 'cache-first' })
  const natRegData = natRegRes?.data?.nationalRegistryUser || {}
  const errorNatReg = !!natRegRes.error
  const loadingNatReg = natRegRes.loading

  return (
    <ScrollView style={{ flex: 1 }} testID={testIDs.USER_SCREEN_PROFILE_INFO}>
      <Alert
        type="info"
        visible={!dismissed.includes('userNatRegInformational')}
        message={intl.formatMessage({ id: 'user.natreg.infoBox' })}
        onClose={() => dismiss('userNatRegInformational')}
        hideIcon
      />
      <View style={{ height: 8 }} />
      <Input
        loading={loadingNatReg}
        error={errorNatReg}
        label={intl.formatMessage({ id: 'user.natreg.displayName' })}
        value={natRegData?.fullName}
        valueTestID={testIDs.USER_PROFILE_INFO_DISPLAY_NAME_VALUE}
      />
      <InputRow>
        <Input
          loading={loadingNatReg}
          error={errorNatReg}
          label={intl.formatMessage({ id: 'user.natreg.nationalId' })}
          value={
            !loadingNatReg && !errorNatReg
              ? formatNationalId(String(natRegData.nationalId))
              : undefined
          }
        />
        <Input
          loading={loadingNatReg}
          error={errorNatReg}
          label={intl.formatMessage({ id: 'user.natreg.birthPlace' })}
          value={natRegData?.birthPlace}
        />
      </InputRow>
      <Input
        loading={loadingNatReg}
        error={errorNatReg}
        label={intl.formatMessage({ id: 'user.natreg.legalResidence' })}
        value={natRegData?.legalResidence}
      />
      <InputRow>
        <Input
          loading={loadingNatReg}
          error={errorNatReg}
          label={intl.formatMessage({ id: 'user.natreg.gender' })}
          value={
            !loadingNatReg && !errorNatReg
              ? intl.formatMessage(
                  { id: 'user.natreg.genderValue' },
                  natRegData,
                )
              : undefined
          }
        />
        <Input
          loading={loadingNatReg}
          error={errorNatReg}
          label={intl.formatMessage({
            id: 'user.natreg.maritalStatus',
          })}
          value={
            !loadingNatReg && !errorNatReg
              ? intl.formatMessage(
                  { id: 'user.natreg.maritalStatusValue' },
                  natRegData,
                )
              : undefined
          }
        />
      </InputRow>
      <Input
        loading={loadingNatReg}
        error={errorNatReg}
        label={intl.formatMessage({ id: 'user.natreg.citizenship' })}
        value={natRegData?.citizenship?.name}
      />
      <Input
        loading={loadingNatReg}
        error={errorNatReg}
        label={intl.formatMessage({ id: 'user.natreg.religion' })}
        value={natRegData?.religion}
      />
      <View style={{ paddingHorizontal: 16, paddingVertical: 32 }}>
      <Button isOutlined title="Fara í stillingar" onPress={() => navigateTo(`/settings`)} />
      </View>
    </ScrollView>
  )
}
