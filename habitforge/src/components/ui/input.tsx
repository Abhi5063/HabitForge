'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  rightElement?: React.ReactNode
  inputSize?: 'sm' | 'md' | 'lg'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      rightElement,
      inputSize = 'md',
      id,
      type = 'text',
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? React.useId()

    const sizeClasses = {
      sm: 'h-8 text-sm px-3',
      md: 'h-10 text-sm px-3.5',
      lg: 'h-12 text-base px-4',
    }

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-heading font-medium text-text-secondary"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-text-muted pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            className={cn(
              'w-full rounded-lg border bg-bg-surface text-text-primary placeholder:text-text-muted',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange',
              sizeClasses[inputSize],
              error
                ? 'border-red-700 focus:ring-red-500/40 focus:border-red-600'
                : 'border-border hover:border-border-light',
              leftIcon && 'pl-10',
              (rightIcon || rightElement) && 'pr-10',
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            {...props}
          />

          {(rightIcon || rightElement) && (
            <span className="absolute right-3 text-text-muted flex items-center">
              {rightElement ?? rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-400 font-body mt-0.5">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-text-muted font-body mt-0.5">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, disabled, ...props }, ref) => {
    const textareaId = id ?? React.useId()

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-heading font-medium text-text-secondary"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          className={cn(
            'w-full min-h-[100px] rounded-lg border bg-bg-surface text-text-primary placeholder:text-text-muted',
            'text-sm px-3.5 py-2.5 resize-y',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange',
            error
              ? 'border-red-700 focus:ring-red-500/40 focus:border-red-600'
              : 'border-border hover:border-border-light',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          {...props}
        />

        {error && (
          <p className="text-xs text-red-400 font-body mt-0.5">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-text-muted font-body mt-0.5">{hint}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Input, Textarea }
