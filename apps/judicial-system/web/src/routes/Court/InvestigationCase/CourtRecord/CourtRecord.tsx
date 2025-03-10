import React, { useCallback, useContext, useState } from 'react'
import { IntlShape, useIntl } from 'react-intl'
import router from 'next/router'

import {
  BlueBox,
  CourtCaseInfo,
  DateTime,
  FormContentContainer,
  FormFooter,
  HideableText,
  PageLayout,
  PdfButton,
  CourtDocuments,
  FormContext,
} from '@island.is/judicial-system-web/src/components'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import {
  useCase,
  useDeb,
  useOnceOn,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  closedCourt,
  core,
  icCourtRecord as m,
  titles,
} from '@island.is/judicial-system-web/messages'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  GridRow,
  GridColumn,
  GridContainer,
  Box,
  Text,
  Input,
  Tooltip,
} from '@island.is/island-ui/core'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { isCourtRecordStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'
import {
  CaseType,
  SessionArrangements,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { formatDateForServer } from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import * as constants from '@island.is/judicial-system/consts'

import AppealSections from '../../components/AppealSections/AppealSections'

const getSessionBookingsAutofill = (
  formatMessage: IntlShape['formatMessage'],
  workingCase: Case,
) => {
  const autofillSessionBookings = []

  if (workingCase.defenderName) {
    autofillSessionBookings.push(
      `${formatMessage(m.sections.sessionBookings.autofillDefender, {
        defender: workingCase.defenderName,
      })}\n\n`,
    )
  }

  if (workingCase.translator) {
    autofillSessionBookings.push(
      `${formatMessage(m.sections.sessionBookings.autofillTranslator, {
        translator: workingCase.translator,
      })}\n\n`,
    )
  }

  autofillSessionBookings.push(
    `${formatMessage(
      m.sections.sessionBookings.autofillRightToRemainSilent,
    )}\n\n${formatMessage(
      m.sections.sessionBookings.autofillCourtDocumentOne,
    )}\n\n${formatMessage(
      m.sections.sessionBookings.autofillAccusedPlea,
    )}\n\n${formatMessage(m.sections.sessionBookings.autofillAllPresent)}`,
  )
  return autofillSessionBookings.length > 0
    ? autofillSessionBookings.join('')
    : undefined
}

const CourtRecord = () => {
  const { setAndSendCaseToServer, updateCase } = useCase()
  const { formatMessage } = useIntl()
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)

  const [courtLocationEM, setCourtLocationEM] = useState<string>('')
  const [
    sessionBookingsErrorMessage,
    setSessionBookingsMessage,
  ] = useState<string>('')

  useDeb(workingCase, [
    'courtAttendees',
    'sessionBookings',
    'accusedAppealAnnouncement',
    'prosecutorAppealAnnouncement',
    'endOfSessionBookings',
  ])
  const initialize = useCallback(() => {
    const autofillAttendees = []

    if (workingCase.sessionArrangements === SessionArrangements.NONE_PRESENT) {
      autofillAttendees.push(formatMessage(core.sessionArrangementsNonePresent))
    } else {
      if (workingCase.prosecutor) {
        autofillAttendees.push(
          `${workingCase.prosecutor.name} ${workingCase.prosecutor.title}`,
        )
      }

      if (
        workingCase.defenderName &&
        workingCase.sessionArrangements !==
          SessionArrangements.PROSECUTOR_PRESENT
      ) {
        autofillAttendees.push(
          `\n${workingCase.defenderName} skipaður ${
            workingCase.sessionArrangements ===
            SessionArrangements.ALL_PRESENT_SPOKESPERSON
              ? 'talsmaður'
              : 'verjandi'
          } ${formatMessage(core.defendant, { suffix: 'a' })}`,
        )
      }

      if (workingCase.translator) {
        autofillAttendees.push(`\n${workingCase.translator} túlkur`)
      }

      if (workingCase.defendants && workingCase.defendants.length > 0) {
        if (
          workingCase.sessionArrangements === SessionArrangements.ALL_PRESENT
        ) {
          workingCase.defendants.forEach((defendant) => {
            autofillAttendees.push(
              `\n${defendant.name} ${formatMessage(core.defendant, {
                suffix: 'i',
              })}`,
            )
          })
        }
      }
    }

    setAndSendCaseToServer(
      [
        {
          courtStartDate: workingCase.courtDate,
          courtLocation: workingCase.court
            ? `í ${
                workingCase.court.name.indexOf('dómur') > -1
                  ? workingCase.court.name.replace('dómur', 'dómi')
                  : workingCase.court.name
              }`
            : undefined,
          courtAttendees:
            autofillAttendees.length > 0
              ? autofillAttendees.join('')
              : undefined,
          sessionBookings:
            workingCase.type === CaseType.RESTRAINING_ORDER ||
            workingCase.type ===
              CaseType.RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME
              ? formatMessage(
                  m.sections.sessionBookings.autofillRestrainingOrder,
                )
              : workingCase.type === CaseType.EXPULSION_FROM_HOME
              ? formatMessage(
                  m.sections.sessionBookings.autofillExpulsionFromHome,
                )
              : workingCase.type === CaseType.AUTOPSY
              ? formatMessage(m.sections.sessionBookings.autofillAutopsy)
              : workingCase.sessionArrangements ===
                SessionArrangements.ALL_PRESENT
              ? getSessionBookingsAutofill(formatMessage, workingCase)
              : workingCase.sessionArrangements ===
                SessionArrangements.ALL_PRESENT_SPOKESPERSON
              ? formatMessage(m.sections.sessionBookings.autofillSpokeperson)
              : workingCase.sessionArrangements ===
                SessionArrangements.PROSECUTOR_PRESENT
              ? formatMessage(m.sections.sessionBookings.autofillProsecutor)
              : undefined,
        },
      ],
      workingCase,
      setWorkingCase,
    )
  }, [setAndSendCaseToServer, formatMessage, setWorkingCase, workingCase])

  useOnceOn(isCaseUpToDate, initialize)

  const stepIsValid = isCourtRecordStepValidIC(workingCase)
  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={formatMessage(titles.court.investigationCases.courtRecord)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.sections.title)}
          </Text>
        </Box>
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={3}>
          <BlueBox>
            <Box marginBottom={3}>
              <DateTime
                name="courtStartDate"
                datepickerLabel={formatMessage(
                  m.sections.courtStartDate.dateLabel,
                )}
                timeLabel={formatMessage(m.sections.courtStartDate.timeLabel)}
                maxDate={new Date()}
                selectedDate={workingCase.courtStartDate}
                onChange={(date: Date | undefined, valid: boolean) => {
                  if (date && valid) {
                    setAndSendCaseToServer(
                      [
                        {
                          courtStartDate: formatDateForServer(date),
                          force: true,
                        },
                      ],
                      workingCase,
                      setWorkingCase,
                    )
                  }
                }}
                blueBox={false}
                required
              />
            </Box>
            <Input
              data-testid="courtLocation"
              name="courtLocation"
              tooltip={formatMessage(m.sections.courtLocation.tooltip)}
              label={formatMessage(m.sections.courtLocation.label)}
              value={workingCase.courtLocation || ''}
              placeholder={formatMessage(m.sections.courtLocation.placeholder)}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'courtLocation',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  courtLocationEM,
                  setCourtLocationEM,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'courtLocation',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setCourtLocationEM,
                )
              }
              errorMessage={courtLocationEM}
              hasError={courtLocationEM !== ''}
              autoComplete="off"
              required
            />
          </BlueBox>
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={3}>
            <HideableText
              text={formatMessage(closedCourt.text)}
              isHidden={workingCase.isClosedCourtHidden}
              onToggleVisibility={(isVisible: boolean) =>
                setAndSendCaseToServer(
                  [
                    {
                      isClosedCourtHidden: isVisible,
                      force: true,
                    },
                  ],
                  workingCase,
                  setWorkingCase,
                )
              }
              tooltip={formatMessage(closedCourt.tooltip)}
            />
          </Box>
          <Input
            data-testid="courtAttendees"
            name="courtAttendees"
            label="Mættir eru"
            value={workingCase.courtAttendees || ''}
            placeholder="Skrifa hér..."
            onChange={(event) =>
              removeTabsValidateAndSet(
                'courtAttendees',
                event.target.value,
                [],
                workingCase,
                setWorkingCase,
              )
            }
            onBlur={(event) =>
              updateCase(workingCase.id, { courtAttendees: event.target.value })
            }
            textarea
            rows={7}
            autoExpand={{ on: true, maxHeight: 300 }}
          />
        </Box>
        <Box component="section" marginBottom={8}>
          <CourtDocuments
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
          />
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {`${formatMessage(m.sections.sessionBookings.title)} `}
              <Tooltip
                text={formatMessage(m.sections.sessionBookings.tooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={3}>
            <Input
              data-testid="sessionBookings"
              name="sessionBookings"
              label={formatMessage(m.sections.sessionBookings.label)}
              value={workingCase.sessionBookings || ''}
              placeholder={formatMessage(
                m.sections.sessionBookings.placeholder,
              )}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'sessionBookings',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  sessionBookingsErrorMessage,
                  setSessionBookingsMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'sessionBookings',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setSessionBookingsMessage,
                )
              }
              errorMessage={sessionBookingsErrorMessage}
              hasError={sessionBookingsErrorMessage !== ''}
              textarea
              rows={16}
              autoExpand={{ on: true, maxHeight: 600 }}
              required
            />
          </Box>
        </Box>
        {workingCase.conclusion && (
          <Box component="section" marginBottom={8}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                {formatMessage(m.sections.conclusion)}
              </Text>
            </Box>
            <BlueBox>
              <Text>{workingCase.conclusion}</Text>
            </BlueBox>
          </Box>
        )}
        <Box component="section" marginBottom={8}>
          <AppealSections
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.endOfSessionBookings.title)}
            </Text>
          </Box>
          <Box marginBottom={5}>
            <Input
              data-testid="endOfSessionBookings"
              name="endOfSessionBookings"
              label={formatMessage(m.sections.endOfSessionBookings.label)}
              value={workingCase.endOfSessionBookings || ''}
              placeholder={formatMessage(
                m.sections.endOfSessionBookings.placeholder,
              )}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'endOfSessionBookings',
                  event.target.value,
                  [],
                  workingCase,
                  setWorkingCase,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'endOfSessionBookings',
                  event.target.value,
                  [],
                  workingCase,
                  updateCase,
                )
              }
              rows={16}
              autoExpand={{ on: true, maxHeight: 600 }}
              textarea
            />
          </Box>
        </Box>
        <Box marginBottom={5}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.endOfSessionTitle)}
            </Text>
          </Box>
          <GridContainer>
            <GridRow>
              <GridColumn>
                <DateTime
                  name="courtEndTime"
                  datepickerLabel={formatMessage(
                    m.sections.courtEndTime.dateLabel,
                  )}
                  timeLabel={formatMessage(m.sections.courtEndTime.timeLabel)}
                  minDate={
                    workingCase.courtStartDate
                      ? new Date(workingCase.courtStartDate)
                      : undefined
                  }
                  maxDate={new Date()}
                  selectedDate={workingCase.courtEndTime}
                  onChange={(date: Date | undefined, valid: boolean) => {
                    setAndSendCaseToServer(
                      [
                        {
                          courtEndTime:
                            date && valid
                              ? formatDateForServer(date)
                              : undefined,
                          force: true,
                        },
                      ],
                      workingCase,
                      setWorkingCase,
                    )
                  }}
                  blueBox={false}
                  required
                />
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
        <Box marginBottom={10}>
          <PdfButton
            caseId={workingCase.id}
            title={formatMessage(core.pdfButtonRulingShortVersion)}
            pdfType="courtRecord"
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INVESTIGATION_CASE_RULING_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoadingWorkingCase}
          onNextButtonClick={() =>
            handleNavigationTo(constants.INVESTIGATION_CASE_CONFIRMATION_ROUTE)
          }
          nextIsDisabled={!stepIsValid}
          hideNextButton={
            !workingCase.decision ||
            !workingCase.conclusion ||
            !workingCase.ruling
          }
          infoBoxText={
            !workingCase.decision ||
            !workingCase.conclusion ||
            !workingCase.ruling
              ? formatMessage(m.sections.nextButtonInfo.text)
              : ''
          }
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CourtRecord
