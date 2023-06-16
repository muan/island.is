import { formatText, getValueViaPath } from '@island.is/application/core'
import { Application, YesOrNo } from '@island.is/application/types'
import { MONTHS } from './constants'
import { oldAgePensionFormMessage } from './messages'

import * as kennitala from 'kennitala'
import addYears from 'date-fns/addYears'
import addMonths from 'date-fns/addMonths'
import { residenceHistory, combinedResidenceHistory } from '../types'
import React from 'react'
import { useLocale } from '@island.is/localization'
import { getCountryByCode } from '@island.is/shared/utils'

interface fileType {
  key: string
  name: string
}

interface earlyRetirementPensionfundFishermen {
  earlyRetirement?: fileType[]
  pension?: fileType[]
  fishermen?: fileType[]
}

export function getApplicationAnswers(answers: Application['answers']) {
  const pensionFundQuestion = getValueViaPath(
    answers,
    'questions.pensionFund',
  ) as YesOrNo

  const isFishermen = getValueViaPath(answers, 'questions.fishermen') as YesOrNo

  const selectedYear = getValueViaPath(answers, 'period.year') as string

  const selectedMonth = getValueViaPath(answers, 'period.month') as string

  const applicantEmail = getValueViaPath(
    answers,
    'applicantInfo.email',
  ) as string

  const applicantPhonenumber = getValueViaPath(
    answers,
    'applicantInfo.phonenumber',
  ) as string

  const residenceHistoryQuestion = getValueViaPath(
    answers,
    'residenceHistory.question',
  ) as YesOrNo

  const onePaymentPerYear = getValueViaPath(
    answers,
    'onePaymentPerYear.question',
  ) as YesOrNo

  const comment = getValueViaPath(answers, 'comment') as string

  return {
    pensionFundQuestion,
    isFishermen,
    selectedYear,
    selectedMonth,
    applicantEmail,
    applicantPhonenumber,
    residenceHistoryQuestion,
    onePaymentPerYear,
    comment,
  }
}

export function getApplicationExternalData(
  externalData: Application['externalData'],
) {
  const residenceHistory = getValueViaPath(
    externalData,
    'nationalRegistryResidenceHistory.data',
    [],
  ) as residenceHistory[]

  const applicantName = getValueViaPath(
    externalData,
    'nationalRegistry.data.fullName',
  ) as string

  const applicantNationalId = getValueViaPath(
    externalData,
    'nationalRegistry.data.nationalId',
  ) as string

  const applicantAddress = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.streetAddress',
  ) as string

  const applicantPostalCode = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.postalCode',
  ) as string

  const applicantLocality = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.locality',
  ) as string

  const applicantMunicipality = applicantPostalCode + ', ' + applicantLocality

  const hasSpouse = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data',
  ) as object

  const spouseName = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data.name',
  ) as string

  const spouseNationalId = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data.nationalId',
  ) as string

  const maritalStatus = getValueViaPath(
    externalData,
    'nationalRegistrySpouse.data.maritalStatus',
  ) as string

  return {
    residenceHistory,
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantMunicipality,
    hasSpouse,
    spouseName,
    spouseNationalId,
    maritalStatus,
  }
}

export function getStartDateAndEndDate(nationalId: string) {
  const today = new Date()
  const nationalIdInfo = kennitala.info(nationalId)
  const dateOfBirth = new Date(nationalIdInfo.birthday)
  const age = nationalIdInfo.age
  const dateOfBirthThisYear = new Date(
    today.getFullYear(),
    dateOfBirth.getMonth(),
    dateOfBirth.getDay(),
  )

  const thisYearAge = dateOfBirthThisYear > today ? age + 1 : age

  let startDate = dateOfBirthThisYear
  let endDate = addMonths(today, 6)
  if (thisYearAge >= 67) {
    startDate = addYears(
      dateOfBirthThisYear > today ? dateOfBirthThisYear : today,
      -2,
    )
  } else if (thisYearAge === 66) {
    startDate = addYears(dateOfBirthThisYear, -1)
  } else if (thisYearAge < 65) {
    return {}
  }
  if (startDate > endDate) return {}

  return { startDate, endDate }
}

export function getAvailableYears(application: Application) {
  const { applicantNationalId } = getApplicationExternalData(
    application['externalData'],
  )
  if (!applicantNationalId) return []

  const { startDate, endDate } = getStartDateAndEndDate(applicantNationalId)
  if (!startDate || !endDate) return []

  const startDateYear = startDate.getFullYear()
  const endDateYear = endDate.getFullYear()

  return Array.from(Array(endDateYear - startDateYear + 1).keys()).map((x) => {
    const theYear = x + startDateYear
    return { value: theYear.toString(), label: theYear.toString() }
  })
}

export function getAvailableMonths(
  application: Application,
  selectedYear: string,
) {
  const { applicantNationalId } = getApplicationExternalData(
    application['externalData'],
  )
  if (!applicantNationalId) return []

  const { startDate, endDate } = getStartDateAndEndDate(applicantNationalId)
  if (!startDate || !endDate || !selectedYear) return []

  let months = MONTHS
  if (startDate.getFullYear().toString() === selectedYear) {
    months = months.slice(startDate.getMonth(), months.length + 1)
  } else if (endDate.getFullYear().toString() === selectedYear) {
    months = months.slice(0, endDate.getMonth() + 1)
  }

  return months.map((month) => {
    switch (month) {
      case 'January':
        return { value: month, label: oldAgePensionFormMessage.period.january }
      case 'February':
        return { value: month, label: oldAgePensionFormMessage.period.february }
      case 'March':
        return { value: month, label: oldAgePensionFormMessage.period.march }
      case 'April':
        return { value: month, label: oldAgePensionFormMessage.period.april }
      case 'May':
        return { value: month, label: oldAgePensionFormMessage.period.may }
      case 'June':
        return { value: month, label: oldAgePensionFormMessage.period.june }
      case 'July':
        return { value: month, label: oldAgePensionFormMessage.period.july }
      case 'Agust':
        return { value: month, label: oldAgePensionFormMessage.period.agust }
      case 'September':
        return {
          value: month,
          label: oldAgePensionFormMessage.period.september,
        }
      case 'October':
        return { value: month, label: oldAgePensionFormMessage.period.october }
      case 'November':
        return { value: month, label: oldAgePensionFormMessage.period.november }
      case 'December':
        return { value: month, label: oldAgePensionFormMessage.period.desember }
      default:
        return { value: '0', label: '' }
    }
  })
}

export function getAgeBetweenTwoDates(
  selectedDate: Date,
  dateOfBirth: Date,
): number {
  const diffTime = selectedDate.getTime() - dateOfBirth.getTime()
  const age = Math.abs(Math.floor(diffTime / (365.25 * 60 * 60 * 24 * 1000)))

  return age
}

export function getAttachments(answers: Application['answers']) {
  const attachments: string[] = []

  const getAttachmentsName = (attachmentsArr: fileType[] | undefined) => {
    if (attachmentsArr && attachmentsArr.length > 0) {
      attachmentsArr.map((attch) => {
        attachments.push(attch.name)
      })
    }
  }

  // Early retirement, pension fund, fishermen
  const earlyPenFisher = answers.fileUploadEarlyPenFisher as earlyRetirementPensionfundFishermen
  getAttachmentsName(earlyPenFisher.pension)
  getAttachmentsName(earlyPenFisher.earlyRetirement)
  getAttachmentsName(earlyPenFisher.fishermen)

  return attachments
}

// return combine residence history if the applicant had domestic transport
export function getCombinedResidenceHistory(
  residenceHistory: residenceHistory[],
): combinedResidenceHistory[] {
  let combinedResidenceHistory: combinedResidenceHistory[] = []

  residenceHistory.map((history) => {
    if (combinedResidenceHistory.length === 0) {
      return combinedResidenceHistory.push(residenceMapper(history))
    }

    const priorResidence = combinedResidenceHistory.at(-1)
    if (priorResidence?.country !== history.country) {
      combinedResidenceHistory.at(-1)!.periodTo = history.dateOfChange

      return combinedResidenceHistory.push(residenceMapper(history))
    }
  })

  return [...combinedResidenceHistory].reverse()
}

function residenceMapper(history: residenceHistory): combinedResidenceHistory {
  const residence = {} as combinedResidenceHistory
  residence.country = history.country
  residence.periodFrom = history.dateOfChange
  residence.periodTo = '-'

  return residence
}

export function residenceHistoryTableData(application: Application) {
  const { lang, formatMessage } = useLocale()
  const { residenceHistory } = getApplicationExternalData(
    application.externalData,
  )

  const combinedResidenceHistory = getCombinedResidenceHistory(
    [...residenceHistory].reverse(),
  )

  const formattedData =
    combinedResidenceHistory.map((history) => {
      return {
        country:
          lang === 'is'
            ? getCountryByCode(history.country)?.name_is
            : getCountryByCode(history.country)?.name,
        periodFrom: new Date(history.periodFrom).toLocaleDateString(),
        periodTo:
          history.periodTo !== '-'
            ? new Date(history.periodTo).toLocaleDateString()
            : '-',
        // lengthOfStay: 0//history.periodTo !== '-' ? formatDistance(history.periodTo as Date, history.periodFrom) : '-' //lengthOfStay(history.periodTo as Date, history.periodFrom)
      }
    }) ?? []

  const data = React.useMemo(() => [...formattedData], [formattedData])

  const columns = React.useMemo(
    () => [
      {
        Header: formatText(
          oldAgePensionFormMessage.shared.residenceHistoryCountryTableHeader,
          application,
          formatMessage,
        ),
        accessor: 'country',
      } as const,
      {
        Header: formatText(
          oldAgePensionFormMessage.shared.residenceHistoryPeriodFromTableHeader,
          application,
          formatMessage,
        ),
        accessor: 'periodFrom',
      } as const,
      {
        Header: formatText(
          oldAgePensionFormMessage.shared.residenceHistoryPeriodToTableHeader,
          application,
          formatMessage,
        ),
        accessor: 'periodTo',
      } as const,
      // {
      //   Header: formatText('Dvalartími (16-67 ára)', application, formatMessage),
      //   accessor: 'lengthOfStay',
      // } as const,
    ],
    [application, formatMessage],
  )

  return { data, columns }
}
