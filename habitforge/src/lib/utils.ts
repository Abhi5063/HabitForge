import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function formatXP(xp: number): string {
  if (xp >= 1_000_000) return `${(xp / 1_000_000).toFixed(1)}M`
  if (xp >= 1_000) return `${(xp / 1_000).toFixed(1)}K`
  return xp.toString()
}

export function getLevelFromXP(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100))
}

export function getXPForLevel(level: number): number {
  return level * level * 100
}

export function getXPProgressPercent(xp: number): number {
  const level = getLevelFromXP(xp)
  const currentLevelXP = getXPForLevel(level)
  const nextLevelXP = getXPForLevel(level + 1)
  if (nextLevelXP === currentLevelXP) return 100
  return Math.floor(((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100)
}

export function getStreakMultiplier(streak: number): number {
  if (streak >= 30) return 2.0
  if (streak >= 7) return 1.5
  return 1.0
}

export function getStreakLabel(streak: number): string {
  if (streak >= 365) return 'Legendary'
  if (streak >= 100) return 'Mythic'
  if (streak >= 30) return 'Epic'
  if (streak >= 7) return 'Hot'
  if (streak >= 3) return 'Rising'
  return 'Starting'
}
