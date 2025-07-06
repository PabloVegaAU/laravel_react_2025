import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current transition-colors",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        primary: "bg-primary/10 text-primary border-primary/20",
        secondary: "bg-secondary/10 text-secondary-foreground border-secondary/20",
        success: "bg-success/10 text-success-foreground border-success/20",
        warning: "bg-warning/10 text-warning-foreground border-warning/20",
        destructive: "bg-destructive/10 text-destructive-foreground border-destructive/20",
        info: "bg-info/10 text-info-foreground border-info/20",
        outline: "bg-transparent border-border text-foreground hover:bg-accent/50",
        ghost: "border-transparent hover:bg-accent/50",
        transparent: "bg-transparent border-transparent",
      },
      size: {
        default: "px-4 py-3 text-sm",
        sm: "px-3 py-2 text-xs",
        lg: "px-6 py-4 text-base",
        full: "p-0 border-0 w-full",
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        default: "shadow",
        md: "shadow-md",
        lg: "shadow-lg",
      },
    },
    compoundVariants: [
      // Variantes compuestas para combinaciones comunes
      {
        variant: "outline",
        className: "bg-transparent",
      },
      {
        variant: "ghost",
        className: "hover:bg-accent/50",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      shadow: "none",
    },
  }
)

function Alert({
  className,
  variant,
  size,
  shadow,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant, size, shadow }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, alertVariants }
