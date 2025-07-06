import * as SelectPrimitive from '@radix-ui/react-select'
import { SearchIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'
import { Select, SelectTrigger, SelectValue } from '../ui/select'

type SearchableSelectProps = React.ComponentProps<typeof SelectPrimitive.Root> & {
  placeholder?: string
  searchPlaceholder?: string
  onSearchChange?: (value: string) => void
  searchValue?: string
  className?: string
}

function SearchableSelect({
  children,
  placeholder = 'Buscar...',
  searchPlaceholder = 'Buscar...',
  onSearchChange,
  searchValue = '',
  className,
  ...props
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  // Manejar cambios en el input de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value)
  }

  // Manejar el cierre del menú
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (!searchValue) {
        setIsOpen(false)
      }
    } else {
      setIsOpen(true)
    }
  }

  // Efecto para manejar el foco cuando se abre el menú
  React.useEffect(() => {
    if (isOpen && searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus()
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Prevenir el comportamiento de teclado del Select cuando el input está enfocado
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Tab']
    if (!allowedKeys.includes(e.key)) {
      e.stopPropagation()
    }
  }

  return (
    <Select {...props} open={isOpen} onOpenChange={handleOpenChange}>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className={cn(
            'bg-popover text-popover-foreground animate-in fade-in-80 z-50 max-h-40 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border shadow-md',
            className
          )}
          position='popper'
          sideOffset={4}
          onPointerDownOutside={(e) => {
            if (searchValue) {
              e.preventDefault()
            }
          }}
          onEscapeKeyDown={(e) => {
            if (searchValue) {
              e.preventDefault()
              onSearchChange?.('')
            } else {
              setIsOpen(false)
            }
          }}
          // Deshabilitar la navegación por teclado del menú
          onKeyDown={(e) => {
            if (searchValue) {
              e.stopPropagation()
            }
          }}
        >
          <div className='relative px-3 py-2' onClick={(e) => e.stopPropagation()}>
            <SearchIcon className='text-muted-foreground absolute top-1/2 left-5 h-4 w-4 -translate-y-1/2' />
            <input
              ref={searchInputRef}
              type='text'
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={handleSearchChange}
              onKeyDown={handleInputKeyDown}
              className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-8 w-full rounded-md border px-8 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <SelectPrimitive.Viewport
            className='p-1'
            onClick={(e) => e.stopPropagation()}
            // Prevenir eventos de teclado en el viewport
            onKeyDown={(e) => {
              if (searchValue) {
                e.stopPropagation()
              }
            }}
          >
            {children}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </Select>
  )
}

export { SearchableSelect }
