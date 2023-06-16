import { Application } from '@island.is/application/types'
import { Form, FormModes } from '@island.is/application/types'
import {
  buildCheckboxField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
} from '@island.is/application/core'

import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'
import {
  getEhicResponse,
  getFullName,
  hasAPDF,
  hasPlastic,
  someAreInsuredButCannotApply,
  someAreNotInsured,
  someHavePDF,
} from '../lib/helpers/applicantHelper'
import { Option } from '@island.is/application/types'

export const NoApplicants: Form = buildForm({
  id: 'NoApplicants',
  title: '',
  mode: FormModes.COMPLETED,

  children: [
    buildMultiField({
      id: 'noApplicantsMultifield',
      title: '',
      description: '',
      children: [
        buildCheckboxField({
          id: 'havePdf',
          backgroundColor: 'white',
          title: e.noApplicants.checkboxTitle,
          description: e.noApplicants.checkboxDescription,
          condition: (_, externalData) => someHavePDF(externalData),
          options: (application: Application) => {
            const applying: Array<Option> = []
            getEhicResponse(application).forEach((x) => {
              if (
                x.isInsured &&
                !x.canApply &&
                !x.canApplyForPDF &&
                hasAPDF(x) &&
                hasPlastic(x)
              ) {
                applying.push({
                  value: x.applicantNationalId ?? '',
                  label: getFullName(application, x.applicantNationalId) ?? '',
                  disabled: true,
                })
              }
            })
            return applying
          },
        }),

        buildDescriptionField({
          id: 'break3',
          title: '',
          titleVariant: 'h3',
          marginBottom: 'gutter',
          space: 'gutter',
          condition: (_, externalData) =>
            someAreNotInsured(externalData) ||
            someAreInsuredButCannotApply(externalData),
        }),

        buildCheckboxField({
          id: 'notApplicable',
          backgroundColor: 'white',
          title: e.no.sectionTitle,
          description: e.no.sectionDescription,
          condition: (_, externalData) =>
            someAreNotInsured(externalData) ||
            someAreInsuredButCannotApply(externalData),
          options: (application: Application) => {
            const applying: Array<Option> = []
            getEhicResponse(application).forEach((x) => {
              if (
                !x.canApply &&
                !x.canApplyForPDF &&
                !hasAPDF(x) &&
                !hasPlastic(x)
              ) {
                applying.push({
                  value: x.applicantNationalId ?? '',
                  label: getFullName(application, x.applicantNationalId) ?? '',
                  disabled: true,
                })
              }
            })
            return applying
          },
        }),
      ],
    }),
  ],
})

export default NoApplicants
