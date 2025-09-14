import { Button } from '@/components/ui/button'
import { Prize } from '@/types/prize'
import { ColumnDef } from '@tanstack/react-table'
import { Edit, Trash2 } from 'lucide-react'

type PrizeColumnsProps = {
  onEdit: (prize: Prize) => void
}

export const prizeColumns = ({ onEdit }: PrizeColumnsProps): ColumnDef<Prize>[] => [
  {
    accessorKey: 'image',
    header: 'Imagen',
    cell: ({ row }) => {
      const prize = row.original
      return (
        <div className='flex items-center'>
          {prize.image ? (
            <img
              src={prize.image.startsWith('http') ? prize.image : `${prize.image}`}
              alt={prize.name}
              className='h-10 w-10 rounded-full object-cover'
              loading='lazy'
            />
          ) : (
            <div className='dark:bg-sidebar-border flex h-10 w-10 items-center justify-center rounded-full bg-gray-200'>
              <span className='dark:text-sidebar-foreground/60 text-xs text-gray-500'>Sin imagen</span>
            </div>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => row.original.name
  },
  {
    accessorKey: 'points_cost',
    header: 'Puntos',
    cell: ({ row }) => `${row.original.points_cost} pts`
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    cell: ({ row }) => `${row.original.stock} unidades`
  },
  {
    accessorKey: 'is_active',
    header: 'Estado',
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          row.original.is_active
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}
      >
        {row.original.is_active ? 'Activo' : 'Inactivo'}
      </span>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        <Button variant='ghost' size='icon' onClick={() => onEdit(row.original)} title='Editar premio' className='h-8 w-8 p-0'>
          <Edit className='h-4 w-4' />
          <span className='sr-only'>Editar</span>
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8 p-0 text-red-600 hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/50 dark:hover:text-red-300'
          title='Eliminar premio'
        >
          <Trash2 className='h-4 w-4' />
          <span className='sr-only'>Eliminar</span>
        </Button>
      </div>
    )
  }
]
