import React, { useMemo } from 'react'
import {
  Text,
  Box,
  BulletList,
  Bullet,
  Button,
  LoadingDots,
} from '@island.is/island-ui/core'

import {
  Approved,
  ContentContainer,
  Footer,
  InProgress,
  Rejected,
  StatusLayout,
  Timeline,
} from '@island.is/financial-aid-web/osk/src/components'

import {
  Application,
  getActiveTypeForStatus,
} from '@island.is/financial-aid/shared'

import { useLogOut } from '@island.is/financial-aid-web/osk/src/utils/useLogOut'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { GetApplicationQuery } from '@island.is/financial-aid-web/oskgraphql'

interface ApplicantData {
  application: Application
}

const MainPage = () => {
  const router = useRouter()
  const logOut = useLogOut()

  const { data, error, loading } = useQuery<ApplicantData>(
    GetApplicationQuery,
    {
      variables: { input: { id: router.query.id } },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )
  const currentApplication = useMemo(() => {
    if (data?.application) {
      return data.application
    }
  }, [data])

  return (
    <StatusLayout>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={[1, 1, 2]}>
          Aðstoðin þín
        </Text>

        {currentApplication && (
          <>
            {getActiveTypeForStatus[currentApplication.state] ===
              'InProgress' && (
              <InProgress currentApplication={currentApplication} />
            )}

            {getActiveTypeForStatus[currentApplication.state] ===
              'Approved' && <Approved state={currentApplication.state} />}

            {getActiveTypeForStatus[currentApplication.state] ===
              'Rejected' && <Rejected state={currentApplication.state} />}

            <Timeline state={currentApplication.state} />
          </>
        )}
        {error && (
          <Text>
            {' '}
            Umsókn ekki fundin eða einhvað fór úrskeiðis, ertu viss þú hefur
            sótt um?{' '}
          </Text>
        )}
        {loading && <LoadingDots />}

        <Text as="h4" variant="h3" marginBottom={2} marginTop={[3, 3, 7]}>
          Frekari aðgerðir í boði
        </Text>
        <Box marginBottom={[5, 5, 10]}>
          <BulletList type={'ul'} space={2}>
            <Bullet>
              <Button
                colorScheme="default"
                iconType="filled"
                onClick={() => {
                  /*TODO on click event */
                }}
                preTextIconType="filled"
                size="default"
                type="button"
                variant="text"
              >
                Upplýsingar um fjárhagsaðstoð
              </Button>
            </Bullet>
            <Bullet>
              <Button
                colorScheme="default"
                iconType="filled"
                onClick={() => {
                  /*TODO on click event */
                }}
                preTextIconType="filled"
                size="default"
                type="button"
                variant="text"
              >
                Hafa samband
              </Button>
            </Bullet>
          </BulletList>
        </Box>
      </ContentContainer>
      <Footer
        onPrevButtonClick={() => {
          logOut()
        }}
        prevButtonText="Skrá sig út"
        previousIsDestructive={true}
        hideNextButton={true}
      />
    </StatusLayout>
  )
}

export default MainPage
