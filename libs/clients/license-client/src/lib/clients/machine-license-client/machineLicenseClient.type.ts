import { VinnuvelaDto } from '@island.is/clients/adr-and-machine-license'

export interface MachineLicenseDto extends VinnuvelaDto {
  gildirTil?: string | null
}
