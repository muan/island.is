import { Box, Tag } from '@island.is/island-ui/core'
import { CheckboxFormField } from '@island.is/application/ui-fields'
import { selectChildren } from '../../lib/messages'
import {
  ApplicantChildCustodyInformation,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { useLocale } from '@island.is/localization'

//limit to max MAX_CNT_APPLICANTS-1 children
export const SelectChildren = ({ field, application, error }: any) => {
  const { formatMessage } = useLocale()

  const {
    externalData: { childrenCustodyInformation },
    answers,
  } = application
  const children = childrenCustodyInformation.data as ApplicantChildCustodyInformation[]
  const childrenCheckboxes = children.map(
    (child: ApplicantChildCustodyInformation) => {
      const showForeignDomicileTag = !child.domicileInIceland
      const isCheckable =
        child.domicileInIceland && child.citizenship?.code !== 'IS'

      return {
        value: child.nationalId,
        label: child.fullName,
        subLabel: child.otherParent
          ? `${selectChildren.checkboxes.subLabel.defaultMessage} ${child.otherParent?.fullName}` //TODO ekki nota defaultMessage, þá þýðist ekki
          : '',
        rightContent: (
          <div style={{ display: 'flex' }}>
            {showForeignDomicileTag && (
              <div style={{ paddingRight: 15 }}>
                <Tag disabled variant="red">
                  {selectChildren.checkboxes.tagLegalDomicileNotIceland}
                </Tag>
              </div>
            )}
            <Tag
              outlined={child.citizenship?.code === 'IS' ? false : true}
              disabled
              variant={child.citizenship?.code === 'IS' ? 'red' : 'blue'}
            >
              {formatMessage(selectChildren.checkboxes.tagCitizenship, {
                citizenship: child.citizenship?.name,
              })}
            </Tag>
          </div>
        ),
        disabled: !isCheckable,
      }
    },
  )

  return (
    <Box>
      <Box>
        <CheckboxFormField
          application={application}
          field={{
            id: field.id,
            title: 'Children',
            large: true,
            backgroundColor: 'blue',
            width: 'full',
            type: FieldTypes.CHECKBOX,
            component: FieldComponents.CHECKBOX,
            children: undefined,
            options: childrenCheckboxes,
            onSelect: (newAnswer) => {
              return { ...answers, selectedChildren: newAnswer }
            },
          }}
        />
      </Box>
    </Box>
  )
}
