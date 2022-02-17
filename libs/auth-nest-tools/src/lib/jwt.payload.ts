export type JwtDelegationType = 'ProcurationHolder' | 'LegalGuardian' | 'Custom'

export interface JwtAct {
  client_id: string
  act?: JwtAct
}

export interface JwtPayload {
  nationalId?: string
  scope: string | string[]
  client_id: string
  act?: JwtAct
  actor?: {
    nationalId: string
    delegationType: JwtDelegationType
    scope?: string | string[]
  }
}
