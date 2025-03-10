import { gql } from '@apollo/client'

const CaseQuery = gql`
  query Case($input: CaseQueryInput!) {
    case(input: $input) {
      id
      created
      modified
      type
      indictmentSubtypes
      description
      state
      policeCaseNumbers
      defendants {
        id
        noNationalId
        nationalId
        name
        gender
        address
        citizenship
        defenderName
        defenderNationalId
        defenderEmail
        defenderPhoneNumber
        defendantWaivesRightToCounsel
      }
      defenderName
      defenderNationalId
      defenderEmail
      defenderPhoneNumber
      sendRequestToDefender
      isHeightenedSecurityLevel
      court {
        id
        name
        type
      }
      leadInvestigator
      arrestDate
      requestedCourtDate
      translator
      requestedValidToDate
      demands
      lawsBroken
      legalBasis
      legalProvisions
      requestedCustodyRestrictions
      requestedOtherRestrictions
      caseFacts
      legalArguments
      requestProsecutorOnlySession
      prosecutorOnlySessionRequest
      comments
      caseFilesComments
      creatingProsecutor {
        id
        name
        title
        institution {
          id
          name
        }
      }
      prosecutor {
        id
        name
        title
        institution {
          id
          name
        }
      }
      sharedWithProsecutorsOffice {
        id
        type
        name
      }
      courtCaseNumber
      sessionArrangements
      courtDate
      courtLocation
      courtRoom
      courtStartDate
      courtEndTime
      isClosedCourtHidden
      courtAttendees
      prosecutorDemands
      courtDocuments
      sessionBookings
      courtCaseFacts
      introduction
      courtLegalArguments
      ruling
      decision
      validToDate
      isValidToDateInThePast
      isCustodyIsolation
      isolationToDate
      conclusion
      endOfSessionBookings
      accusedAppealDecision
      accusedAppealAnnouncement
      prosecutorAppealDecision
      prosecutorAppealAnnouncement
      accusedPostponedAppealDate
      prosecutorPostponedAppealDate
      rulingDate
      judge {
        id
        name
        title
      }
      courtRecordSignatory {
        id
        name
        title
      }
      courtRecordSignatureDate
      registrar {
        id
        name
        title
      }
      parentCase {
        id
        state
        validToDate
        decision
        courtCaseNumber
        ruling
        caseFiles {
          id
          name
          size
          created
          state
          key
        }
      }
      childCase {
        id
      }
      notifications {
        created
        type
        recipients {
          success
        }
      }
      caseFiles {
        id
        name
        size
        created
        modified
        state
        key
        category
        policeCaseNumber
        chapter
        orderWithinChapter
        userGeneratedFilename
        displayDate
      }
      isAppealDeadlineExpired
      isAppealGracePeriodExpired
      caseModifiedExplanation
      rulingModifiedHistory
      caseResentExplanation
      origin
      openedByDefender
      defendantWaivesRightToCounsel
      crimeScenes
      indictmentIntroduction
      indictmentCounts {
        id
        caseId
        policeCaseNumber
        created
        modified
        vehicleRegistrationNumber
        offenses
        substances
        lawsBroken
        incidentDescription
        legalArguments
      }
      requestDriversLicenseSuspension
      appealState
      isStatementDeadlineExpired
      statementDeadline
      canBeAppealed
      hasBeenAppealed
      appealedByRole
      appealedDate
      appealDeadline
      prosecutorStatementDate
      defendantStatementDate
      appealReceivedByCourtDate
      appealConclusion
      appealRulingDecision
      appealCaseNumber
      appealAssistant {
        id
        name
      }
      appealJudge1 {
        id
        name
      }
      appealJudge2 {
        id
        name
      }
      appealJudge3 {
        id
        name
      }
    }
  }
`

export default CaseQuery
