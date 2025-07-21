import { usePrizes as usePrizesHook } from '@/hooks/usePrizes'
import { Prize, PrizeFilters } from '@/types/prize'
import React, { createContext, ReactNode, useContext } from 'react'

interface PrizesContextType {
  prizes: Prize[]
  loading: boolean
  error: string | null
  filters: PrizeFilters
  total: number
  setFilters: (filters: PrizeFilters) => void
  fetchPrizes: (customFilters?: PrizeFilters) => Promise<Prize[]>
  fetchPrize: (id: number | string) => Promise<Prize>
  createPrize: (prizeData: Omit<Prize, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => Promise<Prize>
  updatePrize: (id: number | string, prizeData: Partial<Prize>) => Promise<Prize>
  deletePrize: (id: number | string) => Promise<boolean>
  togglePrizeStatus: (id: number | string, isActive: boolean) => Promise<Prize>
}

const PrizesContext = createContext<PrizesContextType | undefined>(undefined)

interface PrizesProviderProps {
  children: ReactNode
  initialFilters?: PrizeFilters
}

export const PrizesProvider: React.FC<PrizesProviderProps> = ({ children, initialFilters = {} }) => {
  const { prizes, loading, error, filters, total, setFilters, fetchPrizes, fetchPrize, createPrize, updatePrize, deletePrize, togglePrizeStatus } =
    usePrizesHook({
      initialFilters,
      autoFetch: true
    })

  // Wrap the context value in useMemo to prevent unnecessary re-renders
  const contextValue = React.useMemo(
    () => ({
      prizes,
      loading,
      error,
      filters,
      total,
      setFilters,
      fetchPrizes,
      fetchPrize,
      createPrize,
      updatePrize,
      deletePrize,
      togglePrizeStatus
    }),
    [prizes, loading, error, filters, total, setFilters, fetchPrizes, fetchPrize, createPrize, updatePrize, deletePrize, togglePrizeStatus]
  )

  return <PrizesContext.Provider value={contextValue}>{children}</PrizesContext.Provider>
}

export const usePrizesContext = (): PrizesContextType => {
  const context = useContext(PrizesContext)
  if (context === undefined) {
    throw new Error('usePrizesContext must be used within a PrizesProvider')
  }
  return context
}

// Higher Order Component for class components
export const withPrizes = <P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> => {
  const WithPrizes: React.FC<P> = (props) => {
    const prizesContext = usePrizesContext()
    return <WrappedComponent {...props} {...prizesContext} />
  }

  // Set display name for better debugging
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'
  WithPrizes.displayName = `withPrizes(${displayName})`

  return WithPrizes
}

export default PrizesContext
