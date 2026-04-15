'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  lines?: number
}

function Skeleton({
  className,
  variant = 'rounded',
  width,
  height,
  lines = 1,
  style,
  ...props
}: SkeletonProps) {
  const baseClasses =
    'animate-pulse bg-bg-elevated relative overflow-hidden'

  const variantClasses: Record<string, string> = {
    text:        'rounded h-4',
    circular:    'rounded-full',
    rectangular: 'rounded-none',
    rounded:     'rounded-lg',
  }

  const shimmer =
    'after:absolute after:inset-0 after:translate-x-[-100%] after:bg-[linear-gradient(90deg,transparent_0%,rgba(255,107,0,0.04)_50%,transparent_100%)] after:animate-[shimmer_1.8s_infinite]'

  // For text variant with multiple lines
  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('flex flex-col gap-2', className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(baseClasses, variantClasses.text, shimmer)}
            style={{
              width: i === lines - 1 ? '75%' : '100%',
              ...style,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], shimmer, className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  )
}

// Composite skeleton presets
interface CardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function CardSkeleton({ className, ...props }: CardSkeletonProps) {
  return (
    <div
      className={cn('bg-bg-card border border-border rounded-xl p-5 space-y-4', className)}
      {...props}
    >
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" height={16} />
          <Skeleton variant="text" width="40%" height={12} />
        </div>
      </div>
      <Skeleton variant="text" lines={3} />
      <Skeleton variant="rounded" height={8} />
    </div>
  )
}

function StatSkeleton({ className, ...props }: CardSkeletonProps) {
  return (
    <div
      className={cn('bg-bg-card border border-border rounded-xl p-5 space-y-3', className)}
      {...props}
    >
      <Skeleton variant="text" width="50%" height={14} />
      <Skeleton variant="text" width="30%" height={32} />
      <Skeleton variant="rounded" height={6} />
    </div>
  )
}

export { Skeleton, CardSkeleton, StatSkeleton }
