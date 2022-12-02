import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  fetchTimeout: z.number().int(),
  clientId: z.string(),
  clientSecret: z.string(),
  scope: z.string(),
  endpoint: z.string(),
})

export const NationalRegistryV3ClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: ' NationalRegistryV3Client',
  schema,
  load: (env) => ({
    fetchTimeout: 20000,
    clientId: env.required('NATIONAL_REGISTRY_B2C_CLIENT_ID', ''),
    clientSecret: env.required('NATIONAL_REGISTRY_B2C_CLIENT_SECRET', ''),
    scope: env.required('NATIONAL_REGISTRY_B2C_SCOPE', ''),
    endpoint: env.required('NATIONAL_REGISTRY_B2C_ENDPOINT', ''),
  }),
})
