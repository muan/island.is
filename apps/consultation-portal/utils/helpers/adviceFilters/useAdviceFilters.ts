import { useState } from 'react'
import { AdviceFilter } from '../../../types/interfaces'
import getDefaultFilters from './getDefaultFilters'
import { useFetchAdvices } from '../useFetchAdvices'
import { CARDS_PER_PAGE } from '../../consts/consts'

interface Props {
  isAuthenticated: boolean
}

export const useAdviceFilters = ({ isAuthenticated }: Props) => {
  const initialValues = {
    searchQuery: '',
    oldestFirst: false,
    pageSize: CARDS_PER_PAGE,
    pageNumber: 0,
  } as AdviceFilter

  const defaultValues = getDefaultFilters(initialValues)

  const [filters, setFilters] = useState<AdviceFilter>({
    ...defaultValues,
  })

  const { advices, total, getAdvicesLoading } = useFetchAdvices({
    input: filters,
    isAuthenticated: isAuthenticated,
  })

  return {
    advices,
    total,
    getAdvicesLoading,
    filters,
    setFilters,
    initialValues,
  }
}

export default useAdviceFilters
