import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // Base (filled)
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 dark:bg-primary/90 dark:hover:bg-primary/80',

          secondary:"bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",

        destructive: 'bg-destructive text-white shadow-xs hover:bg-destructive/90 dark:bg-destructive/90 dark:hover:bg-destructive/80',
        success: 'bg-green-600 text-white shadow-xs hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800',
        warning: 'bg-yellow-500 text-white shadow-xs hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700',
        info: 'bg-blue-500 text-white shadow-xs hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700',

        // Outline
        outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        'outline-destructive': 'border border-destructive text-destructive hover:bg-destructive/10 dark:border-destructive/70 dark:text-destructive-foreground',
        'outline-success': 'border border-green-500 text-green-600 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/30',
        'outline-warning': 'border border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:border-yellow-600 dark:text-yellow-400 dark:hover:bg-yellow-900/20',
        'outline-info': 'border border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/30',

        // Ghost
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        'ghost-destructive': 'text-destructive hover:bg-destructive/10',
        'ghost-success': 'text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30',
        'ghost-warning': 'text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20',
        'ghost-info': 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30',

        // Link
        link: 'text-primary underline-offset-4 hover:underline dark:text-primary-400'
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
