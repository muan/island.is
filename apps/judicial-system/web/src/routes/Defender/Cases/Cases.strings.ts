import { defineMessages } from 'react-intl'

export const defenderCases = defineMessages({
  casesTitle: {
    id: 'judicial.system.core:defender_cases.title',
    defaultMessage: 'Málin þín',
    description: 'Notaður sem titill á yfirlitssíðu verjanda.',
  },
  casesSubtitle: {
    id: 'judicial.system.core:defender_cases.subtitle',
    defaultMessage:
      'Hér er yfirlit yfir mál sem þú átt aðild að í umboði skjólstæðinga.',
    description: 'Notaður sem undirtitill á yfirlitssíðu verjanda.',
  },
  activeCasesTabLabel: {
    id: 'judicial.system.core:defender_cases.active_cases_tab_label',
    defaultMessage: 'Mál í vinnslu',
    description: 'Notaður sem titill á flipa sem sýnir mál í vinnslu',
  },
  completedCasesTabLabel: {
    id: 'judicial.system.core:defender_cases.completed_cases_tab_label',
    defaultMessage: 'Afgreidd mál',
    description: 'Notaður sem titill á flipa sem sýnir afgreidd mál',
  },
})
