export const LOG_CATEGORY = 'license-api-driving-client'

export const DRIVING_LICENSE_API_CLIENT_FACTORY =
  'driving-license-api-client-factory'

export interface DrivingLicenseResponse {
  id?: number
  nafn?: string
  kennitala?: string
  faedingarstadur?: string
  faedingarStadurHeiti?: string
  utgafuDagsetning?: string
  gildirTil?: string
  nrUtgafustadur?: number
  nafnUtgafustadur?: string
  erBradabirgda?: boolean
  rettindi?: {
    id?: number
    nr?: string
    utgafuDags?: string
    gildirTil?: string
    aths?: string
  }[]
  athugasemdir?: {
    id?: number
    nr?: string
    athugasemd?: string
  }[]
  myndId?: number
  undirskriftId?: number
  mynd?: {
    id?: number
    kennitala?: string
    skrad?: string
    mynd?: string
    gaedi?: number
    forrit?: number
    tegund?: number
  } | null
  undirskrift?: {
    id?: number
    kennitala?: string
    skrad?: string
    mynd?: string
    gaedi?: number
    forrit?: number
    tegund?: number
  } | null
  svipting?: {
    dagsFra?: string | null
    dagsTil?: string | null
    skirteiniGlatad?: number | null
    tegundSviptingarHeiti?: string | null
    tegundSviptingar?: number | null
    skirteiniUrGildi?: number | null
    endurupptakaSkirteinis?: number | null
  }
}
