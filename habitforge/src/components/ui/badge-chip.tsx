'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

interface BadgeChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  rarity?: Rarity
  variant?: 'default' | 'rarity' | 'category' | 'status'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
}

const rarityStyles: Record<Rarity, string> = {
  common:    'bg-[rgba(163,163,163,0.12)] border-[rgba(163,163,163,0.3)] text-[#A3A3A3]',
  uncommon:  'bg-[rgba(34,197,94,0.12)] border-[rgba(34,197,94,0.3)] text-brand-green',
  rare:      'bg-[rgba(255,215,0,0.12)] border-[rgba(255,215,0,0.3)] text-brand-yellow',
  epic:      'bg-[rgba(255,107,0,0.12)] border-[rgba(255,107,0,0.3)] text-brand-orange',
  legendary: 'bg-[rgba(255,0,0,0.12)] border-[rgba(255,0,0,0.3)] text-red-400',
}

const sizeStyles = {
  sm: 'text-[10px] px-2 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1 gap-1.5',
  lg: 'text-sm px-3 py-1.5 gap-2',
}

const BadgeChip = React.forwardRef<HTMLSpanElement, BadgeChipProps>(
  (
    {
      className,
      rarity,
      variant = 'default',
      size = 'md',
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center font-heading font-semibold uppercase tracking-wider rounded-full border transition-all duration-200 select-none'

    const variantClasses: Record<string, string> = {
      default:  'bg-bg-surface border-border text-text-secondary',
      category: 'bg-[rgba(255,107,0,0.1)] border-[rgba(255,107,0,0.25)] text-brand-orange-light',
      status:   'bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.25)] text-brand-green',
      rarity:   rarity ? rarityStyles[rarity] : rarityStyles.common,
    }

    return (
      <span
        ref={ref}
        className={cn(
          baseClasses,
          sizeStyles[size],
          variant === 'rarity' && rarity
            ? rarityStyles[rarity]
            : variantClasses[variant],
          className
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </span>
    )
  }
)

BadgeChip.displayName = 'BadgeChip'

export { BadgeChip, type Rarity }
