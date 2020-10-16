import { buildOpenApi } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { openApi } from './openApi'

buildOpenApi({
  path: 'apps/services/user-profile/src/openapi.yaml',
  appModule: AppModule,
  openApi,
})
