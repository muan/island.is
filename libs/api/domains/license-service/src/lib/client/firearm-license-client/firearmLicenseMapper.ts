import {
  FirearmProperty,
  FirearmPropertyList,
  LicenseInfo,
} from '@island.is/clients/firearm-license'
import isAfter from 'date-fns/isAfter'
import format from 'date-fns/format'
import { format as formatSsn } from 'kennitala'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericUserLicensePayload,
} from '../../licenceService.type'
import { LicenseData } from './firearmLicense.type'

const formatDateString = (dateTime: string) =>
  dateTime ? format(new Date(dateTime), 'dd.MM.yyyy') : ''

export const parseFirearmLicensePayload = (
  licenseData: LicenseData,
): GenericUserLicensePayload | null => {
  const { licenseInfo, properties, categories } = licenseData

  const expired = licenseInfo?.expirationDate
    ? !isAfter(new Date(licenseInfo.expirationDate), new Date())
    : false
  if (!licenseInfo) return null

  const data: Array<GenericLicenseDataField> = [
    licenseInfo.licenseNumber && {
      name: 'Grunnupplýsingar skotvopnaleyfis',
      type: GenericLicenseDataFieldType.Value,
      label: 'Númer skírteinis',
      value: licenseInfo.licenseNumber,
    },
    licenseInfo.name && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Fullt nafn',
      value: licenseInfo.name,
    },
    licenseInfo.issueDate && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Útgáfudagur',
      value: licenseInfo.issueDate ?? '',
    },
    licenseInfo.expirationDate && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Gildir til',
      value: licenseInfo.expirationDate ?? '',
    },
    licenseInfo.collectorLicenseExpirationDate && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Safnaraskírteini gildir til',
      value: licenseInfo.collectorLicenseExpirationDate ?? '',
    },

    licenseInfo.qualifications && {
      type: GenericLicenseDataFieldType.Group,
      label: 'Réttindaflokkar',
      fields: licenseInfo.qualifications.split('').map((qualification) => ({
        type: GenericLicenseDataFieldType.Category,
        name: qualification,
        label: categories?.[`Flokkur ${qualification}`] ?? '',
        description: categories?.[`Flokkur ${qualification}`] ?? '',
      })),
    },
    properties && {
      type: GenericLicenseDataFieldType.Group,
      hideFromServicePortal: true,
      label: 'Skotvopn í eigu leyfishafa',
      fields: (properties.properties ?? []).map((property) => ({
        type: GenericLicenseDataFieldType.Category,
        fields: parseProperties(property)?.filter(
          (Boolean as unknown) as ExcludesFalse,
        ),
      })),
    },
    properties && {
      type: GenericLicenseDataFieldType.Table,
      label: 'Skotvopn í eigu leyfishafa',
      fields: (properties.properties ?? []).map((property) => ({
        type: GenericLicenseDataFieldType.Category,
        fields: parseProperties(property)?.filter(
          (Boolean as unknown) as ExcludesFalse,
        ),
      })),
    },
  ].filter((Boolean as unknown) as ExcludesFalse)

  return {
    data,
    rawData: JSON.stringify(licenseData),
    metadata: {
      licenseNumber: licenseData.licenseInfo?.licenseNumber?.toString() ?? '',
      expired,
    },
  }
}

type ExcludesFalse = <T>(x: T | null | undefined | false | '') => x is T

const parseProperties = (
  property?: FirearmProperty,
): Array<GenericLicenseDataField> | null => {
  if (!property) return null

  const mappedProperty = [
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Staða skotvopns',
      value: property.category ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Tegund',
      value: property.typeOfFirearm ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Heiti',
      value: property.name ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Númer',
      value: property.serialNumber ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Landsnúmer',
      value: property.landsnumer ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Hlaupvídd',
      value: property.caliber ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Takmarkanir',
      value: property.limitation ?? '',
    },
  ]
  return mappedProperty
}

const parsePropertyForPkpassInput = (properties?: Array<FirearmProperty>) => {
  if (!properties?.length) return 'Engin skráð skotvopn'

  const propertyString = properties
    .map(
      (property) =>
        `▶︎ ${property.typeOfFirearm} ${property.name}.\r\nHlaupvídd ${property.caliber}.\r\nNúmer ${property.serialNumber}.`,
    )
    .join('\r\n\r\n')

  return propertyString
}

export const createPkPassDataInput = (
  licenseInfo?: LicenseInfo | null,
  propertyInfo?: FirearmPropertyList | null,
  nationalId?: string,
) => {
  if (!licenseInfo || !nationalId) return null

  const parseAddress = (address?: string) => {
    if (!address) return

    const splitArray = address.split(',')
    return {
      address: splitArray[0] ? splitArray[0].trim() : '',
      zip: splitArray[1] ? splitArray[1].trim() : '',
    }
  }

  const parsedAddress = parseAddress(licenseInfo.address ?? '')

  return [
    {
      identifier: 'gildir',
      value: licenseInfo.expirationDate
        ? formatDateString(licenseInfo.expirationDate)
        : '',
    },
    {
      identifier: 'nafn',
      value: licenseInfo.name ?? '',
    },
    {
      identifier: 'kt',
      value: licenseInfo.ssn ? formatSsn(licenseInfo.ssn) : '',
    },
    {
      identifier: 'heimilisfang',
      value: parsedAddress?.address ?? '',
    },
    {
      identifier: 'postnr.',
      value: parsedAddress?.zip ?? '',
    },
    {
      identifier: 'numer',
      value: licenseInfo.licenseNumber ?? '',
    },
    {
      identifier: 'rettindi',
      value: licenseInfo.qualifications
        ? licenseInfo.qualifications.split('').join(' ')
        : '',
    },
    {
      identifier: 'skotvopn',
      value: propertyInfo
        ? parsePropertyForPkpassInput(propertyInfo.properties ?? [])
        : '',
    },
    {
      identifier: 'utgefandi',
      value: 'Lögreglan',
    },
  ]
}
