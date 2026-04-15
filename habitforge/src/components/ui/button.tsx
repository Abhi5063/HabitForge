'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'btn-base select-none',
  {
    variants: {
      variant: {
        primary: [
          'bg-brand-orange text-white',
          'hover:bg-brand-orange-light',
          'active:bg-brand-orange-dark',
          'focus:ring-brand-orange',
          'shadow-[0_4px_20px_rgba(255,107,0,0.3)]',
          'hover:shadow-[0_4px_32px_rgba(255,107,0,0.5)]',
        ],
        secondary: [
          'bg-bg-surface text-text-primary border border-border',
          'hover:bg-bg-elevated hover:border-border-light',
          'focus:ring-border-light',
        ],
        ghost: [
          'bg-transparent text-text-secondary',
          'hover:bg-bg-surface hover:text-text-primary',
          'focus:ring-border',
        ],
        danger: [
          'bg-red-900/30 text-red-400 border border-red-900',
          'hover:bg-red-900/60 hover:text-red-300 hover:border-red-700',
          'focus:ring-red-700',
        ],
        gradient: [
          'bg-gradient-brand text-white',
          'hover:opacity-90',
          'focus:ring-brand-orange',
          'shadow-[0_4px_20px_rgba(255,107,0,0.35)]',
          'hover:shadow-[0_4px_36px_rgba(255,215,0,0.35)]',
        ],
      },
      size: {
        sm:   'text-sm px-3 py-1.5 rounded-md gap-1.5',
        md:   'text-sm px-4 py-2',
        lg:   'text-base px-6 py-3',
        xl:   'text-lg px-8 py-4',
        icon: 'p-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
