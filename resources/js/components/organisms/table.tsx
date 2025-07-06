import { getNestedValue } from '@/lib/utils'
import { PaginatedResponse } from '@/types/core'
import type { Column } from '@/types/core/ui-types'
import { Link } from '@inertiajs/react'

interface TableProps<T> {
  data: PaginatedResponse<T>
  columns: Column<T>[]
}

export default function Table<T>({ data, columns }: TableProps<T>) {
  return (
    <div className='overflow-hidden'>
      {/* Vista Desktop - Tabla tradicional */}
      <div className='hidden lg:block'>
        <div className='w-full overflow-x-auto'>
          <table className='dark:border-sidebar w-full min-w-max table-auto divide-y divide-gray-200 border border-gray-200 dark:divide-gray-900'>
            <thead className='dark:bg-sidebar bg-gray-50'>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.accessorKey}
                    className={`px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='dark:divide-sidebar divide-y divide-gray-200 bg-white dark:bg-black'>
              {data.data.map((item, index) => (
                <tr key={index} className='dark:hover:bg-sidebar transition-colors duration-150 hover:bg-gray-50'>
                  {columns.map((column) => (
                    <td key={column.accessorKey} className={`px-6 py-4 text-sm whitespace-nowrap text-black dark:text-gray-100`}>
                      {'renderCell' in column ? column.renderCell?.(item) : String(getNestedValue(item, String(column.accessorKey)))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista Tablet - Tabla compacta */}
      <div className='hidden md:block lg:hidden'>
        <div className='w-full overflow-x-auto'>
          <table className='dark:border-sidebar w-full table-auto divide-y divide-gray-200 border border-gray-200 dark:divide-gray-900'>
            <thead className='dark:bg-sidebar bg-gray-50'>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.accessorKey}
                    className={`px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='dark:divide-sidebar divide-y divide-gray-200 bg-white dark:bg-black'>
              {data.data.map((item, index) => (
                <tr key={index} className='dark:hover:bg-sidebar transition-colors duration-150 hover:bg-gray-50'>
                  {columns.map((column) => (
                    <td key={column.accessorKey} className={`px-3 py-2 text-sm text-black dark:text-gray-100`}>
                      <div className='break-words'>
                        {'renderCell' in column ? column.renderCell?.(item) : String(getNestedValue(item, String(column.accessorKey)))}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista Mobile - Tarjetas */}
      <div className='block md:hidden'>
        <div className='space-y-4'>
          {data.data.map((item, index) => (
            <div key={index} className='dark:border-sidebar dark:bg-sidebar/50 rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
              <div className='grid gap-3'>
                {columns.map((column) => {
                  // Omitir la columna de acciones en la vista de tarjeta normal
                  if (column.accessorKey === 'actions') return null

                  const value = 'renderCell' in column ? column.renderCell?.(item) : String(getNestedValue(item, String(column.accessorKey)))

                  return (
                    <div key={column.accessorKey} className='flex flex-col space-y-1'>
                      <span className='text-xs font-medium text-gray-500 uppercase dark:text-gray-400'>{column.header}</span>
                      <span className='text-sm break-words text-black dark:text-gray-100'>{value}</span>
                    </div>
                  )
                })}

                {/* Mostrar acciones al final de la tarjeta */}
                {(() => {
                  const actionsColumn = columns.find((col) => col.accessorKey === 'actions')
                  if (actionsColumn && 'renderCell' in actionsColumn) {
                    return (
                      <div className='flex flex-col space-y-1 border-t border-gray-200 pt-2 dark:border-gray-700'>
                        <span className='text-xs font-medium text-gray-500 uppercase dark:text-gray-400'>{actionsColumn.header}</span>
                        <div className='flex flex-wrap gap-2'>{actionsColumn.renderCell?.(item)}</div>
                      </div>
                    )
                  }
                  return null
                })()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paginación responsive */}
      <div className='mt-4 flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0'>
        <span className='text-sm text-gray-600 dark:text-gray-400'>
          Página {data.current_page} de {data.last_page}
        </span>
        <div className='flex space-x-2'>
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
