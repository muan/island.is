import React, { FC } from 'react'
import { useQuery, gql } from '@apollo/client'
import { useWatch } from 'react-hook-form'
import { formatText } from '@island.is/application/core'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as kennitala from 'kennitala'
import { m } from '../lib/messages'
import { StudentInformationResult } from '@island.is/api/schema'

const QUERY = gql`
  query studentInfo($nationalId: String!) {
    drivingLicenseStudentInformation(nationalId: $nationalId) {
      student {
        name
      }
    }
  }
`

interface Props extends FieldBaseProps {
  field: CustomField
}

interface ExpectedStudent {
  nationalId?: string
}

export const StudentLookupField: FC<React.PropsWithChildren<Props>> = ({ application }) => {
  const student = application.answers.student as unknown as ExpectedStudent
  const studentNationalId = useWatch({
    name: 'student.nationalId',
    // FYI the watch value is not queried unless the value changes after rendering.
    // see react hook form's docs for useWatch for further info.
    defaultValue: student?.nationalId,
  })

  const { formatMessage } = useLocale()

  const {
    data,
    error: queryError,
    loading,
  } = useQuery<{
    drivingLicenseStudentInformation: StudentInformationResult
  }>(QUERY, {
    skip:
      !studentNationalId || !kennitala.isPerson(studentNationalId as string),
    variables: {
      nationalId: studentNationalId,
    },
  })

  if (queryError) {
    return <Text>Villa kom upp við að sækja upplýsingar um nemanda</Text>
  }

  if (loading) {
    return <Text>Sæki upplýsingar um nemanda... </Text>
  }

  if (!data?.drivingLicenseStudentInformation) {
    return null
  }

  const result = data.drivingLicenseStudentInformation

  return result.student ? (
    <Box marginBottom={2}>
      <Text variant="h4">
        {formatText(m.student, application, formatMessage)}
      </Text>
      <Text>{result?.student.name}</Text>
    </Box>
  ) : (
    <Box color="red400" padding={2}>
      <Text color="red400">
        {formatText(m.errorOrNoTemporaryLicense, application, formatMessage)}
      </Text>
    </Box>
  )
}
