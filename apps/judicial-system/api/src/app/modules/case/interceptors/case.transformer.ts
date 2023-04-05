import { Case } from '../models/case.model'

const threeDays = 3 * 24 * 60 * 60 * 1000
const sevenDays = 7 * 24 * 60 * 60 * 1000

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
      ? Date.now() >= new Date(theCase.courtEndTime).getTime() + threeDays
      : false,
    isAppealGracePeriodExpired: theCase.courtEndTime
      ? Date.now() >= new Date(theCase.courtEndTime).getTime() + sevenDays
      : false,
  }
}
