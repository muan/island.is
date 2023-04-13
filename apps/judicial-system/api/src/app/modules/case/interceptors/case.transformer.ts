import { Case } from '../models/case.model'

const getDays = (days: number) => days * 24 * 60 * 60 * 1000

export function transformCase(theCase: Case): Case {
  return {
    ...theCase,
    sendRequestToDefender: theCase.sendRequestToDefender ?? false,
    requestProsecutorOnlySession: theCase.requestProsecutorOnlySession ?? false,
    isClosedCourtHidden: theCase.isClosedCourtHidden ?? false,
    isHeightenedSecurityLevel: theCase.isHeightenedSecurityLevel ?? false,
    isValidToDateInThePast: theCase.validToDate
      ? Date.now() > new Date(theCase.validToDate).getTime()
      : theCase.isValidToDateInThePast,
    isAppealDeadlineExpired: theCase.courtEndTime
      ? Date.now() >= new Date(theCase.courtEndTime).getTime() + getDays(3)
      : false,
    isAppealGracePeriodExpired: theCase.courtEndTime
      ? Date.now() >= new Date(theCase.courtEndTime).getTime() + getDays(7)
      : false,
    isStatementDeadlineExpired: theCase.prosecutorPostponedAppealDate
      ? Date.now() >=
        new Date(theCase.prosecutorPostponedAppealDate).getTime() + getDays(1)
      : theCase.accusedPostponedAppealDate
      ? Date.now() >=
        new Date(theCase.accusedPostponedAppealDate).getTime() + getDays(1)
      : false,
  }
}
