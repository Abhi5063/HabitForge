export interface BadgeDefinition {
  id: string
  name: string
  desc: string
  icon: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  criteria: string
  value: number
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { id: 'first_habit', name: 'First Step', desc: 'Create your first habit', icon: '🌱', rarity: 'common', criteria: 'habits_created', value: 1 },
  { id: 'streak_7', name: 'Week Warrior', desc: '7-day streak on any habit', icon: '🔥', rarity: 'uncommon', criteria: 'streak', value: 7 },
  { id: 'streak_30', name: 'Iron Will', desc: '30-day streak on any habit', icon: '⚡', rarity: 'rare', criteria: 'streak', value: 30 },
  { id: 'streak_100', name: 'Centurion', desc: '100-day streak', icon: '💎', rarity: 'epic', criteria: 'streak', value: 100 },
  { id: 'xp_1000', name: 'XP Hunter', desc: 'Earn 1,000 total XP', icon: '⭐', rarity: 'common', criteria: 'total_xp', value: 1000 },
  { id: 'xp_10000', name: 'XP Legend', desc: 'Earn 10,000 total XP', icon: '🌟', rarity: 'rare', criteria: 'total_xp', value: 10000 },
  { id: 'level_5', name: 'Apprentice', desc: 'Reach Level 5', icon: '🎯', rarity: 'common', criteria: 'level', value: 5 },
  { id: 'level_10', name: 'Adept', desc: 'Reach Level 10', icon: '🏆', rarity: 'uncommon', criteria: 'level', value: 10 },
  { id: 'path_complete', name: 'Path Walker', desc: 'Complete an AI Learning Path', icon: '🗺️', rarity: 'rare', criteria: 'paths_completed', value: 1 },
  { id: 'social_5', name: 'Networker', desc: 'Add 5 friends', icon: '🤝', rarity: 'uncommon', criteria: 'friends_count', value: 5 },
]

export const XP_BASE = 50

export interface LeaderboardUser {
  id: string
  name: string
  avatarEmoji: string
  totalXP: number
  currentLevel: number
  longestStreak: number
  isDummy: boolean
}

export const DUMMY_LEADERBOARD_USERS: LeaderboardUser[] = [
  { id: 'dummy_1', name: 'Arjun Sharma', avatarEmoji: '🦁', totalXP: 48200, currentLevel: 21, longestStreak: 67, isDummy: true },
  { id: 'dummy_2', name: 'Priya Nair', avatarEmoji: '🦊', totalXP: 39100, currentLevel: 19, longestStreak: 44, isDummy: true },
  { id: 'dummy_3', name: 'Kenji Tanaka', avatarEmoji: '🐉', totalXP: 35600, currentLevel: 18, longestStreak: 31, isDummy: true },
  { id: 'dummy_4', name: 'Sofia Reyes', avatarEmoji: '🌺', totalXP: 29800, currentLevel: 17, longestStreak: 28, isDummy: true },
  { id: 'dummy_5', name: 'Marcus Webb', avatarEmoji: '🦅', totalXP: 24500, currentLevel: 15, longestStreak: 19, isDummy: true },
  { id: 'dummy_6', name: 'Aisha Okonkwo', avatarEmoji: '🌙', totalXP: 18900, currentLevel: 13, longestStreak: 15, isDummy: true },
  { id: 'dummy_7', name: 'Rishi Patel', avatarEmoji: '🔥', totalXP: 14200, currentLevel: 11, longestStreak: 12, isDummy: true },
  { id: 'dummy_8', name: 'Lena Fischer', avatarEmoji: '⭐', totalXP: 9800, currentLevel: 9, longestStreak: 8, isDummy: true },
  { id: 'dummy_9', name: 'Carlos Lima', avatarEmoji: '🎯', totalXP: 5600, currentLevel: 7, longestStreak: 5, isDummy: true },
  { id: 'dummy_10', name: 'Yuki Chen', avatarEmoji: '🌸', totalXP: 2100, currentLevel: 4, longestStreak: 3, isDummy: true },
]
