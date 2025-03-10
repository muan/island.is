import { gql } from '@apollo/client'

const LimitedAccessCaseQuery = gql`
  query LimitedAccessCase($input: CaseQueryInput!) {
    limitedAccessCase(input: $input) {
      id
      created
      origin
      type
      indictmentSubtypes
      state
      policeCaseNumbers
      caseFiles {
        id
        name
        category
        created
        key
        policeCaseNumber
      }
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
      court {
        id
        name
        type
      }
      leadInvestigator
      requestedCustodyRestrictions
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
      courtCaseNumber
      courtEndTime
      validToDate
      decision
      isValidToDateInThePast
      isCustodyIsolation
      isolationToDate
      conclusion
      accusedPostponedAppealDate
      prosecutorPostponedAppealDate
      rulingDate
      registrar {
        id
        name
        title
      }
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
      parentCase {
        id
        state
        validToDate
        decision
        courtCaseNumber
        ruling
      }
      childCase {
        id
      }
      caseModifiedExplanation
      caseResentExplanation
      appealState
      accusedAppealDecision
      prosecutorAppealDecision
      isAppealDeadlineExpired
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

export default LimitedAccessCaseQuery
