import {
  Filter,
  FilterInput,
  FilterMultiChoice,
  FilterProps,
} from '@island.is/island-ui/core'
import React from 'react'

type FilterCategory = {
  /** Id for the category. */
  id: string
  /** The category label to display on screen. */
  label: string
  /** The array of currently selected active filters. */
  selected: Array<string>
  /** Array of available filters in this category. */
  filters: Array<FilterItem>
}

type FilterItem = {
  value: string
  label: string
}

interface ApiCatalogueFilterProps {
  labelClearAll: string
  labelClear: string
  labelOpen: string
  labelClose: string
  labelResult: string
  labelTitle: string
  resultCount: number
  onFilterClear: () => void
  inputPlaceholder: string
  inputValue: string
  onInputChange: (any) => void
  labelCategoryClear: string
  onCategoryChange: (any) => void
  onCategoryClear: (any) => void
  categories: Array<FilterCategory>
}

export const ApiCatalogueFilter: React.FC<
  ApiCatalogueFilterProps & Pick<FilterProps, 'variant' | 'align'>
> = ({
  labelClearAll,
  labelClear,
  labelOpen,
  labelClose,
  labelResult,
  labelTitle,
  resultCount,
  onFilterClear,
  inputPlaceholder,
  inputValue,
  onInputChange,
  labelCategoryClear,
  onCategoryChange,
  onCategoryClear,
  categories,
  variant,
  align,
}) => {
  return (
    <Filter
      labelClearAll={labelClearAll}
      labelClear={labelClear}
      labelOpen={labelOpen}
      labelClose={labelClose}
      labelResult={labelResult}
      labelTitle={labelTitle}
      resultCount={resultCount}
      onFilterClear={onFilterClear}
      align={align}
      variant={variant}
      filterInput={
        <FilterInput
          placeholder={inputPlaceholder}
          name="filterInput"
          value={inputValue}
          onChange={onInputChange}
        />
      }
    >
      <FilterMultiChoice
        labelClear={labelCategoryClear}
        onChange={onCategoryChange}
        onClear={onCategoryClear}
        categories={categories}
      ></FilterMultiChoice>
    </Filter>
  )
}
