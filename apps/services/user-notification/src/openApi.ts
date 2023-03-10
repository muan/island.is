import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Notification service')
  .setDescription(
    'Notification service to send notifications to users via push notifications',
  )
  .setVersion('1.0')
  .build()
