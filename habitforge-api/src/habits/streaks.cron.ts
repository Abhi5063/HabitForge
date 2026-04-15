import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class StreaksCron {
  private readonly logger = new Logger(StreaksCron.name)

  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 1 * * *')
  async resetMissedStreaks() {
    this.logger.log('Starting streak reset check job')

    const now = new Date()

    // DAILY: Not completed in the last 24h (~48 hours safe buffer based on 1 AM execution)
    const twoDaysAgo = new Date(now)
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    const dailyResult = await this.prisma.habit.updateMany({
      where: {
        frequency: 'DAILY',
        isArchived: false,
        currentStreak: { gt: 0 },
        OR: [
          { lastCompletedAt: { lt: twoDaysAgo } },
          { lastCompletedAt: null },
        ],
      },
      data: {
        currentStreak: 0,
      },
    })
    this.logger.log(`Reset ${dailyResult.count} DAILY habits to 0 streak`)

    // WEEKLY: Not completed in the last 7 days + buffer
    const weekBuffer = new Date(now)
    weekBuffer.setDate(weekBuffer.getDate() - 8)

    const weeklyResult = await this.prisma.habit.updateMany({
      where: {
        frequency: 'WEEKLY',
        isArchived: false,
        currentStreak: { gt: 0 },
        OR: [
          { lastCompletedAt: { lt: weekBuffer } },
          { lastCompletedAt: null },
        ],
      },
      data: { currentStreak: 0 },
    })
    this.logger.log(`Reset ${weeklyResult.count} WEEKLY habits to 0 streak`)

    // MONTHLY: Not completed in the last 30 days + buffer
    const monthBuffer = new Date(now)
    monthBuffer.setDate(monthBuffer.getDate() - 32)

    const monthlyResult = await this.prisma.habit.updateMany({
      where: {
        frequency: 'MONTHLY',
        isArchived: false,
        currentStreak: { gt: 0 },
        OR: [
          { lastCompletedAt: { lt: monthBuffer } },
          { lastCompletedAt: null },
        ],
      },
      data: { currentStreak: 0 },
    })
    this.logger.log(`Reset ${monthlyResult.count} MONTHLY habits to 0 streak`)
  }
}
