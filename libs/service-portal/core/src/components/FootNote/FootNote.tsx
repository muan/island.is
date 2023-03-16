import React, { useEffect, useState } from 'react'
import { Box, Hidden, Stack, Text } from '@island.is/island-ui/core'
import { useLocation } from 'react-router-dom'
import {
  Organization,
  useOrganizations,
} from '@island.is/service-portal/graphql'
import InstitutionPanel from '../InstitutionPanel/InstitutionPanel'

type Note = {
  text: string
  linkTitle?: string
  linkUrl?: string
}

interface Props {
  notes?: Note[]
  serviceProviderID?: string
  serviceProviderTooltip?: string
}

export const FootNote = ({
  notes,
  serviceProviderID,
  serviceProviderTooltip,
}: Props) => {
  const [currentOrganization, setCurrentOrganization] = useState<
    Organization | undefined
  >(undefined)
  const { pathname } = useLocation()
  const { data: organizations, loading } = useOrganizations()

  useEffect(() => {
    if (organizations && !loading) {
      const org = organizations.find(
        (org: Organization) => org.id === serviceProviderID,
      )
      if (org) setCurrentOrganization(org)
      else setCurrentOrganization(undefined)
    }
  }, [loading, pathname])

  return (
    <Box style={{ pageBreakBefore: 'always' }}>
      {notes?.map((item, index) => {
        return (
          <Stack space={3}>
            <Text variant="small" key={`footnote-item-${index}`}>
              {item.text}
            </Text>
          </Stack>
        )
      })}
      <Hidden above="sm">
        {currentOrganization && (
          <Box paddingY={3}>
            <InstitutionPanel
              loading={loading}
              linkHref={currentOrganization?.link ?? ''}
              img={currentOrganization?.logo?.url ?? ''}
              imgContainerDisplay="block"
              title={currentOrganization.title}
              tooltipText={serviceProviderTooltip}
            />
          </Box>
        )}
      </Hidden>
    </Box>
  )
}

export default FootNote
