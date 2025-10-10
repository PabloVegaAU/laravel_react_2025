// components/organisms/data-table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { PaginatedResponse } from '@/types/core'
import { Link } from '@inertiajs/react'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

interface DataTableProps<TData> {
  data: PaginatedResponse<TData>
  columns: ColumnDef<TData>[]
}

export default function DataTable<TData>({ data, columns }: DataTableProps<TData>) {
  const table = useReactTable({
    data: data.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: data.last_page,
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: data.current_page - 1,
        pageSize: data.per_page
      }
    }
  })

  return (
    <div className='space-y-4 rounded-lg border p-0.5'>
      <Table className='w-full table-auto'>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup, index) => (
            <TableRow key={`${headerGroup.id}-${index}`}>
              {headerGroup.headers.map((header, headerIndex) => (
                <TableHead key={`header-${header.id}-${headerIndex}`}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, rowIndex) => (
              <TableRow key={`row-${row.id}-${rowIndex}`}>
                {row.getVisibleCells().map((cell, cellIndex) => (
                  <TableCell key={`cell-${cell.id}-${cellIndex}-${rowIndex}`}>
                    <div className={cn('line-clamp-2 break-words text-ellipsis whitespace-normal', cell.column.columnDef.meta?.className)}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No se encontraron resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className='flex items-center justify-between px-2'>
        <div className='text-muted-foreground text-sm'>
          Mostrando {data.from} a {data.to} de {data.total} registros
        </div>
        <div className='flex items-center space-x-2'>
          {data.prev_page_url && (
            <Link
              href={data.prev_page_url}
              className='inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-black dark:text-gray-300 dark:hover:bg-gray-800'
            >
              Anterior
            </Link>
          )}
          {data.next_page_url && (
            <Link
              href={data.next_page_url}
              className='inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-black dark:text-gray-300 dark:hover:bg-gray-800'
            >
              Siguiente
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
