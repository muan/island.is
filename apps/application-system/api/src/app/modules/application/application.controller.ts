import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  ParseUUIDPipe,
  BadRequestException,
  UseInterceptors,
  Optional,
  Query,
  UseGuards,
  UnauthorizedException,
  Delete,
  ForbiddenException,
  Inject,
} from '@nestjs/common'
import omit from 'lodash/omit'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger'
import {
  ApplicationTemplateHelper,
  mergeAnswers,
} from '@island.is/application/core'
import {
  ApplicationWithAttachments as BaseApplication,
  DefaultEvents,
  ApplicationTypes,
  FormValue,
  ExternalData,
  TemplateApi,
  PdfTypes,
  ApplicationStatus,
  ApplicationTemplate,
  ApplicationContext,
  ApplicationStateSchema,
} from '@island.is/application/types'
import type { Unwrap, Locale } from '@island.is/shared/types'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { ApplicationScope } from '@island.is/auth/scopes'
import {
  getApplicationTemplateByTypeId,
  getApplicationTranslationNamespaces,
} from '@island.is/application/template-loader'
import { IntlService } from '@island.is/cms-translations'
import { Audit, AuditService } from '@island.is/nest/audit'

import { ApplicationService } from '@island.is/application/api/core'
import { FileService } from '@island.is/application/api/files'
import { HistoryService } from '@island.is/application/api/history'
import { CreateApplicationDto } from './dto/createApplication.dto'
import { UpdateApplicationDto } from './dto/updateApplication.dto'
import { AddAttachmentDto } from './dto/addAttachment.dto'
import { DeleteAttachmentDto } from './dto/deleteAttachment.dto'
import { GeneratePdfDto } from './dto/generatePdf.dto'
import { PopulateExternalDataDto } from './dto/populateExternalData.dto'
import { RequestFileSignatureDto } from './dto/requestFileSignature.dto'
import { UploadSignedFileDto } from './dto/uploadSignedFile.dto'
import { ApplicationValidationService } from './tools/applicationTemplateValidation.service'
import { ApplicationSerializer } from './tools/application.serializer'
import { UpdateApplicationStateDto } from './dto/updateApplicationState.dto'
import { ApplicationResponseDto } from './dto/application.response.dto'
import { PresignedUrlResponseDto } from './dto/presignedUrl.response.dto'
import { RequestFileSignatureResponseDto } from './dto/requestFileSignature.response.dto'
import { UploadSignedFileResponseDto } from './dto/uploadSignedFile.response.dto'
import { AssignApplicationDto } from './dto/assignApplication.dto'
import { verifyToken } from './utils/tokenUtils'
import { getApplicationLifecycle } from './utils/application'
import {
  DecodedAssignmentToken,
  StateChangeResult,
  TemplateAPIModuleActionResult,
} from './types'
import { ApplicationAccessService } from './tools/applicationAccess.service'
import { CurrentLocale } from './utils/currentLocale'
import { Application } from '@island.is/application/api/core'
import { Documentation } from '@island.is/nest/swagger'
import { EventObject } from 'xstate'
import { TemplateApiActionRunner } from './tools/templateApiActionRunner.service'
import { DelegationGuard } from './guards/delegation.guard'
import { isNewActor } from './utils/delegationUtils'
import { PaymentService } from '@island.is/application/api/payment'
import { ApplicationChargeService } from './charge/application-charge.service'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { TemplateApiError } from '@island.is/nest/problem'
import { BypassDelegation } from './guards/bypass-delegation.decorator'

@UseGuards(IdsUserGuard, ScopesGuard, DelegationGuard)
@ApiTags('applications')
@ApiHeader({
  name: 'authorization',
  description: 'Bearer token authorization',
})
@ApiHeader({
  name: 'locale',
  description: 'Front-end language selected',
})
@Controller()
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly fileService: FileService,
    private readonly auditService: AuditService,
    private readonly validationService: ApplicationValidationService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly applicationAccessService: ApplicationAccessService,
    @Optional() @InjectQueue('upload') private readonly uploadQueue: Queue,
    private intlService: IntlService,
    private paymentService: PaymentService,
    private applicationChargeService: ApplicationChargeService,
    private readonly historyService: HistoryService,
    private readonly templateApiActionRunner: TemplateApiActionRunner,
  ) {}

  @Scopes(ApplicationScope.read)
  @Get('applications/:id')
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  @Audit<ApplicationResponseDto>({
    resources: (app) => app.id,
  })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: User,
  ): Promise<ApplicationResponseDto> {
    const existingApplication = await this.applicationAccessService.findOneByIdAndNationalId(
      id,
      user,
    )

    await this.validationService.validateThatApplicationIsReady(
      existingApplication as BaseApplication,
      user,
    )

    return existingApplication
  }

  @Scopes(ApplicationScope.read)
  @Get('users/:nationalId/applications')
  @BypassDelegation()
  @ApiParam({
    name: 'nationalId',
    type: String,
    required: true,
    description: `To get the applications for a specific user's national id.`,
    allowEmptyValue: false,
  })
  @ApiQuery({
    name: 'typeId',
    required: false,
    type: 'string',
    description:
      'To filter applications by type. Comma-separated for multiple values.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: 'string',
    description:
      'To filter applications by status. Comma-separated for multiple values.',
  })
  @ApiOkResponse({ type: ApplicationResponseDto, isArray: true })
  @UseInterceptors(ApplicationSerializer)
  @Audit<ApplicationResponseDto[]>({
    resources: (apps) => apps.map((app) => app.id),
  })
  async findAll(
    @Param('nationalId') nationalId: string,
    @CurrentUser() user: User,
    @Query('typeId') typeId?: string,
    @Query('status') status?: string,
  ): Promise<ApplicationResponseDto[]> {
    if (nationalId !== user.nationalId) {
      this.logger.debug('User is not authorized to get applications')
      throw new UnauthorizedException()
    }

    this.logger.debug(`Getting applications with status ${status}`)
    const applications = await this.applicationService.findAllByNationalIdAndFilters(
      nationalId,
      typeId,
      status,
      user.actor?.nationalId,
    )

    // keep all templates that have been fetched in order to avoid fetching them again
    const templates: Partial<
      Record<
        ApplicationTypes,
        ApplicationTemplate<
          ApplicationContext,
          ApplicationStateSchema<EventObject>,
          EventObject
        >
      >
    > = {}
    const templateTypeToIsReady: Partial<Record<ApplicationTypes, boolean>> = {}
    const filteredApplications: Application[] = []
    for (const application of applications) {
      const typeId = application.typeId
      const isTemplateTypeReady = templateTypeToIsReady[typeId]
      // We've already checked an application with this type and it is ready
      // now we just need to check if it should be displayed for the user
      if (
        isTemplateTypeReady &&
        templates[typeId] !== undefined &&
        (await this.applicationAccessService.shouldShowApplicationOnOverview(
          application as BaseApplication,
          user,
          templates[typeId],
        ))
      ) {
        filteredApplications.push(application)
        continue
      } else if (isTemplateTypeReady === false) {
        // We've already checked an application with this type
        // and it is NOT ready so we will skip it
        continue
      }

      try {
        const applicationTemplate = await getApplicationTemplateByTypeId(typeId)
        // Add template to avoid fetching it again for the same types
        templates[typeId] = applicationTemplate

        if (
          await this.validationService.isTemplateReady(
            applicationTemplate,
            user,
          )
        ) {
          templateTypeToIsReady[typeId] = true
          if (
            await this.applicationAccessService.shouldShowApplicationOnOverview(
              application as BaseApplication,
              user,
              applicationTemplate,
            )
          ) {
            filteredApplications.push(application)
          }
        } else {
          templateTypeToIsReady[typeId] = false
        }
      } catch (e) {
        this.logger.info(
          `Could not get application template for type ${typeId}`,
          e,
        )
      }
    }

    return filteredApplications
  }

  @Scopes(ApplicationScope.write)
  @Post('applications')
  @ApiCreatedResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async create(
    @Body()
    application: CreateApplicationDto,
    @CurrentUser()
    user: User,
    @CurrentLocale() locale: Locale,
  ): Promise<ApplicationResponseDto> {
    const { typeId } = application
    const template = await getApplicationTemplateByTypeId(typeId)

    if (template === null) {
      throw new BadRequestException(
        `No application template exists for type: ${typeId}`,
      )
    }

    // TODO: verify template is ready from https://github.com/island-is/island.is/pull/3297

    // TODO: initial state should be required
    const initialState =
      template.stateMachineConfig.initial ??
      Object.keys(template.stateMachineConfig.states)[0]

    if (typeof initialState !== 'string') {
      throw new BadRequestException(
        `No initial state found for type: ${typeId}`,
      )
    }

    const applicationDto: Pick<
      BaseApplication,
      | 'answers'
      | 'applicant'
      | 'assignees'
      | 'applicantActors'
      | 'attachments'
      | 'state'
      | 'status'
      | 'typeId'
    > = {
      answers: {},
      applicant: user.nationalId,
      assignees: [],
      applicantActors: user.actor ? [user.actor.nationalId] : [],
      attachments: {},
      state: initialState,
      status: ApplicationStatus.DRAFT,
      typeId: application.typeId,
    }

    const createdApplication = await this.applicationService.create(
      applicationDto,
    )

    // Make sure the application has the correct lifecycle values persisted to database.
    // Requires an application object that is created in the previous step.
    const {
      updatedApplication,
    } = await this.applicationService.updateApplicationState(
      createdApplication.id,
      createdApplication.state,
      createdApplication.answers as FormValue,
      createdApplication.assignees,
      createdApplication.status,
      getApplicationLifecycle(createdApplication as BaseApplication, template),
    )

    this.auditService.audit({
      auth: user,
      action: 'create',
      resources: updatedApplication.id,
      meta: { type: application.typeId },
    })

    const actionDto: BaseApplication = {
      ...applicationDto,
      id: createdApplication.id,
      modified: createdApplication.modified,
      created: createdApplication.created,
      answers: updatedApplication.answers as FormValue,
      externalData: updatedApplication.externalData as ExternalData,
      attachments: {},
    }

    await this.historyService.saveStateTransition(
      updatedApplication.id,
      updatedApplication.state,
    )

    // Trigger meta.onEntry for initial state on application creation
    const onEnterStateAction = new ApplicationTemplateHelper(
      actionDto,
      template,
    ).getOnEntryStateAPIAction(updatedApplication.state)

    if (onEnterStateAction) {
      const {
        updatedApplication: withUpdatedExternalData,
      } = await this.performActionOnApplication(
        actionDto,
        template,
        user,
        onEnterStateAction,
        locale,
      )

      //Programmers responsible for handling failure status
      updatedApplication.externalData = withUpdatedExternalData.externalData
    }

    return updatedApplication
  }

  @Scopes(ApplicationScope.write)
  @Put('applications/assign')
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  @Audit<ApplicationResponseDto>({
    resources: (app) => app.id,
  })
  async assignApplication(
    @Body() assignApplicationDto: AssignApplicationDto,
    @CurrentUser() user: User,
    @CurrentLocale() locale: Locale,
  ): Promise<ApplicationResponseDto> {
    const decodedToken = verifyToken<DecodedAssignmentToken>(
      assignApplicationDto.token,
    )

    this.logger.info('Application assign started.')
    this.logger.debug(`Decoded token ${JSON.stringify(decodedToken)}`)
    if (decodedToken === null) {
      throw new BadRequestException('Invalid token')
    }

    const existingApplication = await this.applicationService.findOneById(
      decodedToken.applicationId,
    )

    if (!existingApplication) {
      throw new NotFoundException(
        `An application with the id ${decodedToken.applicationId} does not exist`,
      )
    }

    // For convenience if the user attempting to be assigned is already an assignee
    // then return the application
    if (existingApplication.assignees.includes(user.nationalId)) {
      return existingApplication
    }

    if (decodedToken.nonce) {
      if (!existingApplication.assignNonces.includes(decodedToken.nonce)) {
        throw new NotFoundException('Token no longer usable.')
      }

      await this.applicationService.removeNonce(
        existingApplication,
        decodedToken.nonce,
      )
    } else if (new Date((decodedToken.iat + 3628800) * 1000) < new Date()) {
      //supporting legacy tokens but reducing the validity to 6 weeks from issue date
      throw new BadRequestException('Token has expired.')
    }

    if (existingApplication.state !== decodedToken.state) {
      throw new NotFoundException('Application no longer in assignable state')
    }

    const templateId = existingApplication.typeId as ApplicationTypes
    const template = await getApplicationTemplateByTypeId(templateId)

    // TODO
    if (template === null) {
      throw new BadRequestException(
        `No application template exists for type: ${existingApplication.typeId}`,
      )
    }

    await this.validationService.validateThatTemplateIsReady(template, user)

    const assignees = [user.nationalId]

    const mergedApplication: BaseApplication = {
      ...(existingApplication.toJSON() as BaseApplication),
      assignees,
    }

    const {
      hasChanged,
      hasError,
      error,
      application: updatedApplication,
    } = await this.changeState(
      mergedApplication,
      template,
      DefaultEvents.ASSIGN,
      user,
      locale,
    )

    if (hasError) {
      this.logger.error(
        `Application (ID: ${existingApplication.id}) assignment finished with an error: ${error}`,
      )
      throw new BadRequestException(error)
    }
    this.logger.info(
      `Application (ID: ${existingApplication.id}) assignment finished with no errors.`,
    )

    if (hasChanged) {
      return updatedApplication
    }

    return existingApplication
  }

  @Scopes(ApplicationScope.write)
  @Put('applications/:id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to update.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() application: UpdateApplicationDto,
    @CurrentUser() user: User,
    @CurrentLocale() locale: Locale,
  ): Promise<ApplicationResponseDto> {
    const existingApplication = await this.applicationAccessService.findOneByIdAndNationalId(
      id,
      user,
      { shouldThrowIfPruned: true },
    )
    const namespaces = await getApplicationTranslationNamespaces(
      existingApplication as BaseApplication,
    )
    const newAnswers = application.answers as FormValue
    const intl = await this.intlService.useIntl(namespaces, locale)

    await this.validationService.validateIncomingAnswers(
      existingApplication as BaseApplication,
      newAnswers,
      user.nationalId,
      true,
      intl.formatMessage,
    )

    await this.validationService.validateApplicationSchema(
      existingApplication,
      newAnswers,
      intl.formatMessage,
      user,
    )

    const mergedAnswers = mergeAnswers(existingApplication.answers, newAnswers)
    const applicantActors: string[] =
      isNewActor(existingApplication, user) && !!user.actor?.nationalId
        ? [...existingApplication.applicantActors, user.actor.nationalId]
        : existingApplication.applicantActors

    const { updatedApplication } = await this.applicationService.update(
      existingApplication.id,
      {
        answers: mergedAnswers,
        applicantActors: applicantActors,
        draftFinishedSteps: application.draftProgress?.stepsFinished ?? 0,
        draftTotalSteps: application.draftProgress?.totalSteps ?? 0,
      },
    )

    this.auditService.audit({
      auth: user,
      action: 'update',
      resources: updatedApplication.id,
      meta: { fields: Object.keys(newAnswers) },
    })
    return updatedApplication
  }

  @Scopes(ApplicationScope.write)
  @Put('applications/:id/externalData')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to update the external data for.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async updateExternalData(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() externalDataDto: PopulateExternalDataDto,
    @CurrentUser() user: User,
    @CurrentLocale() locale: Locale,
  ): Promise<ApplicationResponseDto> {
    const existingApplication = await this.applicationAccessService.findOneByIdAndNationalId(
      id,
      user,
    )

    const templateId = existingApplication.typeId as ApplicationTypes
    const template = await getApplicationTemplateByTypeId(templateId)

    const helper = new ApplicationTemplateHelper(
      existingApplication as BaseApplication,
      template,
    )

    const userRole = template.mapUserToRole(
      user.nationalId,
      existingApplication as BaseApplication,
    )

    const providersFromRole = userRole
      ? helper.getApisFromRoleInState(userRole)
      : []

    const namespaces = await getApplicationTranslationNamespaces(
      existingApplication as BaseApplication,
    )
    const intl = await this.intlService.useIntl(namespaces, locale)

    const templateApis: TemplateApi[] = []

    for (let i = 0; i < externalDataDto.dataProviders.length; i++) {
      const found = providersFromRole.find(
        (x) => x.actionId === externalDataDto.dataProviders[i].actionId,
      )

      if (found) {
        templateApis.push(found)
      } else {
        throw new BadRequestException(
          `Current user is not permitted to update external data in this state with actionId: ${externalDataDto.dataProviders[i].actionId}`,
        )
      }
    }

    await this.validationService.validateIncomingExternalDataProviders(
      existingApplication as BaseApplication,
      templateApis,
      user.nationalId,
    )

    const updatedApplication = await this.templateApiActionRunner.run(
      existingApplication as BaseApplication,
      templateApis,
      user,
      locale,
      intl.formatMessage,
    )

    if (!updatedApplication) {
      throw new NotFoundException(
        `An application with the id ${id} does not exist`,
      )
    }

    this.auditService.audit({
      auth: user,
      action: 'updateExternalData',
      resources: existingApplication.id,
      meta: { providers: externalDataDto },
    })

    return updatedApplication
  }

  @Scopes(ApplicationScope.write)
  @Put('applications/:id/submit')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to update the state for.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async submitApplication(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateApplicationStateDto: UpdateApplicationStateDto,
    @CurrentUser() user: User,
    @CurrentLocale() locale: Locale,
  ): Promise<ApplicationResponseDto> {
    const existingApplication = await this.applicationAccessService.findOneByIdAndNationalId(
      id,
      user,
      { shouldThrowIfPruned: true },
    )
    const templateId = existingApplication.typeId as ApplicationTypes
    const template = await getApplicationTemplateByTypeId(templateId)

    // TODO
    if (template === null) {
      throw new BadRequestException(
        `No application template exists for type: ${existingApplication.typeId}`,
      )
    }

    const newAnswers = (updateApplicationStateDto.answers ?? {}) as FormValue
    const namespaces = await getApplicationTranslationNamespaces(
      existingApplication as BaseApplication,
    )
    const intl = await this.intlService.useIntl(namespaces, locale)

    const permittedAnswers = await this.validationService.validateIncomingAnswers(
      existingApplication as BaseApplication,
      newAnswers,
      user.nationalId,
      false,
      intl.formatMessage,
    )

    await this.validationService.validateApplicationSchema(
      existingApplication as BaseApplication,
      permittedAnswers,
      intl.formatMessage,
      user,
    )

    const mergedAnswers = mergeAnswers(
      existingApplication.answers,
      permittedAnswers,
    )

    const mergedApplication: BaseApplication = {
      ...(existingApplication.toJSON() as BaseApplication),
      answers: mergedAnswers,
    }

    const {
      hasChanged,
      hasError,
      error,
      application: updatedApplication,
    } = await this.changeState(
      mergedApplication,
      template,
      updateApplicationStateDto.event,
      user,
      locale,
    )

    this.auditService.audit({
      auth: user,
      action: 'submitApplication',
      resources: existingApplication.id,
      meta: {
        event: updateApplicationStateDto.event,
        before: existingApplication.state,
        after: updatedApplication.state,
        fields: Object.keys(permittedAnswers),
      },
    })

    if (hasError && error) {
      throw new TemplateApiError(error, 500)
    }
    this.logger.info(`Application submission ended successfully`)

    if (hasChanged) {
      return updatedApplication
    }

    return existingApplication
  }

  async performActionOnApplication(
    application: BaseApplication,
    template: Unwrap<typeof getApplicationTemplateByTypeId>,
    auth: User,
    apis: TemplateApi | TemplateApi[],
    locale: Locale,
  ): Promise<TemplateAPIModuleActionResult> {
    if (!Array.isArray(apis)) {
      apis = [apis]
    }

    this.logger.debug(
      `Performing actions ${apis
        .map((api) => api.action)
        .join(', ')} on ${JSON.stringify(template.name)}`,
    )
    const namespaces = await getApplicationTranslationNamespaces(application)
    const intl = await this.intlService.useIntl(namespaces, locale)

    const updatedApplication = await this.templateApiActionRunner.run(
      application,
      apis,
      auth,
      locale,
      intl.formatMessage,
    )

    for (const api of apis) {
      const result =
        updatedApplication.externalData[api.externalDataId || api.action]

      this.logger.debug(
        `Performing action ${api.action} on ${JSON.stringify(
          template.name,
        )} ended with ${result.status}`,
      )

      if (result.status === 'failure' && api.throwOnError) {
        return {
          updatedApplication,
          hasError: true,
          error: result.reason,
        }
      }
    }

    this.logger.debug(
      `Updated external data for application with ID ${updatedApplication.id}`,
    )

    return {
      updatedApplication,
      hasError: false,
    }
  }

  private async changeState(
    application: BaseApplication,
    template: Unwrap<typeof getApplicationTemplateByTypeId>,
    event: string,
    auth: User,
    locale: Locale,
  ): Promise<StateChangeResult> {
    const helper = new ApplicationTemplateHelper(application, template)
    const onExitStateAction = helper.getOnExitStateAPIAction(application.state)
    let updatedApplication: BaseApplication = application

    await this.applicationService.clearNonces(updatedApplication.id)
    if (onExitStateAction) {
      const {
        hasError,
        error,
        updatedApplication: withUpdatedExternalData,
      } = await this.performActionOnApplication(
        updatedApplication,
        template,
        auth,
        onExitStateAction,
        locale,
      )
      updatedApplication = withUpdatedExternalData

      if (hasError) {
        return {
          hasChanged: false,
          application: updatedApplication,
          error,
          hasError: true,
        }
      }
    }

    const [
      hasChanged,
      newState,
      withUpdatedState,
    ] = new ApplicationTemplateHelper(updatedApplication, template).changeState(
      event,
    )
    updatedApplication = {
      ...updatedApplication,
      answers: withUpdatedState.answers,
      assignees: withUpdatedState.assignees,
      state: withUpdatedState.state,
    }

    if (!hasChanged) {
      return {
        hasChanged: false,
        hasError: false,
        application: updatedApplication,
      }
    }

    const onEnterStateAction = new ApplicationTemplateHelper(
      updatedApplication,
      template,
    ).getOnEntryStateAPIAction(newState)

    if (onEnterStateAction) {
      const {
        hasError,
        error,
        updatedApplication: withUpdatedExternalData,
      } = await this.performActionOnApplication(
        updatedApplication,
        template,
        auth,
        onEnterStateAction,
        locale,
      )
      updatedApplication = withUpdatedExternalData

      if (hasError) {
        return {
          hasError: true,
          hasChanged: false,
          error: error,
          application,
        }
      }
    }

    const status = new ApplicationTemplateHelper(
      updatedApplication,
      template,
    ).getApplicationStatus()

    try {
      const update = await this.applicationService.updateApplicationState(
        application.id,
        newState,
        updatedApplication.answers,
        updatedApplication.assignees,
        status,
        getApplicationLifecycle(updatedApplication, template),
      )

      updatedApplication = update.updatedApplication as BaseApplication
      await this.historyService.saveStateTransition(
        application.id,
        newState,
        event,
      )
    } catch (e) {
      this.logger.error(e)
      return {
        hasChanged: false,
        hasError: true,
        application,
        error: 'Could not update application',
      }
    }

    return {
      hasChanged: true,
      application: updatedApplication,
      hasError: false,
    }
  }

  @Scopes(ApplicationScope.write)
  @Put('applications/:id/attachments')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to update the attachments for.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async addAttachment(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: AddAttachmentDto,
    @CurrentUser() user: User,
  ): Promise<ApplicationResponseDto> {
    const { key, url } = input

    const {
      updatedApplication,
    } = await this.applicationService.updateAttachment(
      id,
      user.nationalId,
      key,
      url,
    )

    await this.uploadQueue.add('upload', {
      applicationId: updatedApplication.id,
      nationalId: user.nationalId,
      attachmentUrl: url,
    })

    this.auditService.audit({
      auth: user,
      action: 'addAttachment',
      resources: updatedApplication.id,
      meta: {
        file: key,
      },
    })

    return updatedApplication
  }

  @Scopes(ApplicationScope.write)
  @Delete('applications/:id/attachments')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to delete attachment(s) from.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async deleteAttachment(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: DeleteAttachmentDto,
    @CurrentUser() user: User,
  ): Promise<ApplicationResponseDto> {
    const existingApplication = await this.applicationAccessService.findOneByIdAndNationalId(
      id,
      user,
    )
    const { key } = input

    const { updatedApplication } = await this.applicationService.update(
      existingApplication.id,
      {
        attachments: omit(existingApplication.attachments, key),
      },
    )

    this.auditService.audit({
      auth: user,
      action: 'deleteAttachment',
      resources: updatedApplication.id,
      meta: {
        file: key,
      },
    })

    return updatedApplication
  }

  @Scopes(ApplicationScope.write)
  @Put('applications/:id/generatePdf')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to create a pdf for',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: PresignedUrlResponseDto })
  async generatePdf(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: GeneratePdfDto,
    @CurrentUser() user: User,
  ): Promise<PresignedUrlResponseDto> {
    const existingApplication = await this.applicationAccessService.findOneByIdAndNationalId(
      id,
      user,
    )
    const url = await this.fileService.generatePdf(
      existingApplication,
      input.type,
    )

    this.auditService.audit({
      auth: user,
      action: 'generatePdf',
      resources: existingApplication.id,
      meta: { type: input.type },
    })

    return { url }
  }

  @Scopes(ApplicationScope.write)
  @Put('applications/:id/requestFileSignature')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description:
      'The id of the application which the file signature is requested for.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: RequestFileSignatureResponseDto })
  async requestFileSignature(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: RequestFileSignatureDto,
    @CurrentUser() user: User,
  ): Promise<RequestFileSignatureResponseDto> {
    const existingApplication = await this.applicationAccessService.findOneByIdAndNationalId(
      id,
      user,
    )
    const {
      controlCode,
      documentToken,
    } = await this.fileService.requestFileSignature(
      existingApplication,
      input.type,
    )

    this.auditService.audit({
      auth: user,
      action: 'requestFileSignature',
      resources: existingApplication.id,
      meta: { type: input.type },
    })

    return { controlCode, documentToken }
  }

  @Scopes(ApplicationScope.write)
  @Put('applications/:id/uploadSignedFile')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application which the file was created for.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: UploadSignedFileResponseDto })
  async uploadSignedFile(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: UploadSignedFileDto,
    @CurrentUser() user: User,
  ): Promise<UploadSignedFileResponseDto> {
    const existingApplication = await this.applicationAccessService.findOneByIdAndNationalId(
      id,
      user,
    )

    await this.fileService.uploadSignedFile(
      existingApplication,
      input.documentToken,
      input.type,
    )

    this.auditService.audit({
      auth: user,
      action: 'uploadSignedFile',
      resources: existingApplication.id,
      meta: { type: input.type },
    })

    return {
      documentSigned: true,
    }
  }

  @Scopes(ApplicationScope.read)
  @Get('applications/:id/:pdfType/presignedUrl')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application which the file was created for.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: PresignedUrlResponseDto })
  async getPresignedUrl(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('pdfType') type: PdfTypes,
    @CurrentUser() user: User,
  ): Promise<PresignedUrlResponseDto> {
    const existingApplication = await this.applicationAccessService.findOneByIdAndNationalId(
      id,
      user,
    )
    const url = await this.fileService.getPresignedUrl(
      existingApplication,
      type,
    )

    this.auditService.audit({
      auth: user,
      action: 'getPresignedUrl',
      resources: existingApplication.id,
      meta: { type },
    })

    return { url }
  }

  @Get('applications/:id/attachments/:attachmentKey/presigned-url')
  @Scopes(ApplicationScope.read)
  @Documentation({
    description: 'Gets a presigned url for attachments',
    response: { status: 200, type: PresignedUrlResponseDto },
    request: {
      query: {},
      params: {
        id: {
          type: 'string',
          description: 'application id',
          required: true,
        },
        attachmentKey: {
          type: 'string',
          description: 'key for attachment',
          required: true,
        },
      },
    },
  })
  async getAttachmentPresignedURL(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('attachmentKey') attachmentKey: string,
    @CurrentUser() user: User,
  ): Promise<PresignedUrlResponseDto> {
    const existingApplication = await this.applicationAccessService.findOneByIdAndNationalId(
      id,
      user,
    )

    if (!existingApplication.attachments) {
      throw new NotFoundException('Attachments not found')
    }

    try {
      const str = attachmentKey as keyof typeof existingApplication.attachments
      const fileName = existingApplication.attachments[str]
      return await this.fileService.getAttachmentPresignedURL(fileName)
    } catch (error) {
      throw new NotFoundException('Attachment not found')
    }
  }

  @Scopes(ApplicationScope.write)
  @Delete('applications/:id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to delete.',
    allowEmptyValue: false,
  })
  async delete(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: User,
  ) {
    const { nationalId } = user
    const existingApplication = (await this.applicationAccessService.findOneByIdAndNationalId(
      id,
      user,
    )) as BaseApplication
    const canDelete = await this.applicationAccessService.canDeleteApplication(
      existingApplication,
      nationalId,
    )

    if (!canDelete) {
      throw new ForbiddenException(
        'Users role does not have permission to delete this application in this state',
      )
    }

    // delete charge in FJS
    await this.applicationChargeService.deleteCharge(existingApplication)

    // delete the entry in Payment table to prevent FK error
    await this.paymentService.delete(existingApplication.id, user)

    await this.fileService.deleteAttachmentsForApplication(existingApplication)

    // delete history for application
    await this.historyService.deleteHistoryByApplicationId(
      existingApplication.id,
    )

    await this.applicationService.delete(existingApplication.id)
  }
}
