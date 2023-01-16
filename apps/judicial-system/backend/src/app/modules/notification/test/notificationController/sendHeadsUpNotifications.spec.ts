import { uuid } from 'uuidv4'

import { NotificationType, User } from '@island.is/judicial-system/types'
import { MessageService, MessageType } from '@island.is/judicial-system/message'

import { Case } from '../../../case'
import { SendNotificationResponse } from '../../models/sendNotification.response'
import { createTestingNotificationModule } from '../createTestingNotificationModule'

interface Then {
  result: SendNotificationResponse
  error: Error
}

type GivenWhenThen = (caseId: string) => Promise<Then>

describe('NotificationController - Send heads up notification', () => {
  let mockMessageService: MessageService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      messageService,
      notificationController,
    } = await createTestingNotificationModule()

    mockMessageService = messageService

    const mockSendMessageToQueue = messageService.sendMessageToQueue as jest.Mock
    mockSendMessageToQueue.mockResolvedValue(undefined)

    givenWhenThen = async (caseId) => {
      const then = {} as Then

      await notificationController
        .sendCaseNotification(
          caseId,
          { id: uuid() } as User,
          { id: caseId } as Case,
          { type: NotificationType.HEADS_UP },
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('message queued', () => {
    const caseId = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId)
    })

    it('should send message to queue', () => {
      expect(mockMessageService.sendMessageToQueue).toHaveBeenCalledWith({
        type: MessageType.SEND_HEADS_UP_NOTIFICATION,
        caseId,
      })
      expect(then.result).toEqual({ notificationSent: true })
    })
  })
})
