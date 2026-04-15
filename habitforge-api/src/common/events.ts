export class HabitCompletedEvent {
  userId: string
  habitId: string
  xpEarned: number
  newStreak: number
  multiplier: number
}

export class UserLevelUpEvent {
  userId: string
  oldLevel: number
  newLevel: number
  totalXP: number
}

export class BadgeUnlockedEvent {
  userId: string
  badgeKey: string
  badgeName: string
  badgeIcon: string
  rarity: string
}
