import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Filter, Search, X } from 'lucide-react'
import React from 'react'

type SortOption = 'name_asc' | 'name_desc' | 'points_asc' | 'points_desc' | 'newest' | 'oldest'

interface PrizeFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  sortBy: SortOption
  onSortChange: (value: SortOption) => void
  filters: {
    inStock: boolean
    activeOnly: boolean
    minPoints: string
    maxPoints: string
  }
  onFilterChange: (filters: { inStock?: boolean; activeOnly?: boolean; minPoints?: string; maxPoints?: string }) => void
  onReset: () => void
  activeFilterCount: number
}

export const PrizeFilters: React.FC<PrizeFiltersProps> = ({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  filters,
  onFilterChange,
  onReset,
  activeFilterCount
}) => {
  const handleMinPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '') // Only allow numbers
    onFilterChange({ minPoints: value })
  }

  const handleMaxPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '') // Only allow numbers
    onFilterChange({ maxPoints: value })
  }

  return (
    <div className='mb-6 flex flex-col gap-4 md:flex-row'>
      {/* Search Input */}
      <div className='relative flex-1'>
        <Search className='text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4' />
        <Input
          type='search'
          placeholder='Buscar premios...'
          className='w-full pl-8'
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Sort Select */}
      <div className='w-full md:w-48'>
        <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
          <SelectTrigger>
            <SelectValue placeholder='Ordenar por' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='name_asc'>Nombre (A-Z)</SelectItem>
            <SelectItem value='name_desc'>Nombre (Z-A)</SelectItem>
            <SelectItem value='points_asc'>Precio (menor a mayor)</SelectItem>
            <SelectItem value='points_desc'>Precio (mayor a menor)</SelectItem>
            <SelectItem value='newest'>Más recientes</SelectItem>
            <SelectItem value='oldest'>Más antiguos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter Button with Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline' className='relative'>
            <Filter className='mr-2 h-4 w-4' />
            Filtros
            {activeFilterCount > 0 && (
              <Badge variant='secondary' className='ml-2 flex h-5 w-5 items-center justify-center rounded-full p-0'>
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-80' align='end'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h4 className='font-medium'>Filtros</h4>
              <Button variant='ghost' size='sm' onClick={onReset} className='h-8 px-2 text-xs'>
                <X className='mr-1 h-3 w-3' />
                Restablecer
              </Button>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center space-x-2'>
                <Checkbox id='inStock' checked={filters.inStock} onCheckedChange={(checked) => onFilterChange({ inStock: !!checked })} />
                <Label htmlFor='inStock'>Solo disponibles en stock</Label>
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox id='activeOnly' checked={filters.activeOnly} onCheckedChange={(checked) => onFilterChange({ activeOnly: !!checked })} />
                <Label htmlFor='activeOnly'>Solo premios activos</Label>
              </div>

              <div className='space-y-2'>
                <Label>Rango de puntos</Label>
                <div className='grid grid-cols-2 gap-2'>
                  <div>
                    <Input placeholder='Mínimo' value={filters.minPoints} onChange={handleMinPointsChange} />
                  </div>
                  <div>
                    <Input placeholder='Máximo' value={filters.maxPoints} onChange={handleMaxPointsChange} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default PrizeFilters
