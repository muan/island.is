import { defineMessages } from 'react-intl'

export const fishingLicense = {
  general: defineMessages({
    sectionTitle: {
      id: 'gfl.application:fishingLicense.general.sectionTitle',
      defaultMessage: 'Veiðileyfi',
      description: 'Fiching license section title',
    },
    title: {
      id: 'gfl.application:fishingLicense.general.name',
      defaultMessage: 'Veiðileyfi',
      description: 'Fiching license title',
    },
    description: {
      id: 'gfl.application:fishingLicense.general.description',
      defaultMessage:
        'Hér eru upplýsingar um fiskveiðiskipið sem sótt er um veiðileyfi fyrir og þar fyrir neðan er tegund veiðileyfis valin. ',
      description: 'Fiching license description',
    },
  }),
  labels: defineMessages({
    radioButtonTitle: {
      id: 'gfl.application:fishingLicense.labels.radioButtonTitle',
      defaultMessage: 'Veiðileyfi í boði',
      description: 'Fiching license radio button title',
    },
    hookCatchLimit: {
      id: 'gfl.application:fishingLicense.labels.hookCatchLimit',
      defaultMessage: 'Veiðileyfi með krókaaflamarki',
      description: 'Fiching license radio button with hook catch limit',
    },
    catchMark: {
      id: 'gfl.application:fishingLicense.labels.catchMark',
      defaultMessage: 'Veiðileyfi með aflamarki',
      description: 'Fiching license radio button with catch mark',
    },
  }),
  tooltips: defineMessages({
    hookCatchLimit: {
      id: 'gfl.application:fishingLicense.tooltips.hookCatchLimit',
      defaultMessage:
        'Einungis er heimilt að nýta handfæri og línu með krókaveiðifærum. Báturinn þarf að vera 15 brúttótonn eða minna.',
      description: 'Fiching license radio button tooltip with hook catch limit',
    },
    catchMark: {
      id: 'gfl.application:fishingLicense.tooltips.catchMark',
      defaultMessage: 'Einungis er heimilt að nýta ...',
      description: 'Fiching license radio button tooltip with catch limit',
    },
  }),
}
