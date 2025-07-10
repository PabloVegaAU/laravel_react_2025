import { ColumnDef } from '@tanstack/react-table'

type Paths<T, K extends string = ''> = T extends object
  ? {
      [P in keyof T & string]: T[P] extends object ? `${K}${P}` | Paths<T[P], `${K}${P}.`> : `${K}${P}`
    }[keyof T & string]
  : never

export type Column<T> = {
  accessorKey: T extends object ? Paths<T> | 'actions' : never
  header: string
  renderCell?: (row: T) => React.ReactNode
}

export type TypedColumnDef<T> = ColumnDef<T, unknown> & {
  accessorKey?: Paths<T> | keyof T
}
