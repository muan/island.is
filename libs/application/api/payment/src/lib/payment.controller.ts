import {
  Controller,
  Param,
  UseGuards,
  Get,
  ParseUUIDPipe,
} from '@nestjs/common'

import { ApiParam, ApiTags, ApiHeader, ApiOkResponse } from '@nestjs/swagger'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { ApplicationScope } from '@island.is/auth/scopes'
import { PaymentService } from './payment.service'
import { PaymentStatusResponseDto } from './dto/paymentStatusResponse.dto'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('payments')
@ApiHeader({
  name: 'authorization',
  description: 'Bearer token authorization',
})
@ApiHeader({
  name: 'locale',
  description: 'Front-end language selected',
})
@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Scopes(ApplicationScope.read)
  @Get('applications/:applicationId/payment-status')
  @ApiOkResponse({ type: PaymentStatusResponseDto })
  @ApiParam({
    name: 'applicationId',
    type: String,
    required: true,
    description: 'The id of the application check if it is paid.',
  })
  async getPaymentStatus(
    @CurrentUser() user: User,
    @Param('applicationId', new ParseUUIDPipe()) applicationId: string,
  ): Promise<PaymentStatusResponseDto> {
    return await this.paymentService.getStatus(user, applicationId)
  }
}
