import { CSSProperties, FC, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_REAL_ESTATE_AGENTS_QUERY } from './queries'
import { ConnectedComponent, Query } from '@island.is/api/schema'
import { useLocalization } from '../../utils'
import { sortAlpha } from '@island.is/shared/utils'

import {
  Box,
  LoadingDots,
  Pagination,
  Table as T,
  Text,
  Input,
  AlertMessage,
} from '@island.is/island-ui/core'

import * as styles from './RealEstateAgentsList.css'

const DEFAULT_PAGE_SIZE = 10
const DEFAULT_TABLE_MIN_HEIGHT = '800px'

interface RealEstateAgentsListProps {
  slice: ConnectedComponent
}

type ListState = 'loading' | 'loaded' | 'error'

const RealEstateAgentsList: FC<React.PropsWithChildren<RealEstateAgentsListProps>> = ({ slice }) => {
  const t = useLocalization(slice.json)

  const [listState, setListState] = useState<ListState>('loading')
  const [agents, setAgents] = useState<Query['getRealEstateAgents']>([])
  const [currentPageNumber, setCurrentPageNumber] = useState(1)

  const [searchTerms, _setSearchTerms] = useState([] as string[])
  const setSearchString = (searchString: string) =>
    _setSearchTerms(
      searchString
        // In some operating systems, when the user is typing a diacritic letter (e.g. á, é, í) that requires two key presses,
        // the diacritic mark is added to the search string on the first key press and is then replaced with the diacritic letter
        // on the second key press. For the intermediate state, we remove the diacritic mark so that it does
        // not affect the search results.
        .replace('´', '')

        // Normalize the search string
        .trim()
        .toLowerCase()

        // Split the search string into terms.
        .split(' '),
    )

  const onSearch = (searchString: string) => {
    setCurrentPageNumber(1)
    setSearchString(searchString)
  }

  useQuery<Query>(GET_REAL_ESTATE_AGENTS_QUERY, {
    onCompleted: (data) => {
      const fetchedAgents = [...(data?.getRealEstateAgents ?? [])]
      setAgents(fetchedAgents.sort(sortAlpha('name')))
      setListState('loaded')
    },
    onError: () => {
      setListState('error')
    },
  })

  const filteredAgents = agents.filter((agent) => {
    return searchTerms.every(
      (searchTerm) =>
        agent.name?.trim().toLowerCase().includes(searchTerm) ||
        agent.location?.trim().toLowerCase().includes(searchTerm),
    )
  })

  const pageSize = slice?.configJson?.pageSize ?? DEFAULT_PAGE_SIZE

  const totalPages = Math.ceil(filteredAgents.length / pageSize)

  const minHeightFromConfig = slice?.configJson?.minHeight
  const tableContainerStyles: CSSProperties = {}
  if (totalPages > 1) {
    /**
     * Force a minimum height of the table, so that the pagination elements stay in the same
     * location. E.g. when the last page has fewer items, then this will prevent the
     * pagination elements from moving.
     */
    tableContainerStyles.minHeight =
      minHeightFromConfig ?? DEFAULT_TABLE_MIN_HEIGHT
  }

  return (
    <Box>
      {listState === 'loading' && (
        <Box
          display="flex"
          marginTop={4}
          marginBottom={20}
          justifyContent="center"
        >
          <LoadingDots />
        </Box>
      )}
      {listState === 'error' && (
        <AlertMessage
          title={t('errorTitle', 'Villa')}
          message={t(
            'errorMessage',
            'Ekki tókst að sækja lista yfir fasteignasala.',
          )}
          type="error"
        />
      )}
      {listState === 'loaded' && (
        <Box marginBottom={4}>
          <Input
            name="realEstateAgentsSearchInput"
            placeholder={t('searchPlaceholder', 'Leita')}
            backgroundColor={['blue', 'blue', 'white']}
            size="sm"
            icon={{
              name: 'search',
              type: 'outline',
            }}
            onChange={(event) => onSearch(event.target.value)}
          />
        </Box>
      )}
      {listState === 'loaded' && filteredAgents.length === 0 && (
        <Box display="flex" marginTop={4} justifyContent="center">
          <Text variant="h3">
            {t('noAgentsFound', 'Engir fasteignasalar fundust.')}
          </Text>
        </Box>
      )}
      {listState === 'loaded' && filteredAgents.length > 0 && (
        <Box>
          <Box style={tableContainerStyles}>
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData>{t('name', 'Nafn')}</T.HeadData>
                  <T.HeadData>{t('location', 'Starfsstöð')}</T.HeadData>
                </T.Row>
              </T.Head>
              <T.Body>
                {filteredAgents
                  .slice(
                    (currentPageNumber - 1) * pageSize,
                    currentPageNumber * pageSize,
                  )
                  .map((agent, index) => {
                    return (
                      <T.Row key={index}>
                        <T.Data>
                          <Text variant="small">{agent.name}</Text>
                        </T.Data>
                        <T.Data>
                          <Box
                            className={
                              !agent.location && styles.agentNoLocation
                            }
                          >
                            <Text variant="small">
                              {agent.location ||
                                t(
                                  'agentNoLocation',
                                  'Engin starfsstöð tilgreind.',
                                )}
                            </Text>
                          </Box>
                        </T.Data>
                      </T.Row>
                    )
                  })}
              </T.Body>
            </T.Table>
          </Box>
          {totalPages > 1 && (
            <Box marginTop={3}>
              <Pagination
                page={currentPageNumber}
                totalPages={totalPages}
                renderLink={(page, className, children) => (
                  <button
                    onClick={() => {
                      setCurrentPageNumber(page)
                    }}
                  >
                    <span className={className}>{children}</span>
                  </button>
                )}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export { RealEstateAgentsList }
