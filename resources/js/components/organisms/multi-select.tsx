import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { ChevronDownIcon, XIcon } from 'lucide-react'
import { forwardRef, useEffect, useRef, useState } from 'react'

interface Option {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  value: string[]
  onChange: (values: string[]) => void
  maxSelections?: number
  placeholder?: string
  name?: string
  id?: string
  className?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  value,
  onChange,
  maxSelections,
  placeholder = 'Seleccionar...',
  name,
  id,
  className,
  disabled,
  ...props
}: MultiSelectProps) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth)
    }
  }, [])

  const toggle = (val: string) => {
    const selected = value.includes(val)
    let next: string[]
    if (selected) {
      next = value.filter((v) => v !== val)
    } else {
      if (maxSelections && value.length >= maxSelections) {
        next = value
      } else {
        next = [...value, val]
      }
    }
    onChange(next)
  }

  return (
    <Popover {...props}>
      <MultiSelectTrigger
        ref={triggerRef}
        className={className}
        id={id}
        value={value}
        options={options}
        placeholder={placeholder}
        toggle={toggle}
        disabled={disabled}
      />
      <MultiSelectContent
        options={options}
        value={value}
        toggle={toggle}
        triggerWidth={triggerWidth}
        maxSelections={maxSelections}
        disabled={disabled}
      />
      {name && <input type='hidden' name={name} id={id} value={JSON.stringify(value)} />}
    </Popover>
  )
}

interface MultiSelectTriggerProps {
  className?: string
  id?: string
  value: string[]
  options: Option[]
  placeholder: string
  toggle: (val: string) => void
  disabled?: boolean
}

const MultiSelectTrigger = forwardRef<HTMLButtonElement, MultiSelectTriggerProps>(
  ({ className, id, value, options, placeholder, disabled, toggle }, ref) => {
    return (
      <PopoverTrigger
        ref={ref}
        id={id}
        className={cn(
          'border-input flex min-h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none',
          value.length === 0 ? 'text-muted-foreground' : '',
          className
        )}
        aria-haspopup='listbox'
        aria-expanded='false'
        aria-labelledby={id}
        disabled={disabled}
      >
        <div className='flex min-w-0 flex-1 flex-wrap gap-1'>
          {value.length > 0
            ? value.map((v) => {
                const opt = options.find((o) => o.value === v)
                return (
                  <span key={v} className='bg-muted flex items-center gap-1 rounded px-2 py-1 text-xs'>
                    {opt?.label}
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation()
                        toggle(v)
                      }}
                      className='ml-1 flex items-center justify-center rounded hover:bg-red-200 dark:hover:bg-red-700'
                      aria-label={`Quitar ${opt?.label}`}
                    >
                      <XIcon className='size-4 text-red-600' />
                    </button>
                  </span>
                )
              })
            : placeholder}
        </div>
        <ChevronDownIcon className='size-4 opacity-50' />
      </PopoverTrigger>
    )
  }
)
MultiSelectTrigger.displayName = 'MultiSelectTrigger'

interface MultiSelectContentProps {
  options: Option[]
  value: string[]
  toggle: (val: string) => void
  triggerWidth?: number
  maxSelections?: number
  disabled?: boolean
}

function MultiSelectContent({ options, value, toggle, triggerWidth, maxSelections, disabled }: MultiSelectContentProps) {
  const reachedMax = maxSelections !== undefined && value.length >= maxSelections
  return (
    <PopoverContent
      style={{ width: triggerWidth }}
      className='bg-popover z-50 max-h-60 overflow-auto rounded-md border p-2 shadow-md'
      side='bottom'
      align='start'
    >
      {options.map((opt) => {
        const isSelected = value.includes(opt.value)
        // Si ya se alcanzó el máximo y esta opción NO está seleccionada, la deshabilitamos visualmente
        const isDisabled = disabled || (reachedMax && !isSelected)

        return (
          <label
            key={opt.value}
            className={cn(
              'flex items-center justify-between gap-2 rounded px-2 py-1 text-sm select-none',
              isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-muted',
              isDisabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={isSelected}
                onChange={() => toggle(opt.value)}
                className={cn(isDisabled ? 'cursor-not-allowed' : '')}
                disabled={isDisabled}
              />
              {opt.label}
            </div>
          </label>
        )
      })}
    </PopoverContent>
  )
}
