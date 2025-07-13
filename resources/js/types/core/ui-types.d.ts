import { ColumnDef } from '@tanstack/react-table'

type Paths<T> =
  | {
      [K in keyof T & string]: T[K] extends object ? K | `${K}.${keyof T[K] & string}` : K
    }[keyof T & string]
  | 'actions'

export type Column<T> = {
  accessorKey: T extends object ? Paths<T> | 'actions' : never
  header: string
  renderCell?: (row: T) => React.ReactNode
}

export type TypedColumnDef<T> = ColumnDef<T, unknown> & {
  accessorKey?: Paths<T> | keyof T
}
