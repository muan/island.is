import React, { useEffect, useState } from 'react'

import { useDraftingState } from '../../state/useDraftingState'
import { impactMsgs } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import {
  RegName,
  RegulationOptionList,
  RegulationType,
} from '@island.is/regulations'
import { DraftImpactName } from '@island.is/regulations/admin'

import {
  AsyncSearch,
  AsyncSearchOption,
  Option,
} from '@island.is/island-ui/core'
import { RegulationOptionListQuery } from '../../utils/dataHooks'
import { formatSelRegOptions } from '../../utils/formatSelRegOptions'
import { useLazyQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { useDebounce } from 'react-use'

export type SelRegOption = Option & {
  value?: DraftImpactName | ''
  type: RegulationType | ''
  migrated?: boolean
}

type SearchItem = {
  label: string
  value: DraftImpactName | ''
  component?: AsyncSearchOption['component']
  disabled?: boolean
}

type ImpactAmendingSelectionProps = {
  setImpactRegOption: (option: SelRegOption) => void
}

// ---------------------------------------------------------------------------

export const ImpactAmendingSelection = ({
  setImpactRegOption,
}: ImpactAmendingSelectionProps) => {
  const [selRegOptions, setSelRegOptions] = useState<
    SelRegOption[] | undefined
  >()
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState('')
  const t = useLocale().formatMessage

  const [getRegulationList, { data, loading, error }] = useLazyQuery<Query>(
    RegulationOptionListQuery,
    {
      fetchPolicy: 'no-cache',
    },
  )

  const handleOptionSelect = (selected: SelRegOption) => {
    setImpactRegOption(selected)
  }

  useDebounce(
    () => {
      if (value) {
        getRegulationList({
          variables: { input: { names: [value as RegName] } },
        })
      }
      setIsLoading(false)
    },
    500,
    [value],
  )

  useEffect(() => {
    const dataRes =
      (data?.getRegulationOptionList as RegulationOptionList) || []

    const optionNames = dataRes.map((reg) => reg.name)

    const relRegOptionsArray = formatSelRegOptions(
      optionNames as RegName[],
      t(impactMsgs.regSelect_mentionedNotFound),
      t(impactMsgs.regSelect_mentionedRepealed),
      dataRes,
    )

    setSelRegOptions(relRegOptionsArray)
  }, [data])

  return (
    <AsyncSearch
      placeholder={t(impactMsgs.regSelect_placeholder)}
      onInputValueChange={(newValue) => {
        setIsLoading(newValue !== value)
        setValue(newValue ?? '')
      }}
      loading={loading || isLoading}
      onSubmit={(newValue) => {
        setIsLoading(newValue !== value)
        setValue(newValue ?? '')
      }}
      options={selRegOptions || []}
      inputValue={value}
      initialInputValue={''}
      label={t(impactMsgs.regSelect)}
      onChange={(i, option) => {
        handleOptionSelect(option.selectedItem as SelRegOption)
      }}
    />
  )
}
