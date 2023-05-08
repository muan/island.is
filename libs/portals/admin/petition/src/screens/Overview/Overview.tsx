import { Box, Text } from '@island.is/island-ui/core'
import {useEndorsementSystemFindEndorsementListsQuery} from '../../queries/overview.generated'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { EndorsementListControllerFindByTagsTagsEnum } from '@island.is/api/schema'

const Overview = () => {
  const { formatMessage } = useLocale()

  const { data, loading: queryLoading } = useEndorsementSystemFindEndorsementListsQuery({
    variables: {
      input: {
        tags: [EndorsementListControllerFindByTagsTagsEnum.generalPetition],
        limit: 1000,
      },
    },
    onCompleted: (q) => {
      console.log(q)
    },
  })
  console.log(queryLoading)
  console.log(data)
  return (
    <Box>
      <Text> {formatMessage(m.petitions)}</Text>
      <Text> {queryLoading}</Text>
      <Text> {data}</Text>
    </Box>
  )
}

export default Overview
