import { AdrDto } from '@island.is/clients/adr-and-machine-license'

import format from 'date-fns/format'
import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import {
  FlattenedAdrDto,
  FlattenedAdrRightsDto,
} from '@island.is/clients/license-client'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericLicenseLabels,
  GenericUserLicensePayload,
} from '../licenceService.type'
import { getLabel } from '../utils/translations'

export const parseAdrLicensePayload = (
  license: FlattenedAdrDto,
  locale: Locale = 'is',
  labels?: GenericLicenseLabels,
): GenericUserLicensePayload | null => {
  if (!license) return null

  const label = labels?.labels

  const data: Array<GenericLicenseDataField> = [
    {
      name: getLabel('basicInfoLicense', locale, label),
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('licenseNumber', locale, label),
      value: license.skirteinisNumer?.toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('fullName', locale, label),
      value: license.fulltNafn ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('publisher', locale, label),
      value: 'Vinnueftirlitið',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('validTo', locale, label),
      value: license.gildirTil ?? '',
    },
  ]

  const adrRights = (license.adrRettindi ?? []).filter((field) => field.grunn)
  const tankar = parseRights(
    getLabel('tanks', locale, label) ?? '',
    adrRights.filter((field) => field.tankar),
  )

  if (tankar) data.push(tankar)

  const grunn = parseRights(
    getLabel('otherThanTanks', locale, label) ?? '',
    adrRights,
  )
  if (grunn) data.push(grunn)

  return {
    data,
    rawData: JSON.stringify(license),
    metadata: {
      licenseNumber: license.skirteinisNumer?.toString() ?? '',
      expired: license.gildirTil
        ? !isAfter(new Date(license.gildirTil), new Date())
        : null,
      expireDate: license.gildirTil ?? undefined,
    },
  }
}

const parseRights = (
  label: string,
  data: FlattenedAdrRightsDto[],
): GenericLicenseDataField | undefined => {
  if (!data.length) {
    return
  }

  return {
    type: GenericLicenseDataFieldType.Group,
    label: label,
    fields: data.map((field) => ({
      type: GenericLicenseDataFieldType.Category,
      name: field.flokkur ?? '',
      label: field.heiti ?? '',
      description: field.heiti ?? '',
    })),
  }
}
