import { useQuery } from '@apollo/client'
import initApollo from '../../graphql/client'
import { HOME_GET_CASES } from '../../graphql/queries.graphql'

interface FetchCasesInput {
  caseStatuses: Array<number>
  caseTypes: Array<number>
  orderBy: string
  searchQuery: string
  policyAreas: Array<number>
  institutions: Array<number>
  dateFrom: Date
  dateTo: Date
  pageSize: number
  pageNumber: number
}

interface Props {
  input: FetchCasesInput
}

export const useFetchCases = ({ input }: Props) => {
  const client = initApollo()
  const { data, loading } = useQuery(HOME_GET_CASES, {
    client: client,
    ssr: false,
    fetchPolicy: 'network-only',
    variables: {
      input,
    },
  })

  const { consultationPortalGetCases: casesData = [] } = data ?? {}

  const { cases = [], filterGroups = {}, total = 0 } = casesData

  return {
    cases,
    filterGroups,
    total,
    getCasesLoading: loading,
  }
}

export default useFetchCases
