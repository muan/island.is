import React from 'react'
import { defineMessage } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { IntroHeader } from '@island.is/service-portal/core'
import { LicenseCards } from './components/LicenseCards'

function Licenses(): JSX.Element {
  useNamespaces('sp.licenses')

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={defineMessage({
          id: 'service.portal:licenses-title',
          defaultMessage: 'Skilríki',
        })}
        intro={defineMessage({
          id: 'service.portal:licenses-intro',
          defaultMessage: 'Þín skilríki!',
        })}
        img="./assets/images/educationLicense.svg"
      />
      <LicenseCards />
    </Box>
  )
}

export default Licenses
