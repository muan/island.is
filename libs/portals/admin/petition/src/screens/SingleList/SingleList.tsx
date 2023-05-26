import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Input,
  Stack,
  AlertMessage,
  DatePicker,
  toast,
} from '@island.is/island-ui/core'
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useRevalidator,
} from 'react-router-dom'

import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import Skeleton from '../../components/Skeleton/skeleton'
import { EndorsementList } from '../../shared/utils/types'
import PetitionsTable from '../../components/PetitionsTable'
import { PetitionPaths } from '../../lib/paths'
import { UpdateListMutation } from '../../shared/mutations/updateList.generated'
import { LockList } from '../../components/Actions/LockList'
import { UnlockList } from '../../components/Actions/UnlockList'
import { replaceParams, useSubmitting } from '@island.is/react-spa/shared'

const SingleList = () => {
  const { listId, petition, endorsements } = useLoaderData() as EndorsementList
  const { formatMessage } = useLocale()
  const navigation = useNavigation()
  const navigate = useNavigate()
  const revalidator = useRevalidator()

  const [title, setTitle] = useState(petition?.title)
  const [description, setDescription] = useState(petition?.description)
  const [closedDate, setClosedDate] = useState(
    petition?.closedDate ? new Date(petition?.closedDate) : new Date(),
  )
  const [openedDate, setOpenedDate] = useState(
    petition?.openedDate ? new Date(petition?.openedDate) : new Date(),
  )

  const { isLoading, isSubmitting } = useSubmitting()

  const actionData = useActionData() as UpdateListMutation

  const [isLockListModalVisible, setIsLockListModalVisible] = useState(false)
  const [isUnlockListModalVisible, setIsUnlockListModalVisible] = useState(
    false,
  )
  useEffect(() => {
    if (actionData) {
      actionData?.endorsementSystemUpdateEndorsementList
        ? toast.success(formatMessage(m.todo))
        : toast.error(formatMessage(m.todo))
    }
  }, [actionData])

  return (
    <>
      <Box marginBottom={6}>
        <Button
          variant="text"
          preTextIcon="arrowBack"
          size="small"
          onClick={() => {
            navigate(-1)
          }}
        >
          {'Til baka'}
        </Button>
      </Box>
      {navigation.state !== 'loading' &&
      revalidator.state !== 'loading' &&
      petition ? (
        <>
          <Form method="post">
            {petition.adminLock && (
              <Box marginY={5}>
                <AlertMessage
                  type="error"
                  title={'Listi er læstur'}
                  message=""
                />
              </Box>
            )}
            <Stack space={3}>
              <Input
                name="title"
                value={title ?? ''}
                onChange={(e) => {
                  setTitle(e.target.value)
                }}
                label={'Heiti lista'}
              />
              <Input
                name="description"
                value={description ?? ''}
                onChange={(e) => {
                  setDescription(e.target.value)
                }}
                label={'Um lista'}
                textarea
                rows={12}
              />
              {closedDate && openedDate && (
                <Box display={['block', 'flex']} justifyContent="spaceBetween">
                  <Box width="half" marginRight={[0, 2]}>
                    <DatePicker
                      name="openedDate"
                      selected={new Date(openedDate)}
                      handleChange={(date) => setOpenedDate(date)}
                      label="Tímabil frá"
                      locale="is"
                      placeholderText="Veldu dagsetningu"
                    />
                  </Box>
                  <Box width="half" marginLeft={[0, 2]} marginTop={[2, 0]}>
                    <DatePicker
                      name="closedDate"
                      selected={new Date(closedDate)}
                      handleChange={(date) => setClosedDate(date)}
                      label="Tímabil til"
                      locale="is"
                      placeholderText="Veldu dagsetningu"
                    />
                  </Box>
                </Box>
              )}

              <Input
                backgroundColor="blue"
                disabled
                name={petition?.ownerName ?? ''}
                value={petition?.ownerName ?? ''}
                label={formatMessage(m.listOwner)}
              />

              <Box display="flex" justifyContent="spaceBetween" marginTop={2}>
                {!petition.adminLock ? (
                  <>
                    <Button
                      icon="lockClosed"
                      iconType="outline"
                      colorScheme="destructive"
                      onClick={() => setIsLockListModalVisible(true)}
                    >
                      {'Loka lista'}
                    </Button>
                    <LockList
                      isVisible={isLockListModalVisible}
                      onClose={() => setIsLockListModalVisible(false)}
                    />
                  </>
                ) : (
                  <>
                    <Button
                      icon="reload"
                      iconType="outline"
                      onClick={() => setIsUnlockListModalVisible(true)}
                    >
                      {'Opna lista'}
                    </Button>
                    <UnlockList
                      isVisible={isUnlockListModalVisible}
                      onClose={() => setIsUnlockListModalVisible(false)}
                    />
                  </>
                )}
                <Button
                  loading={isSubmitting || isLoading}
                  type="submit"
                  icon="reload"
                  variant="ghost"
                >
                  {'Uppfæra lista'}
                </Button>
              </Box>
            </Stack>
          </Form>
          <PetitionsTable
            petitions={endorsements}
            listId={listId}
            isViewTypeEdit={true}
          />
        </>
      ) : (
        <Skeleton />
      )}
    </>
  )
}

export default SingleList
