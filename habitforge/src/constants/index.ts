export const XP_BASE = 50

export const LEVEL_COLORS: string[] = [
  '#A3A3A3',
  '#22C55E',
  '#FFD700',
  '#FF6B00',
  '#FF0000',
]

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
  {
    id: 'first_habit',
    name: 'First Step',
    desc: 'Create your first habit',
    icon: '🌱',
    rarity: 'common',
    criteria: 'habits_created',
    value: 1,
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    desc: '7-day streak on any habit',
    icon: '🔥',
    rarity: 'uncommon',
    criteria: 'streak',
    value: 7,
  },
  {
    id: 'streak_30',
    name: 'Iron Will',
    desc: '30-day streak on any habit',
    icon: '⚡',
    rarity: 'rare',
    criteria: 'streak',
    value: 30,
  },
  {
    id: 'streak_100',
    name: 'Centurion',
    desc: '100-day streak',
    icon: '💎',
    rarity: 'epic',
    criteria: 'streak',
    value: 100,
  },
  {
    id: 'xp_1000',
    name: 'XP Hunter',
    desc: 'Earn 1,000 total XP',
    icon: '⭐',
    rarity: 'common',
    criteria: 'total_xp',
    value: 1000,
  },
  {
    id: 'xp_10000',
    name: 'XP Legend',
    desc: 'Earn 10,000 total XP',
    icon: '🌟',
    rarity: 'rare',
    criteria: 'total_xp',
    value: 10000,
  },
  {
    id: 'level_5',
    name: 'Apprentice',
    desc: 'Reach Level 5',
    icon: '🎯',
    rarity: 'common',
    criteria: 'level',
    value: 5,
  },
  {
    id: 'level_10',
    name: 'Adept',
    desc: 'Reach Level 10',
    icon: '🏆',
    rarity: 'uncommon',
    criteria: 'level',
    value: 10,
  },
  {
    id: 'path_complete',
    name: 'Path Walker',
    desc: 'Complete an AI Learning Path',
    icon: '🗺️',
    rarity: 'rare',
    criteria: 'paths_completed',
    value: 1,
  },
  {
    id: 'social_5',
    name: 'Networker',
    desc: 'Add 5 friends',
    icon: '🤝',
    rarity: 'uncommon',
    criteria: 'friends_count',
    value: 5,
  },
]

export interface LeaderboardUser {
  id: string
  name: string
  avatar: string
  totalXP: number
  level: number
  streak: number
  country: string
}

export const DUMMY_LEADERBOARD_USERS: LeaderboardUser[] = [
  { id: 'dummy_1', name: 'Arjun Sharma', avatar: '🦁', totalXP: 48200, level: 21, streak: 67, country: 'IN' },
  { id: 'dummy_2', name: 'Priya Nair', avatar: '🦊', totalXP: 39100, level: 19, streak: 44, country: 'IN' },
  { id: 'dummy_3', name: 'Kenji Tanaka', avatar: '🐉', totalXP: 35600, level: 18, streak: 31, country: 'JP' },
  { id: 'dummy_4', name: 'Sofia Reyes', avatar: '🌺', totalXP: 29800, level: 17, streak: 28, country: 'MX' },
  { id: 'dummy_5', name: 'Marcus Webb', avatar: '🦅', totalXP: 24500, level: 15, streak: 19, country: 'US' },
  { id: 'dummy_6', name: 'Aisha Okonkwo', avatar: '🌙', totalXP: 18900, level: 13, streak: 15, country: 'NG' },
  { id: 'dummy_7', name: 'Rishi Patel', avatar: '🔥', totalXP: 14200, level: 11, streak: 12, country: 'IN' },
  { id: 'dummy_8', name: 'Lena Fischer', avatar: '⭐', totalXP: 9800, level: 9, streak: 8, country: 'DE' },
  { id: 'dummy_9', name: 'Carlos Lima', avatar: '🎯', totalXP: 5600, level: 7, streak: 5, country: 'BR' },
  { id: 'dummy_10', name: 'Yuki Chen', avatar: '🌸', totalXP: 2100, level: 4, streak: 3, country: 'CN' },
]
