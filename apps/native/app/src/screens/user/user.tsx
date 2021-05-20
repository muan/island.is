import { NavigationBarSheet, TabBar } from '@island.is/island-ui-native'
import React, { useState } from 'react'
import { View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent
} from 'react-native-navigation'
import { useTheme } from 'styled-components'
import { useScreenOptions } from '../../contexts/theme-provider'
import { useIntl } from '../../utils/intl'
import { testIDs } from '../../utils/test-ids'
import { TabPersonalInfo } from './tab-personal-info'
import { TabSettings } from './tab-settings'

export const UserScreen: NavigationFunctionComponent = ({ componentId }) => {
  const intl = useIntl()
  const theme = useTheme()
  const [tab, setTab] = useState(0)

  useScreenOptions(
    () => ({
      layout: {
        backgroundColor: theme.shade.background,
        componentBackgroundColor: theme.shade.background,
      },
    }),
    [theme],
  )

  return (
    <View style={{ flex: 1 }} testID={testIDs.SCREEN_USER}>
      <NavigationBarSheet
        title={intl.formatMessage({ id: 'user.screenTitle' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
      <TabBar
        values={[
          {
            testID: testIDs.USER_TABBAR_TAB_PROFILE_INFO,
            label: intl.formatMessage({ id: 'user.tabs.personalInfo' })
          },
          {
            testID: testIDs.USER_TABBAR_TAB_SETTINGS,
            label: intl.formatMessage({ id: 'user.tabs.preferences' })
          },
        ]}
        onChange={(selectedIndex) => setTab(selectedIndex)}
        selectedIndex={tab}
      />
      {tab === 0 && <TabPersonalInfo />}
      {tab === 1 && <TabSettings />}
    </View>
  )
}

UserScreen.options = {
  topBar: {
    visible: false,
  },
}
