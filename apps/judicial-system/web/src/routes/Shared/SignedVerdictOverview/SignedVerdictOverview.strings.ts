import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  nextButtonReopenText: {
    id: 'judicial.system.core:signed_verdict_overview.next_button_reopen_text',
    defaultMessage: 'Leiðrétta þingbók og úrskurð',
    description:
      'Notaður sem texti á next takka fyrir dómara og dómritara í yfirliti lokins máls.',
  },
  confirmStatementAfterDeadlineModalTitle: {
    id:
      'judicial.system.core:signed_verdict_overview.confirm_statement_after_deadline_modal_title',
    defaultMessage: 'Frestur til að skila greinargerð er liðinn',
    description:
      'Notaður sem titill í modal glugga hjá sækjanda þegar frestur til greinargerðar er liðinn.',
  },
  confirmStatementAfterDeadlineModalText: {
    id:
      'judicial.system.core:signed_verdict_overview.confirm_statement_after_deadline_modal_text',
    defaultMessage: 'Viltu halda áfram og senda greinargerð?',
    description:
      'Notaður sem texti í modal glugga hjá sækjanda þegar frestur til greinargerðar er liðinn.',
  },
  confirmStatementAfterDeadlineModalPrimaryButtonText: {
    id:
      'judicial.system.core:signed_verdict_overview.confirm_statement_after_deadline_modal_primary_button_text',
    defaultMessage: 'Já, senda greinargerð',
    description:
      'Notaður sem texti í staðfesta takka í modal glugga hjá sækjanda þegar frestur til greinargerðar er liðinn.',
  },
  confirmStatementAfterDeadlineModalSecondaryButtonText: {
    id:
      'judicial.system.core:signed_verdict_overview.confirm_statement_after_deadline_modal_secondary_button_text',
    defaultMessage: 'Hætta við',
    description:
      'Notaður sem texti í Hætta við takka í modal glugga hjá sækjanda þegar frestur til greinargerðar er liðinn.',
  },
})
