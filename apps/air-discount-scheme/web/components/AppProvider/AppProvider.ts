import React, { createContext, ReactNode } from 'react'

import {
  Municipality,
  NationalRegistryData,
} from '@island.is/financial-aid/shared/lib'
import { User } from '../../pages/auth/interfaces'

import { useMunicipality } from '@island.is/financial-aid/shared/components'
import useUser from '@island.is/financial-aid-web/osk/src/utils/hooks/useUser'
import { ApolloError } from 'apollo-client'
import useNationalRegistry from '@island.is/financial-aid-web/osk/src/utils/hooks/useNationalRegistry'

interface AppProvider {
  loading: boolean
  error?: ApolloError
  municipality?: Municipality
  setMunicipalityById: (
    municipalityId: string,
  ) => Promise<Municipality | undefined>
  isAuthenticated?: boolean
  user?: User
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>
  loadingUser: boolean
  loadingMuncipality: boolean
  nationalRegistryData?: NationalRegistryData
  setNationalRegistryData: (data: NationalRegistryData) => void
}

interface Props {
  children: ReactNode
}

export const AppContext = createContext<AppProvider>({
  setUser: () => undefined,
  setMunicipalityById: () => Promise.resolve(undefined),
  setNationalRegistryData: () => {},
  loading: false,
  loadingUser: false,
  loadingMuncipality: false,
})

const AppProvider = ({ children }: Props) => {
  const {
    municipality,
    setMunicipalityById,
    loading: loadingMuncipality,
  } = useMunicipality()

  const { isAuthenticated, user, setUser, loadingUser } = useUser()

  const {
    nationalRegistryData,
    setNationalRegistryData,
  } = useNationalRegistry()

  return (
    <AppContext.Provider
      value={{
        error,
        loading,
        municipality,
        setMunicipalityById,
        loadingMuncipality,
        isAuthenticated,
        user,
        loadingUser,
        setUser,
        nationalRegistryData,
        setNationalRegistryData,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
