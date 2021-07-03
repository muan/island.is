import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  adsBackend: ServiceBuilder<'air-discount-scheme-backend'>
}): ServiceBuilder<'air-discount-scheme-api'> => {
  return service('air-discount-scheme-api')
    .namespace('air-discount-scheme')
    .serviceAccount()
    .env({
      SAML_ENTRY_POINT: {
        dev: 'https://innskraning.island.is/?id=ads.dev',
        staging: 'https://innskraning.island.is/?id=ads.staging',
        prod: 'https://innskraning.island.is/?id=ads.prod',
      },
      AUTH_AUDIENCE: {
        dev: 'loftbru.dev01.devland.is',
        staging: 'loftbru.staging01.devland.is',
        prod: 'loftbru.island.is',
      },
      ELASTIC_NODE: {
        dev:
          'https://vpc-search-njkekqydiegezhr4vqpkfnw5la.eu-west-1.es.amazonaws.com',
        staging:
          'https://vpc-search-q6hdtjcdlhkffyxvrnmzfwphuq.eu-west-1.es.amazonaws.com',
        prod:
          'https://vpc-search-mw4w5c2m2g5edjrtvwbpzhkw24.eu-west-1.es.amazonaws.com',
      },
      BACKEND_URL: ref((h) => `http://${h.svc(services.adsBackend)}`),
      CONTENTFUL_HOST: {
        dev: 'preview.contentful.com',
        staging: 'cdn.contentful.com',
        prod: 'cdn.contentful.com',
      },
      NODE_OPTIONS: '--max-old-space-size=480',
    })
    .secrets({
      SENTRY_DSN: '/k8s/air-discount-scheme-api/SENTRY_DSN',
      AUTH_JWT_SECRET: '/k8s/air-discount-scheme/api/AUTH_JWT_SECRET',
      CONTENTFUL_ACCESS_TOKEN:
        '/k8s/air-discount-scheme/api/CONTENTFUL_ACCESS_TOKEN',
      DEVELOPERS: '/k8s/air-discount-scheme/api/DEVELOPERS',
      ADMINS: '/k8s/air-discount-scheme/api/ADMINS',
    })

    .ingress({
      primary: {
        host: {
          dev: ['loftbru', 'loftbru-cf'],
          staging: ['loftbru', 'loftbru-cf'],
          prod: ['loftbru'],
        },
        extraAnnotations: {
          dev: {},
          staging: {},
          prod: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
        },
        paths: ['/api'],
        public: true,
      },
    })
    .resources({
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '100m', memory: '256Mi' },
    })
    .readiness('/liveness')
    .liveness('/liveness')
}
