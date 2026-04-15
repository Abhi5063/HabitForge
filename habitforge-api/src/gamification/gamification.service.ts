import { Injectable, Logger } from '@nestjs/common'
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter'
import { PrismaService } from '../prisma/prisma.service'
import { HabitCompletedEvent, UserLevelUpEvent } from '../common/events'
import { getLevelFromXP, getXPForLevel, getXPProgressPercent } from '../common/xp.utils'
import { BADGE_DEFINITIONS } from '../common/constants'
import { Badge } from '@prisma/client'

export interface UserStats {
  totalXP: number
  level: number
  levelProgressPercent: number
  nextLevelXP: number
  badges: any[]
  streaks: { longest: number; current: number }
  completionsLast30Days: number
}

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('habit.completed')
  async onHabitCompleted(event: HabitCompletedEvent): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: event.userId },
    })
    if (!user) return

    const newTotalXP = user.totalXP + event.xpEarned
    const newLevel = getLevelFromXP(newTotalXP)
    const leveledUp = newLevel > user.currentLevel
    const newLongestStreak = Math.max(user.longestStreak, event.newStreak)

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        totalXP: newTotalXP,
        currentLevel: newLevel,
        longestStreak: newLongestStreak,
      },
    })

    if (leveledUp) {
      const levelUpEvent: UserLevelUpEvent = {
        userId: user.id,
        oldLevel: user.currentLevel,
        newLevel,
        totalXP: newTotalXP,
      }
      this.eventEmitter.emit('user.levelup', levelUpEvent)

      await this.prisma.userNotification.create({
        data: {
          userId: user.id,
          type: 'LEVEL_UP',
          title: 'Level Up!',
          body: `Congratulations! You've reached Level ${newLevel}!`,
          data: { newLevel },
        },
      })
    }

    await this.evaluateBadges(user.id)
  }

  async evaluateBadges(userId: string): Promise<Badge[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        habits: true,
      },
    })
    if (!user) return []

    const userBadges = await this.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
    })
    const earnedKeys = new Set(userBadges.map((ub) => ub.badge.badgeKey))

    const stats: Record<string, number> = {
      habits_created: await this.prisma.habit.count({ where: { userId } }),
      streak: user.longestStreak,
      total_xp: user.totalXP,
      level: user.currentLevel,
      paths_completed: await this.prisma.pathPlan.count({
        where: { userId, status: 'COMPLETED' },
      }),
      friends_count: await this.prisma.friendship.count({
        where: {
          OR: [{ requesterId: userId }, { addresseeId: userId }],
          status: 'ACCEPTED',
        },
      }),
    }

    const newlyUnlocked: Badge[] = []

    for (const def of BADGE_DEFINITIONS) {
      if (earnedKeys.has(def.id)) continue

      const currentValue = stats[def.criteria] || 0
      if (currentValue >= def.value) {
        const badge = await this.prisma.badge.findUnique({
          where: { badgeKey: def.id },
        })

        if (badge) {
          await this.prisma.userBadge.create({
            data: { userId, badgeId: badge.id },
          })

          await this.prisma.userNotification.create({
            data: {
              userId,
              type: 'BADGE_UNLOCK',
              title: 'Badge Unlocked!',
              body: `You earned the ${badge.name} badge!`,
              data: { badgeKey: badge.badgeKey, icon: badge.icon },
            },
          })

          newlyUnlocked.push(badge)
        }
      }
    }

    return newlyUnlocked
  }

  async getUserStats(userId: string): Promise<UserStats> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const userBadges = await this.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
    })

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const completionsLast30Days = await this.prisma.habitCompletion.count({
      where: {
        userId,
        completedAt: { gte: thirtyDaysAgo },
      },
    })

    const activeHabits = await this.prisma.habit.findMany({
      where: { userId, isArchived: false },
      select: { currentStreak: true },
    })

    const maxCurrentStreak = activeHabits.length
      ? Math.max(...activeHabits.map((h) => h.currentStreak))
      : 0

    return {
      totalXP: user.totalXP,
      level: user.currentLevel,
      levelProgressPercent: getXPProgressPercent(user.totalXP),
      nextLevelXP: getXPForLevel(user.currentLevel + 1),
      badges: userBadges.map((ub) => ub.badge),
      streaks: {
        longest: user.longestStreak,
        current: maxCurrentStreak,
      },
      completionsLast30Days,
    }
  }
}
