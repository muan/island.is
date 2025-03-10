import { GridContainer, Stack } from '@island.is/island-ui/core'
import { AdviceResult, Case, CaseExpressions } from '../../types/interfaces'
import localization from './Case.json'
import {
  BlowoutList,
  CaseDocuments,
  CaseEmailBox,
  CaseOverview,
  CaseStatusBox,
  CaseTimeline,
  Coordinator,
  RenderAdvices,
} from './components'
import CaseSkeleton from './components/CaseSkeleton/CaseSkeleton'

interface Props {
  chosenCase: Case
  expressions: CaseExpressions
  advices: Array<AdviceResult>
  advicesLoading: boolean
  refetchAdvices: any
}

const CaseMobile = ({
  chosenCase,
  expressions,
  advices,
  advicesLoading,
  refetchAdvices,
}: Props) => {
  const loc = localization['case']
  const {
    caseNumber,
    id,
    documents,
    additionalDocuments,
    statusName,
    stakeholders,
    relatedCases,
    contactEmail,
    contactName,
    shortDescription,
  } = chosenCase
  const {
    isDocumentsNotEmpty,
    isAdditionalDocumentsNotEmpty,
    isStatusNameNotPublished,
    isStatusNameForReview,
    isStakeholdersNotEmpty,
    isRelatedCasesNotEmpty,
  } = expressions
  return (
    <CaseSkeleton
      caseNumber={caseNumber}
      caseId={id}
      caseDescription={shortDescription}
    >
      <GridContainer>
        <Stack space={3}>
          <CaseTimeline chosenCase={chosenCase} />
          <CaseOverview chosenCase={chosenCase} />
          {isDocumentsNotEmpty && (
            <CaseDocuments
              title={loc.documentsBox.documents.title}
              documents={documents}
            />
          )}
          {isAdditionalDocumentsNotEmpty && (
            <CaseDocuments
              title={loc.documentsBox.additional.title}
              documents={additionalDocuments}
            />
          )}

          <CaseStatusBox status={statusName} />
          {isStakeholdersNotEmpty && (
            <BlowoutList list={stakeholders} isStakeholder />
          )}
          {isRelatedCasesNotEmpty && <BlowoutList list={relatedCases} />}
          <Coordinator contactEmail={contactEmail} contactName={contactName} />
          {isStatusNameNotPublished && (
            <CaseEmailBox caseId={id} caseNumber={caseNumber} />
          )}
          <RenderAdvices
            advicesLoading={advicesLoading}
            isStatusNameForReview={isStatusNameForReview}
            advices={advices}
            chosenCase={chosenCase}
            refetchAdvices={refetchAdvices}
          />
        </Stack>
      </GridContainer>
    </CaseSkeleton>
  )
}

export default CaseMobile
