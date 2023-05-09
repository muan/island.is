import {
  TherapyApi,
  Configuration,
  AidsandnutritionApi,
  DentistApi,
  HealthcenterApi,
} from '../../gen/fetch'
import { ApiConfig } from './rightsPortalProvider'

export const exportedApis = [
  TherapyApi,
  AidsandnutritionApi,
  DentistApi,
  HealthcenterApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfig.provide],
}))
