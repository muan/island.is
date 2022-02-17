import React, { useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import {
  ModalBase,
  GridRow,
  GridColumn,
  GridContainer,
  Button,
  Box,
  Columns,
  Column,
} from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'
import { servicePortalCloseOnBoardingModal } from '@island.is/plausible'
import { useLocation } from 'react-router-dom'
import { OnboardingHeader } from './components/Header'
import ProfileForm from '../Forms/ProfileForm/ProfileForm'
import * as styles from './UserOnboardingModal.css'

const UserOnboardingModal: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.settings')
  const [toggleCloseModal, setToggleCloseModal] = useState(false)
  const [canDropOverlay, setCanDropOverlay] = useState(false)
  const { formatMessage } = useLocale()

  const { pathname } = useLocation()

  const dropOnboardingSideEffects = () => {
    servicePortalCloseOnBoardingModal(pathname)
  }

  const closeModal = () => {
    setToggleCloseModal(true)
    dropOnboardingSideEffects()
  }

  return (
    <ModalBase
      baseId="user-onboarding-modal"
      toggleClose={toggleCloseModal}
      hideOnClickOutside={false}
      initialVisibility={true}
      className={styles.dialog}
    >
      <GridContainer>
        <GridRow marginBottom={4}>
          <GridColumn span="12/12">
            <OnboardingHeader dropOnboarding={() => setCanDropOverlay(true)} />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '3/12']} />
          <GridColumn span={['12/12', '12/12', '12/12', '9/12']}>
            <ProfileForm
              title={userInfo?.profile?.name || ''}
              onCloseOverlay={closeModal}
              onCloseDropModal={() => setCanDropOverlay(false)}
              canDrop={canDropOverlay}
            />
            <Columns>
              <Column width="9/12">
                <Box
                  display="flex"
                  alignItems="flexEnd"
                  flexDirection="column"
                  paddingTop={2}
                >
                  <Button
                    icon="checkmark"
                    onClick={() => setCanDropOverlay(true)}
                  >
                    {formatMessage(m.continue)}
                  </Button>
                </Box>
              </Column>
            </Columns>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </ModalBase>
  )
}

export default UserOnboardingModal
