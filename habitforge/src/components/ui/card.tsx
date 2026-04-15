'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean
  glowColor?: 'orange' | 'yellow' | 'green'
  elevated?: boolean
  noPadding?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      glow = false,
      glowColor = 'orange',
      elevated = false,
      noPadding = false,
      children,
      ...props
    },
    ref
  ) => {
    const glowColorMap = {
      orange: 'hover:shadow-[0_0_0_1px_#FF6B00,0_8px_32px_rgba(255,107,0,0.2)] hover:border-brand-orange',
      yellow: 'hover:shadow-[0_0_0_1px_#FFD700,0_8px_32px_rgba(255,215,0,0.2)] hover:border-brand-yellow',
      green:  'hover:shadow-[0_0_0_1px_#22C55E,0_8px_32px_rgba(34,197,94,0.2)] hover:border-brand-green',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-border',
          elevated ? 'bg-bg-elevated' : 'bg-bg-card',
          noPadding ? '' : 'p-5',
          glow && [
            'transition-all duration-300 cursor-default',
            glowColorMap[glowColor],
          ],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col gap-1 mb-4', className)}
      {...props}
    />
  )
)

CardHeader.displayName = 'CardHeader'

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-heading font-semibold text-text-primary', className)}
      {...props}
    />
  )
)

CardTitle.displayName = 'CardTitle'

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-text-secondary', className)}
      {...props}
    />
  )
)

CardDescription.displayName = 'CardDescription'

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
)

CardContent.displayName = 'CardContent'

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center gap-2 mt-4 pt-4 border-t border-border', className)}
      {...props}
    />
  )
)

CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
