import {
  buildCustomField,
  buildDataProviderItem,
  buildDateField,
  buildExternalDataProvider,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
  FormValue,
} from '@island.is/application/types'
import {
  applicantInformationMultiField,
  buildFormConclusionSection,
} from '@island.is/application/ui-forms'

import Logo from '../assets/Logo'
import {
  complainedFor,
  complainee,
  complaintDescription,
  complaintInformation,
  dataProvider,
  information,
  section,
  attachments,
  courtAction,
  shared,
  preexistingComplaint,
  confirmation,
  complaintOverview,
} from '../lib/messages'
import {
  ComplainedForTypes,
  ComplaineeTypes,
  YES,
  NO,
  OmbudsmanComplaintTypeEnum,
  UPLOAD_ACCEPT,
} from '../shared/constants'
import {
  getComplaintType,
  isDecisionDateOlderThanYear,
  isGovernmentComplainee,
} from '../utils'
import { NationalRegistryUserApi, UserProfileApi } from '../dataProviders'

export const ComplaintsToAlthingiOmbudsmanApplication: Form = buildForm({
  id: 'ComplaintsToAlthingiOmbudsmanDraftForm',
  title: 'Kvörtun til umboðsmanns Alþingis',
  mode: FormModes.DRAFT,
  logo: Logo,
  children: [
    buildSection({
      id: 'conditions',
      title: section.dataCollection,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: dataProvider.dataProviderHeader,
          subTitle: dataProvider.dataProviderSubTitle,
          checkboxLabel: dataProvider.dataProviderCheckboxLabel,
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: dataProvider.nationalRegistryTitle,
              subTitle: dataProvider.nationalRegistrySubTitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: dataProvider.userProfileTitle,
              subTitle: dataProvider.userProfileSubTitle,
            }),
            buildDataProviderItem({
              title: dataProvider.notificationTitle,
              subTitle: dataProvider.notificationSubTitle,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'information',
      title: section.information,
      children: [applicantInformationMultiField()],
    }),
    buildSection({
      id: 'section.complainedFor',
      title: section.complainedFor,
      children: [
        buildMultiField({
          id: 'complainedFor',
          title: complainedFor.decision.title,
          description: complainedFor.decision.description,
          children: [
            buildRadioField({
              id: 'complainedFor.decision',
              title: '',
              options: [
                {
                  value: ComplainedForTypes.MYSELF,
                  label: complainedFor.decision.myselfLabel,
                },
                {
                  value: ComplainedForTypes.SOMEONEELSE,
                  label: complainedFor.decision.someoneelseLabel,
                },
              ],
              largeButtons: true,
              width: 'half',
            }),
          ],
        }),
        buildMultiField({
          id: 'complainedForInformation',
          title: complainedFor.information.title,
          condition: (formValue: FormValue) => {
            const radio = (formValue.complainedFor as FormValue)?.decision
            return radio === ComplainedForTypes.SOMEONEELSE
          },
          children: [
            buildTextField({
              id: 'complainedForInformation.name',
              title: information.aboutTheComplainer.name,
              backgroundColor: 'blue',
              required: true,
            }),
            buildTextField({
              id: 'complainedForInformation.ssn',
              title: information.aboutTheComplainer.ssn,
              format: '######-####',
              backgroundColor: 'blue',
              required: true,
              width: 'half',
            }),
            buildTextField({
              id: 'complainedForInformation.address',
              title: information.aboutTheComplainer.address,
              backgroundColor: 'blue',
              required: true,
              width: 'half',
            }),
            buildTextField({
              id: 'complainedForInformation.postcode',
              title: information.aboutTheComplainer.postcode,
              backgroundColor: 'blue',
              required: true,
              width: 'half',
            }),
            buildTextField({
              id: 'complainedForInformation.city',
              title: information.aboutTheComplainer.city,
              backgroundColor: 'blue',
              required: true,
              width: 'half',
            }),
            buildTextField({
              id: 'complainedForInformation.email',
              title: information.aboutTheComplainer.email,
              backgroundColor: 'blue',
              required: true,
              width: 'half',
              variant: 'email',
            }),
            buildTextField({
              id: 'complainedForInformation.phone',
              title: information.aboutTheComplainer.phone,
              format: '###-####',
              backgroundColor: 'blue',
              required: true,
              width: 'half',
              variant: 'tel',
            }),
            buildCustomField(
              {
                id: 'complainedForInformation.titleField',
                title: complainedFor.information.fieldTitle,
                component: 'FieldTitle',
                doesNotRequireAnswer: true,
              },
              {
                marginTop: 7,
                marginBottom: 3,
              },
            ),
            buildTextField({
              id: 'complainedForInformation.connection',
              title: complainedFor.information.textareaTitle,
              placeholder: complainedFor.information.textareaPlaceholder,
              backgroundColor: 'blue',
              required: true,
              variant: 'textarea',
              rows: 6,
            }),
            buildCustomField(
              {
                id: 'complainedForInformation.uploadTitleField',
                title: complainedFor.labels.powerOfAttorney,
                component: 'FieldTitle',
                doesNotRequireAnswer: true,
              },
              {
                marginTop: 7,
                marginBottom: 3,
              },
            ),
            buildFileUploadField({
              id: 'complainedForInformation.powerOfAttorney',
              title: '',
              introduction: '',
              uploadAccept: UPLOAD_ACCEPT,
              uploadHeader: attachments.uploadHeader,
              uploadDescription: attachments.uploadDescription,
              uploadButtonLabel: attachments.uploadButtonLabel,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'complaint',
      title: section.complaint,
      children: [
        buildSubSection({
          id: 'complaint.section.complainee',
          title: section.complainee,
          children: [
            buildMultiField({
              id: 'complainee',
              title: complainee.general.sectionTitle,
              description: complainee.general.sectionDescription,
              children: [
                buildRadioField({
                  id: 'complainee.type',
                  title: '',
                  largeButtons: true,
                  options: [
                    {
                      value: ComplaineeTypes.GOVERNMENT,
                      label: complainee.labels.governmentComplaint,
                    },
                    {
                      value: ComplaineeTypes.OTHER,
                      label: complainee.labels.otherComplaint,
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'complaint.section.complaintInformation',
          title: section.complaintInformation,
          children: [
            buildMultiField({
              id: 'section.complaintInformation',
              title: complaintInformation.title,
              children: [
                buildRadioField({
                  id: 'complaintType',
                  title: '',
                  options: [
                    {
                      label: complaintInformation.decisionLabel,
                      value: OmbudsmanComplaintTypeEnum.DECISION,
                    },
                    {
                      label: complaintInformation.proceedingsLabel,
                      value: OmbudsmanComplaintTypeEnum.PROCEEDINGS,
                    },
                  ],
                }),
                buildCustomField({
                  id: 'complaintInformation.decisionAlertMessage',
                  title: complaintInformation.alertMessageTitle,
                  component: 'FieldAlertMessage',
                  description: complaintInformation.decisionAlertMessage,
                  doesNotRequireAnswer: true,
                  condition: (answers: FormValue) =>
                    getComplaintType(answers) ===
                    OmbudsmanComplaintTypeEnum.DECISION,
                }),
                buildCustomField({
                  id: 'complaintInformation.proceedingsAlertMessage',
                  title: complaintInformation.alertMessageTitle,
                  component: 'FieldAlertMessage',
                  description: complaintInformation.proceedingsAlertMessage,
                  doesNotRequireAnswer: true,
                  condition: (answers: FormValue) =>
                    getComplaintType(answers) ===
                    OmbudsmanComplaintTypeEnum.PROCEEDINGS,
                }),
              ],
            }),
            buildMultiField({
              id: 'complaintDescription',
              title: complaintDescription.general.pageTitle,
              description: (application: Application) =>
                getComplaintType(application.answers) ===
                OmbudsmanComplaintTypeEnum.DECISION
                  ? complaintDescription.general.decisionInfo
                  : '',
              children: [
                buildTextField({
                  id: 'complaintDescription.complaineeName',
                  backgroundColor: 'blue',
                  required: true,
                  title: (application: Application) =>
                    isGovernmentComplainee(application.answers)
                      ? complainee.labels.complaineeNameGovernmentTitle
                      : complainee.labels.complaineeNameOtherTitle,
                  placeholder: (application: Application) =>
                    isGovernmentComplainee(application.answers)
                      ? complainee.labels.complaineeNameGovernmentPlaceholder
                      : complainee.labels.complaineeNameOtherPlaceholder,
                }),

                buildTextField({
                  id: 'complaintDescription.complaintDescription',
                  title: complaintDescription.labels.complaintDescriptionTitle,
                  rows: 6,
                  placeholder:
                    complaintDescription.labels.complaintDescriptionPlaceholder,
                  backgroundColor: 'blue',
                  variant: 'textarea',
                  required: true,
                }),
                buildDateField({
                  id: 'complaintDescription.decisionDate',
                  title: complaintDescription.labels.decisionDateTitle,
                  placeholder:
                    complaintDescription.labels.decisionDatePlaceholder,
                  backgroundColor: 'blue',
                  width: 'half',
                  condition: (answers: FormValue) =>
                    getComplaintType(answers) ===
                    OmbudsmanComplaintTypeEnum.DECISION,
                }),
                buildCustomField(
                  {
                    id: 'complaintDescriptionAlert',
                    title: complaintDescription.general.alertTitle,
                    component: 'FieldAlertMessage',
                    description: complaintDescription.general.alertMessage,
                    condition: (answers: FormValue) =>
                      isDecisionDateOlderThanYear(answers),
                  },
                  { spaceTop: 2 },
                ),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'complaint.section.appeals',
          title: complaintInformation.appealsSectionTitle,
          children: [
            buildRadioField({
              id: 'appeals',
              title: complaintInformation.appealsHeader,
              width: 'half',
              options: [
                { label: shared.general.yes, value: YES },
                { label: shared.general.no, value: NO },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'courtAction',
      title: preexistingComplaint.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'preexistingComplaint.multifield',
          title: preexistingComplaint.general.title,
          description: preexistingComplaint.general.description,
          children: [
            buildRadioField({
              id: 'preexistingComplaint',
              title: '',
              width: 'half',
              options: [
                { value: YES, label: shared.general.yes },
                { value: NO, label: shared.general.no },
              ],
            }),
            buildCustomField({
              id: 'preexistingComplaint.preexistingComplaintAlertMessage',
              title: preexistingComplaint.alertMessage.title,
              component: 'FieldAlertMessage',
              description: preexistingComplaint.alertMessage.description,
              doesNotRequireAnswer: true,
              condition: (answers: FormValue) =>
                answers.preexistingComplaint === YES,
            }),
          ],
        }),
        buildMultiField({
          id: 'courtAction.question',
          title: courtAction.title,
          children: [
            buildRadioField({
              id: 'courtActionAnswer',
              title: '',
              width: 'half',
              options: [
                { value: YES, label: shared.general.yes },
                { value: NO, label: shared.general.no },
              ],
            }),
            buildCustomField({
              id: 'courtAction.alert',
              title: courtAction.alertTitle,
              description: courtAction.alertText,
              component: 'FieldAlertMessage',
              doesNotRequireAnswer: true,
              condition: (answers: FormValue) =>
                answers.courtActionAnswer === YES,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'attachments',
      title: section.attachments,
      children: [
        buildFileUploadField({
          id: 'attachments.documents',
          title: attachments.title,
          introduction: attachments.introduction,
          uploadHeader: attachments.uploadHeader,
          uploadDescription: attachments.uploadDescription,
          uploadButtonLabel: attachments.uploadButtonLabel,
        }),
      ],
    }),
    buildSection({
      id: 'section.overview',
      title: section.complaintOverview,
      children: [
        buildMultiField({
          id: 'overview.multifield',
          title: complaintOverview.general.title,
          children: [
            buildCustomField(
              {
                id: 'overview',
                title: complaintOverview.general.title,
                component: 'ComplaintOverview',
                doesNotRequireAnswer: true,
              },
              { isEditable: true },
            ),
            buildSubmitField({
              id: 'overview.submit',
              title: '',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: complaintOverview.labels.submit,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildFormConclusionSection({
      alertTitle: confirmation.general.alertTitle,
      expandableHeader: confirmation.information.title,
      expandableIntro: confirmation.information.intro,
      expandableDescription: confirmation.information.bulletList,
    }),
  ],
})
