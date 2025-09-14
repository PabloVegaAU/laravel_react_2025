import '@tanstack/react-table'
import type { route as routeFn } from 'ziggy-js'

declare global {
  const route: typeof routeFn
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    className?: string
  }
}
