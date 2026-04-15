'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number          // 0–100
  max?: number
  showLabel?: boolean
  labelFormat?: (value: number, max: number) => string
  size?: 'sm' | 'md' | 'lg'
  color?: 'orange' | 'yellow' | 'green' | 'gradient'
  animated?: boolean
  striped?: boolean
  label?: string
}

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

const colorMap = {
  orange:   'bg-brand-orange',
  yellow:   'bg-brand-yellow',
  green:    'bg-brand-green',
  gradient: 'bg-gradient-to-r from-brand-orange to-brand-yellow',
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      className,
      value,
      max = 100,
      showLabel = false,
      labelFormat,
      size = 'md',
      color = 'gradient',
      animated = true,
      striped = false,
      label,
      ...props
    },
    ref
  ) => {
    const percent = Math.min(Math.max((value / max) * 100, 0), 100)

    const defaultLabel = labelFormat
      ? labelFormat(value, max)
      : `${Math.round(percent)}%`

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {(label || showLabel) && (
          <div className="flex justify-between items-center mb-1.5">
            {label && (
              <span className="text-xs font-heading font-medium text-text-secondary">
                {label}
              </span>
            )}
            {showLabel && (
              <span className="text-xs font-mono font-semibold text-brand-yellow ml-auto">
                {defaultLabel}
              </span>
            )}
          </div>
        )}

        <div
          className={cn(
            'w-full bg-bg-surface rounded-full overflow-hidden',
            sizeMap[size]
          )}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          <div
            className={cn(
              'h-full rounded-full',
              colorMap[color],
              animated && 'transition-all duration-700 ease-out',
              striped && [
                'bg-[length:16px_16px]',
                'bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)]',
              ]
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    )
  }
)

ProgressBar.displayName = 'ProgressBar'

export { ProgressBar }
