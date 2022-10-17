import { DefaultStateLifeCycle } from '@island.is/application/core'
import { FeatureFlagClient } from '@island.is/feature-flags'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
} from '@island.is/application/types'
import { m } from './messages'
import { Events, States, Roles, ApiActions } from './constants'
import { dataSchema } from './utils/dataSchema'
import { Features } from '@island.is/feature-flags'
import {
  FinancialStatementInaoFeatureFlags,
  getApplicationFeatureFlags,
} from './utils/getApplicationFeatureFlags'

const FinancialStatementInaoApplication: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.FINANCIAL_STATEMENTS_INAO,
  name: m.applicationTitle,
  institution: m.institutionName,
  dataSchema,
  featureFlag: Features.financialStatementInao,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'prerequisites',
          progress: 0.2,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: async ({ featureFlagClient }) => {
                const featureFlags = await getApplicationFeatureFlags(
                  featureFlagClient as FeatureFlagClient,
                )
                const getForm = await import('../forms/prerequisites/').then(
                  (val) => {
                    return val.getForm
                  },
                )

                return getForm({
                  allowFakeData:
                    featureFlags[FinancialStatementInaoFeatureFlags.ALLOW_FAKE],
                })
              },
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DRAFT },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: 'Draft',
          actionCard: {
            title: m.applicationTitle,
          },
          onEntry: {
            apiModuleAction: ApiActions.getUserType,
            shouldPersistToExternalData: true,
          },

          progress: 0.4,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/application').then((module) =>
                  Promise.resolve(module.getApplication()),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DONE },
        },
      },
      [States.DONE]: {
        meta: {
          name: 'Done',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: ApiActions.submitApplication,
            throwOnError: true,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () => import('../forms/done').then((val) => val.done),
              read: 'all',
            },
          ],
        },
        type: 'final' as const,
      },
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (application.applicant === nationalId) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default FinancialStatementInaoApplication
