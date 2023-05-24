import { defineMessages } from 'react-intl'

export const m = defineMessages({
  idsAdmin: {
    id: 'ap.ids-admin:ids-admin',
    defaultMessage: 'Innskráningarkerfi',
  },
  idsAdminDescription: {
    id: 'ap.ids-admin:ids-admin-description',
    defaultMessage: 'Choose the domain you want to manage.',
  },
  tenants: {
    id: 'ap.ids-admin:tenants',
    defaultMessage: 'Tenants',
  },
  errorLoadingData: {
    id: 'ap.ids-admin:error-loading-data',
    defaultMessage: 'Error loading data. Please try again later.',
  },
  clearFilter: {
    id: 'ap.ids-admin:clear-filter',
    defaultMessage: 'Clear filter',
  },
  clearAllFilters: {
    id: 'ap.ids-admin:clear-all-filters',
    defaultMessage: 'Clear all filters',
  },
  openFilter: {
    id: 'ap.ids-admin:open-filter',
    defaultMessage: 'Open filter',
  },
  closeFilter: {
    id: 'ap.ids-admin:close-filter',
    defaultMessage: 'Close filter',
  },
  searchPlaceholder: {
    id: 'ap.ids-admin:search-placeholder',
    defaultMessage: 'Search',
  },
  clients: {
    id: 'ap.ids-admin:clients',
    defaultMessage: 'Applications',
  },
  applicationCreate: {
    id: 'ap.ids-admin:client-create',
    defaultMessage: 'Create application',
  },
  apis: {
    id: 'ap.ids-admin:apis',
    defaultMessage: 'APIs',
  },
  settings: {
    id: 'ap.ids-admin:settings',
    defaultMessage: 'Settings',
  },
  authentication: {
    id: 'ap.ids-admin:authentication',
    defaultMessage: 'Permissions',
  },
  advancedSettings: {
    id: 'ap.ids-admin:advanced-settings',
    defaultMessage: 'Advanced settings',
  },
  back: {
    id: 'ap.ids-admin:back',
    defaultMessage: 'Back',
  },
  clientsDescription: {
    id: 'ap.ids-admin:clients-description',
    defaultMessage: 'Here you can view and create applications.',
  },
  learnMore: {
    id: 'ap.ids-admin:learn-more',
    defaultMessage: 'Learn more',
  },
  noClients: {
    id: 'ap.ids-admin:no-clients',
    defaultMessage: 'No applications',
  },
  noClientsDescription: {
    id: 'ap.ids-admin:no-clients-description',
    defaultMessage:
      'You can create an application by clicking on Create application',
  },
  cancel: {
    id: 'ap.ids-admin:cancel',
    defaultMessage: 'Cancel',
  },
  close: {
    id: 'ap.ids-admin:close',
    defaultMessage: 'Close',
  },
  add: {
    id: 'ap.ids-admin:add',
    defaultMessage: 'Add',
  },
  create: {
    id: 'ap.ids-admin:create',
    defaultMessage: 'Create',
  },
  displayName: {
    id: 'ap.ids-admin:display-name',
    defaultMessage: 'Name',
  },
  displayNameDescription: {
    id: 'ap.ids-admin:display-name',
    defaultMessage: 'Users see this when they sign in, and manage consents.',
  },
  description: {
    id: 'ap.ids-admin:description',
    defaultMessage: 'Description',
  },
  descriptionInfo: {
    id: 'ap.ids-admin:description-info',
    defaultMessage:
      'Users see this when they sign in, and manage consents. This should explain in concise and clear terms which resources or actions this permission gives access to.',
  },
  clientId: {
    id: 'ap.ids-admin:clientId',
    defaultMessage: 'Client ID',
  },
  chooseEnvironment: {
    id: 'ap.ids-admin:choose-environment',
    defaultMessage: 'Choose environment',
  },
  chooseClientType: {
    id: 'ap.ids-admin:choose-client-type',
    defaultMessage: 'Choose application type',
  },
  errorDisplayName: {
    id: 'ap.ids-admin:error-display-name',
    defaultMessage: 'Name is required.',
  },
  errorDescription: {
    id: 'ap.ids-admin:error-description',
    defaultMessage: 'Description is required.',
  },
  errorClientId: {
    id: 'ap.ids-admin:error-client-id',
    defaultMessage: 'Application ID is required.',
  },
  errorClientIdRegex: {
    id: 'ap.ids-admin:error-client-id-regex',
    defaultMessage: 'Allowed characters are A-Z a-z 0-9 . _ - /',
  },
  errorScopeId: {
    id: 'ap.ids-admin:error-scope-id',
    defaultMessage: 'Scope ID is required.',
  },
  errorScopeIdRegex: {
    id: 'ap.ids-admin:error-scope-id-regex',
    defaultMessage: 'Allowed characters are A-Z a-z 0-9 . _ - /',
  },
  errorEnvironment: {
    id: 'ap.ids-admin:error-environment',
    defaultMessage: 'Choose at least one environment.',
  },
  errorClientType: {
    id: 'ap.ids-admin:error-client-type',
    defaultMessage: 'Application type is required.',
  },
  errorDefault: {
    id: 'ap.ids-admin:error-default',
    defaultMessage: 'Oops, an unknown error has occurred.',
  },
  webClientsTitle: {
    id: 'ap.ids-admin:web-clients-title',
    defaultMessage: 'Web application',
  },
  webClientsDescription: {
    id: 'ap.ids-admin:web-clients-description',
    defaultMessage:
      'Traditional web apps using redirects. E.g. Node.js, Express, ASP.net, Java, PHP.',
  },
  nativeClientsTitle: {
    id: 'ap.ids-admin:native-clients-title',
    defaultMessage: 'Native application',
  },
  nativeClientsDescription: {
    id: 'ap.ids-admin:native-clients-description',
    defaultMessage:
      'Mobile, desktop, CLI and smart device app running natively. E.g. iOS, Electron, Apple TV app.',
  },
  machineClientsTitle: {
    id: 'ap.ids-admin:machine-clients-title',
    defaultMessage: 'Machine to machine application',
  },
  machineClientsDescription: {
    id: 'ap.ids-admin:machine-clients-description',
    defaultMessage:
      'CLIs, daemons, or services running on your backend. E.g. APIs, CRON jobs or shell script.',
  },
  spaClientsTitle: {
    id: 'ap.ids-admin:spa-clients-title',
    defaultMessage: 'Single page application',
  },
  createClient: {
    id: 'ap.ids-admin:create-client',
    defaultMessage: 'Create application',
  },
  change: {
    id: 'ap.ids-admin:change',
    defaultMessage: 'Change',
  },
  absoluteLifetime: {
    id: 'ap.ids-admin:absolute-lifetime',
    defaultMessage: 'Absolute lifetime (seconds)',
  },
  absoluteLifetimeDescription: {
    id: 'ap.ids-admin:absolute-lifetime-description',
    defaultMessage:
      'Sets the absolute lifetime of a refresh token (in seconds).',
  },
  readableSeconds: {
    id: 'ap.ids-admin:readable-seconds',
    defaultMessage:
      '{sec} seconds is {isExact, select, true {equal to} other {more than}} {value} {unit, select, years {{value, plural, =1 {year} other {years}}} months {{value, plural, =1 {month} other {months}}} days {{value, plural, =1 {day} other {days}}} hours {{value, plural, =1 {hour} other {hours}}} minutes {{value, plural, =1 {minute} other {minutes}}} other {{value, plural, =1 {second} other {seconds}}}}.',
    description:
      'For transforming seconds to more human readable format. The end of the string displays the unit in singular or plural form.',
  },
  inactivityExpiration: {
    id: 'ap.ids-admin:inactivity-expiration',
    defaultMessage: 'Inactivity expiration',
  },
  inactivityExpirationDescription: {
    id: 'ap.ids-admin:inactivity-expiration-description',
    defaultMessage:
      'When enabled, refresh tokens will expire after a specified inactivity lifetime. This can be used to end inactive sessions while allowing longer active sessions.',
  },
  inactivityLifetime: {
    id: 'ap.ids-admin:inactivity-lifetime',
    defaultMessage: 'Inactivity lifetime (seconds)',
  },
  inactivityLifetimeDescription: {
    id: 'ap.ids-admin:inactivity-lifetime-description',
    defaultMessage:
      'Sets the inactivity lifetime of a refresh token (in seconds).',
  },
  saveSettings: {
    id: 'ap.ids-admin:save-settings',
    defaultMessage: 'Save settings',
  },
  saveForAllEnvironments: {
    id: 'ap.ids-admin:save-for-all-environments',
    defaultMessage: 'Save in all environments',
  },
  clientSecret: {
    id: 'ap.ids-admin:client-secret',
    defaultMessage: 'Client Secret',
  },
  clientSecretLegacy: {
    id: 'ap.ids-admin:client-secret-legacy',
    defaultMessage: 'Client Secret (Legacy)',
  },
  clientSecretDescription: {
    id: 'ap.ids-admin:client-secret-description',
    defaultMessage: 'The client secret is not base64 encoded.',
  },
  clientSecretDescriptionLegacy: {
    id: 'ap.ids-admin:client-secret-description-legacy',
    defaultMessage: 'This is a legacy secret which cannot be viewed.',
  },
  otherEndpoints: {
    id: 'ap.ids-admin:other-endpoints',
    defaultMessage: 'Other endpoints',
  },
  otherEndpointsDescription: {
    id: 'ap.ids-admin:other-endpoints-description',
    defaultMessage:
      'Some frameworks infer these using the Issuer above and its OpenID configuration. For other frameworks you may need to manually copy these.',
  },
  idsUrl: {
    id: 'ap.ids-admin:ids-url',
    defaultMessage: 'Issuer',
  },
  callbackUrl: {
    id: 'ap.ids-admin:callback-url',
    defaultMessage: 'Callback URL',
  },
  callBackUrlPlaceholder: {
    id: 'ap.ids-admin:callback-url-placeholder',
    defaultMessage: 'List callback URLs',
  },
  callBackUrlDescription: {
    id: 'ap.ids-admin:callback-url-description',
    defaultMessage:
      'After the user authenticates we will only call back to one of these URLs, which should receive and handle the authentication. You can specify multiple valid URLs in different lines. The URLs should include the protocol, i.e. "https://" for websites. You can use the star symbol as a wildcard for subdomains (*.island.is) on development and staging.',
  },
  logoutUrl: {
    id: 'ap.ids-admin:logout-url',
    defaultMessage: 'Logout URL',
  },
  logoutUrlPlaceholder: {
    id: 'ap.ids-admin:logout-url-placeholder',
    defaultMessage: 'List logout URLs',
  },
  logoutUrlDescription: {
    id: 'ap.ids-admin:logout-url-description',
    defaultMessage:
      'A set of URLs that are valid to redirect to after logging out. Specify one of these using the "post_logout_redirect_uri" query parameter and the user will be redirected to it. you can specify multiple URLs in different lines.',
  },
  cors: {
    id: 'ap.ids-admin:cors',
    defaultMessage: 'CORS',
  },
  corsPlaceholder: {
    id: 'ap.ids-admin:cors-placeholder',
    defaultMessage: 'List CORS urls, comma seperated',
  },
  corsDescription: {
    id: 'ap.ids-admin:cors-description',
    defaultMessage:
      'List additional origins allowed to make cross-origin resource sharing (CORS) requests. Allowed callback URLs are already included in this list. URLs can be comma-separated or added line-by-line Use wildcards (*) at the subdomain level (e.g. https://*.contoso.com) Query strings and hash information are ignored Organization URL placeholders are supported',
  },
  translations: {
    id: 'ap.ids-admin:translations',
    defaultMessage: 'Content',
  },
  environment: {
    id: 'ap.ids-admin:environment',
    defaultMessage: 'Environment',
  },
  basicInfo: {
    id: 'ap.ids-admin:basic-info',
    defaultMessage: 'Basic information',
  },
  clientUris: {
    id: 'ap.ids-admin:clients-urls',
    defaultMessage: 'Application URLs',
  },
  lifetime: {
    id: 'ap.ids-admin:life-time',
    defaultMessage: 'Refresh token lifecycle',
  },
  lifeTimeDescription: {
    id: 'ap.ids-admin:life-time-description',
    defaultMessage:
      'Refresh tokens are useful if you use access tokens to authorise API calls. Access tokens only last 5 minutes but you can use refresh tokens to request new access tokens. Here you can configure how long refresh tokens can be used to request new access tokens.',
  },
  oAuthAuthorizationUrl: {
    id: 'ap.ids-admin:oAuthAuthorizationUrl',
    defaultMessage: 'Authorization Endpoint',
  },
  oAuthTokenUrl: {
    id: 'ap.ids-admin:oAuthTokenUrl',
    defaultMessage: 'Token Endpoint',
  },
  oAuthUserInfoUrl: {
    id: 'ap.ids-admin:oAuthUserInfoUrl',
    defaultMessage: 'User Info Endpoint',
  },
  endSessionUrl: {
    id: 'ap.ids-admin:deviceAuthorizationUrl',
    defaultMessage: 'End Session Endpoint',
  },
  openIdConfiguration: {
    id: 'ap.ids-admin:openIdConfiguration',
    defaultMessage: 'OpenID Configuration',
  },
  jsonWebKeySet: {
    id: 'ap.ids-admin:jsonWebKeySet',
    defaultMessage: 'JSON Web Key Set',
  },
  errorInvalidUrls: {
    id: 'ap.ids-admin:error-invalid-urls',
    defaultMessage: 'List of URLs, comma separated',
  },
  errorPositiveNumber: {
    id: 'ap.ids-admin:error-positive-number',
    defaultMessage: 'Must be a positive number',
  },
  delegations: {
    id: 'ap.ids-admin:delegations',
    defaultMessage: 'Delegations',
  },
  delegationsDescription: {
    id: 'ap.ids-admin:delegations-description',
    defaultMessage:
      'Configure which delegations the user can choose when authenticating to the application.',
  },
  supportCustomDelegation: {
    id: 'ap.ids-admin:support-custom-delegation',
    defaultMessage: 'Support custom delegations',
  },
  supportCustomDelegationDescription: {
    id: 'ap.ids-admin:support-custom-delegation-description',
    defaultMessage:
      'Allow users to sign into this application with custom delegations which were manually granted to them on Mínar síður Ísland.is.\n' +
      'The application must request permissions which support custom delegations. The user must have a valid custom delegation with one of these permissions.\n',
  },
  supportLegalGuardianDelegation: {
    id: 'ap.ids-admin:support-legal-guardian-delegation',
    defaultMessage: 'Support legal guardian delegations',
  },
  supportLegalGuardianDelegationDescription: {
    id: 'ap.ids-admin:support-legal-guardian-delegation-description',
    defaultMessage:
      'Allow users to sign into this application as children which they are legal guardians of according to the Registers Iceland.',
  },
  supportPersonalRepresentativeDelegation: {
    id: 'ap.ids-admin:support-personal-representative-delegation',
    defaultMessage: 'Support personal representative delegations',
  },
  supportPersonalRepresentativeDelegationDescription: {
    id: 'ap.ids-admin:support-personal-representative-delegation-description',
    defaultMessage:
      'Allow users to sign into this application on behalf of disabled individuals with an active personal representation contract at the Ministry of Social Affairs and Labour.',
  },
  supportProcuringHolderDelegation: {
    id: 'ap.ids-admin:support-procuring-holder-delegation',
    defaultMessage: 'Support procuring holder delegations',
  },
  supportProcuringHolderDelegationDescription: {
    id: 'ap.ids-admin:support-procuring-holder-delegation-description',
    defaultMessage:
      'Allow users to sign into this application as legal entities which they are procuring holders of according to the company registry of Iceland.',
  },
  alwaysPromptDelegations: {
    id: 'ap.ids-admin:always-prompt-delegations',
    defaultMessage: 'Always prompt delegations',
  },
  alwaysPromptDelegationsDescription: {
    id: 'ap.ids-admin:always-prompt-delegations-description',
    defaultMessage:
      'With this setting, the user always sees the delegation screen when authenticating with your application. For most applications we recommend keeping this off and to provide an explicit action to authenticate with delegation using the prompt=select_account argument.',
  },
  requirePermissions: {
    id: 'ap.ids-admin:require-permissions',
    defaultMessage: 'Require permissions',
  },
  requirePermissionsDescription: {
    id: 'ap.ids-admin:require-permissions-description',
    defaultMessage:
      'Only allow delegations which have access to one or more requested permissions. Can be combined with permission settings to block access to the application for certain individuals or delegations.',
  },
  requirePkce: {
    id: 'ap.ids-admin:require-pkce',
    defaultMessage: 'Require PKCE',
  },
  requirePkceDescription: {
    id: 'ap.ids-admin:require-pkce-description',
    defaultMessage:
      'Proof Key for Code Exchange (PKCE) is a security extension for the Authorization Code Flow. PKCE is heavily recommended but some frameworks do not support it.',
  },
  allowOfflineAccess: {
    id: 'ap.ids-admin:allow-offline-access',
    defaultMessage: 'Allow offline access',
  },
  allowOfflineAccessDescription: {
    id: 'ap.ids-admin:allow-offline-access-description',
    defaultMessage:
      'Allows the application to request the offline_access scope. This results in refresh tokens which can used to get access tokens according to the refresh token lifecycle settings',
  },
  supportsTokenExchange: {
    id: 'ap.ids-admin:supports-token-exchange',
    defaultMessage: 'Supports token exchange grant',
  },
  supportsTokenExchangeDescription: {
    id: 'ap.ids-admin:supports-token-exchange-description',
    defaultMessage:
      'Allows the application to exchange an existing access token with a new access token with specified scope.',
  },
  accessTokenExpiration: {
    id: 'ap.ids-admin:access-token-expiration',
    defaultMessage: 'Access token expiration (seconds)',
  },
  accessTokenExpirationDescription: {
    id: 'ap.ids-admin:access-token-expiration-description',
    defaultMessage: 'Sets the lifetime of access tokens (in seconds).',
  },
  customClaims: {
    id: 'ap.ids-admin:custom-claims',
    defaultMessage: 'Custom claims',
  },
  requireConsent: {
    id: 'ap.ids-admin:require-consent',
    defaultMessage: 'Require consent',
  },
  requireConsentDescription: {
    id: 'ap.ids-admin:require-consent-description',
    defaultMessage:
      'When true, the application requires user consent for third party permissions as well as standard scopes like email and phone.',
  },
  customClaimsDescription: {
    id: 'ap.ids-admin:custom-claims-description',
    defaultMessage:
      'Configure custom claims (hard-coded) in access tokens created for this application. Each line should have the form claimName=value. Claim names are automatically prefixed with "client_" to avoid collisions. Claim values are always stored as strings.',
  },
  errorInvalidClaims: {
    id: 'ap.ids-admin:error-invalid-claims',
    defaultMessage: 'Invalid claim format',
  },
  hidePassword: {
    id: 'ap.ids-admin:hide-password',
    defaultMessage: 'Hide password',
  },
  showPassword: {
    id: 'ap.ids-admin:show-password',
    defaultMessage: 'Show password',
  },
  copy: {
    id: 'ap.ids-admin:copy',
    defaultMessage: 'Copy value',
  },
  copySuccess: {
    id: 'ap.ids-admin:copy-success',
    defaultMessage: 'Copied to clipboard',
  },
  permissions: {
    id: 'ap.ids-admin:permissions',
    defaultMessage: 'Permissions',
  },
  permissionsDescription: {
    id: 'ap.ids-admin:permissions-description',
    defaultMessage:
      'List of permissions (scopes) the application can request during authentication. Applications can always request standard scopes like oidc, profile, email, phone and address.{br}{br}Here you can add permissions from the current tenant. For third party permissions, the owner must grant access to your application.',
  },
  permissionsAdd: {
    id: 'ap.ids-admin:permissions-add',
    defaultMessage: 'Add permissions',
  },
  permissionsTableLabelName: {
    id: 'ap.ids-admin:permissions-table-label-name',
    defaultMessage: 'Name',
  },
  permissionsTableLabelDescription: {
    id: 'ap.ids-admin:permissions-table-label-description',
    defaultMessage: 'Description',
  },
  permissionsTableLabelAPI: {
    id: 'ap.ids-admin:permissions-table-label-api',
    defaultMessage: 'API',
  },
  permissionsButtonLabelRemove: {
    id: 'ap.ids-admin:permissions-button-label-remove',
    defaultMessage: 'Remove',
  },
  permissionsModalTitle: {
    id: 'ap.ids-admin:permissions-modal-title',
    defaultMessage: 'Add permissions',
  },
  permissionsModalDescription: {
    id: 'ap.ids-admin:permissions-modal-description',
    defaultMessage:
      'Here you can add permissions from your own tenant. Permissions from other tenants can be granted to the application from the other tenant.',
  },
  successfullySaved: {
    id: 'ap.ids-admin:successfully-saved',
    defaultMessage: 'Successfully saved',
  },
  globalErrorMessage: {
    id: 'ap.ids-admin:global-error-message',
    defaultMessage: 'An error occurred',
  },
  syncSettings: {
    id: 'ap.ids-admin:sync-settings',
    defaultMessage: 'Sync settings (from this environment)',
  },
  syncedAcrossAllEnvironments: {
    id: 'ap.ids-admin:synced-across-all-environments',
    defaultMessage: 'Settings are the same in all environments.',
  },
  notInSyncAcrossAllEnvironments: {
    id: 'ap.ids-admin:not-in-sync-across-all-environments',
    defaultMessage: 'Settings are different in some environments',
  },
  synced: {
    id: 'ap.ids-admin:synced',
    defaultMessage: 'Synced',
  },
  outOfSync: {
    id: 'ap.ids-admin:out-of-sync',
    defaultMessage: 'Out of sync',
  },
  syncStatus: {
    id: 'ap.ids-admin:sync-status',
    defaultMessage: 'Sync status',
  },
  publishEnvironment: {
    id: 'ap.ids-admin:publish-environment',
    defaultMessage: 'Publish to {environment}',
  },
  publishEnvironmentDescription: {
    id: 'ap.ids-admin:publish-environment-description',
    defaultMessage:
      'The application will inherit settings from the selected environment excluding URLs and client secrets.',
  },
  chooseEnvironmentToCopyFrom: {
    id: 'ap.ids-admin:choose-environment-to-copy-from',
    defaultMessage: 'Choose environment to copy settings from',
  },
  publish: {
    id: 'ap.ids-admin:publish',
    defaultMessage: 'Publish',
  },
  errorPublishingEnvironment: {
    id: 'ap.ids-admin:error-publishing-environment',
    defaultMessage: 'Error publishing environment',
  },
  closeModal: {
    id: 'ap.ids-admin:close-modal',
    defaultMessage: 'Close dialog',
  },
  listOfPermissions: {
    id: 'ap.ids-admin:list-of-permissions',
    defaultMessage: 'List of permissions',
  },
  permissionsManagement: {
    id: 'ap.ids-admin:permissions-management',
    defaultMessage: 'Management',
  },
  createPermission: {
    id: 'ap.ids-admin:create-permission',
    defaultMessage: 'Create permission',
  },
  permissionId: {
    id: 'ap.ids-admin:permission-id',
    defaultMessage: 'Permission ID',
  },
  permissionDescription: {
    id: 'ap.ids-admin:permission-description',
    defaultMessage: 'Description',
  },
  permissionDescriptionInfo: {
    id: 'ap.ids-admin:permission-description-info',
    defaultMessage: 'Users see this when they sign in, and manage consents.',
  },
  permissionDisplayNameInfo: {
    id: 'ap.ids-admin:permission-display-name-info',
    defaultMessage: 'Displayed on the login screen of your app',
  },
  permissionEmptyHeading: {
    id: 'ap.ids-admin:permission-empty-heading',
    defaultMessage: 'No permission created',
  },
  permissionEmptyDescription: {
    id: 'ap.ids-admin:permission-empty-description',
    defaultMessage:
      'You can create an permission by clicking on Create permission.',
  },
  permissionListDescription: {
    id: 'ap.ids-admin:permission-list-description',
    defaultMessage: 'Here you can view and create permissions.',
  },
  permissionsSearchPlaceholder: {
    id: 'ap.ids-admin:permissions-search-placeholder',
    defaultMessage: 'Search by name or ID',
  },
  dangerZone: {
    id: 'ap.ids-admin:danger-zone',
    defaultMessage: 'Danger zone',
  },
  rotateSecret: {
    id: 'ap.ids-admin:rotate-secret',
    defaultMessage: 'Rotate secret',
  },
  rotateSecretActionCardLabel: {
    id: 'ap.ids-admin:rotate-secret-action-card-label',
    defaultMessage:
      'All authorized apps will need to be updated with the new client secret.',
  },
  rotateSecretDescription: {
    id: 'ap.ids-admin:rotate-secret-description',
    defaultMessage: `This will generate a new secret for your application. You should revoke existing secret(s) after you have deployed your application with the new secret.{br}{br}If your existing secret(s) have been compromised it is recommended to revoke them immediately.`,
  },
  rotateSecretInfoAlert: {
    id: 'ap.ids-admin:rotate-secret-alert',
    defaultMessage:
      'Authentications will stop working for your application until you have deployed the new secret.',
  },
  rotate: {
    id: 'ap.ids-admin:rotate',
    defaultMessage: 'Rotate',
  },
  generate: {
    id: 'ap.ids-admin:generate',
    defaultMessage: 'Generate',
  },
  revoke: {
    id: 'ap.ids-admin:revoke',
    defaultMessage: 'Revoke',
  },
  revokeExistingSecrets: {
    id: 'ap.ids-admin:revoke-existing-secrets',
    defaultMessage: 'Revoke existing secret(s) immediately.',
  },
  newSecret: {
    id: 'ap.ids-admin:new-secret',
    defaultMessage: 'New secret',
  },
  rotatedSecretDescription: {
    id: 'ap.ids-admin:rotated-secret-description',
    defaultMessage:
      'Please update the application configuration with the following secret.',
  },
  revokeSecrets: {
    id: 'ap.ids-admin:revoke-secrets',
    defaultMessage: 'Revoke old secret(s)',
  },
  revokeSecretsDescription: {
    id: 'ap.ids-admin:revoke-secrets-description',
    defaultMessage:
      'This will revoke all secrets except the current active secret. Please make sure that they are not in use anymore.',
  },
  successRevokingSecrets: {
    id: 'ap.ids-admin:success-revoking-secrets',
    defaultMessage: 'Successfully revoked old secret(s)',
  },
  multipleSecrets: {
    id: 'ap.ids-admin:multiple-secrets',
    defaultMessage: 'Multiple secrets',
  },
  multipleSecretsDescription: {
    id: 'ap.ids-admin:multiple-secrets-description',
    defaultMessage: 'There are one or more old secrets which are still active.',
  },
  content: {
    id: 'ap.ids-admin:content',
    defaultMessage: 'Content',
  },
  icelandic: {
    id: 'ap.ids-admin:icelandic',
    defaultMessage: 'Icelandic',
  },
  english: {
    id: 'ap.ids-admin:english',
    defaultMessage: 'English',
  },
  isAccessControlled: {
    id: 'ap.ids-admin:is-access-controlled',
    defaultMessage: 'Specific national ids',
  },
  isAccessControlledDescription: {
    id: 'ap.ids-admin:is-access-controlled-description',
    defaultMessage: 'Only allow specific national ids',
  },
  grantToAuthenticatedUser: {
    id: 'ap.ids-admin:grant-to-authenticated-user',
    defaultMessage: 'Authenticated user',
  },
  grantToAuthenticatedUserDescription: {
    id: 'ap.ids-admin:grant-to-authenticated-user-description',
    defaultMessage: 'Should the authenticated user get this scope',
  },
  grantToProcuringHolders: {
    id: 'ap.ids-admin:grant-to-procuring-holders',
    defaultMessage: 'Companies',
  },
  grantToProcuringHoldersDescription: {
    id: 'ap.ids-admin:grant-to-procuring-holders-description',
    defaultMessage:
      'Should procuring holders automatically get this scope for their organisations',
  },
  grantToLegalGuardians: {
    id: 'ap.ids-admin:grant-to-legal-guardians',
    defaultMessage: 'Legal guardians',
  },
  grantToLegalGuardiansDescription: {
    id: 'ap.ids-admin:grant-to-legal-guardians-description',
    defaultMessage:
      'Should legal guardians automatically get this permission for their wards',
  },
  allowExplicitDelegationGrant: {
    id: 'ap.ids-admin:allow-explicit-delegation-grant',
    defaultMessage: 'Custom delegations',
  },
  allowExplicitDelegationGrantDescription: {
    id: 'ap.ids-admin:allow-explicit-delegation-grant-description',
    defaultMessage:
      'Should users be able to grant other users custom delegation for this permission.',
  },
  grantToPersonalRepresentatives: {
    id: 'ap.ids-admin:grant-to-personal-representatives',
    defaultMessage: 'Personal representatives',
  },
  grantToPersonalRepresentativesDescription: {
    id: 'ap.ids-admin:grant-to-personal-representatives-description',
    defaultMessage:
      'Should personal representatives automatically get this scope for their clients',
  },
})
