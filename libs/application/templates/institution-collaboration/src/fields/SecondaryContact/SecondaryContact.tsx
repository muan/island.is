import * as styles from './SecondaryContact.css'

import { Box, Button, Icon, Stack, Text } from '@island.is/island-ui/core'
import { NO, YES } from '../../constants'
import React, { FC } from 'react'

import { FieldBaseProps } from '@island.is/application/types'
import { formatText } from '@island.is/application/core'
import { institutionApplicationMessages as m } from '../../lib/messages'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
const SecondaryContact: FC<FieldBaseProps> = ({ field, application }) => {
  const { setValue, getValues } = useFormContext()
  const { formatMessage } = useLocale()
  const { id, title } = field
  const isEnabled = getValues('hasSecondaryContact') === YES

  const enableSecondaryContact = () => {
    setValue('hasSecondaryContact', YES)
  }

  const disableSecondaryContact = () => {
    setValue('hasSecondaryContact', NO)
    setValue(`${id}.name`, undefined)
    setValue(`${id}.phoneNumber`, undefined)
    setValue(`${id}.email`, undefined)
  }

  return isEnabled ? (
    <Box marginTop={4}>
      <Stack space={3}>
        <Box display="flex" position="relative" alignItems="center">
          <Box className={styles.deleteIcon} onClick={disableSecondaryContact}>
            <Icon
              color="dark200"
              icon="removeCircle"
              size="medium"
              type="outline"
            />
          </Box>
          <Text variant="h4">
            {formatText(title, application, formatMessage)}
          </Text>
        </Box>
      </Stack>
    </Box>
  ) : (
    <Box marginTop={4}>
      <Button
        icon="add"
        variant="ghost"
        size="small"
        onClick={enableSecondaryContact}
      >
        {formatText(
          m.applicant.contactAddButtonLabel,
          application,
          formatMessage,
        )}
      </Button>
    </Box>
  )
}

export default SecondaryContact
