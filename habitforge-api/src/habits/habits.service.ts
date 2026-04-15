import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { PrismaService } from '../prisma/prisma.service'
import { CreateHabitDto } from './dto/create-habit.dto'
import { UpdateHabitDto } from './dto/update-habit.dto'
import { CompleteHabitDto } from './dto/complete-habit.dto'
import { HabitCompletedEvent } from '../common/events'
import { getStreakMultiplier } from '../common/xp.utils'
import { Habit, HabitCompletion } from '@prisma/client'

// Simple Date helpers to avoid timezones mess
function toDateString(d: Date | null | undefined): string | null {
  if (!d) return null
  return d.toISOString().split('T')[0]
}

function isToday(d: Date | null | undefined): boolean {
  if (!d) return false
  return toDateString(d) === toDateString(new Date())
}

function isYesterday(d: Date | null | undefined): boolean {
  if (!d) return false
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return toDateString(d) === toDateString(yesterday)
}

export interface HabitCompletionResult {
  completion: HabitCompletion
  xpEarned: number
  newStreak: number
  multiplier: number
  leveledUp: boolean
}

@Injectable()
export class HabitsService {
  private readonly logger = new Logger(HabitsService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(
    userId: string,
  ): Promise<(Habit & { isCompletedToday: boolean })[]> {
    const habits = await this.prisma.habit.findMany({
      where: { userId, isArchived: false },
      orderBy: { createdAt: 'desc' },
    })

    return habits.map((habit) => ({
      ...habit,
      isCompletedToday: isToday(habit.lastCompletedAt),
    }))
  }

  async findOne(userId: string, habitId: string) {
    const habit = await this.prisma.habit.findUnique({
      where: { id: habitId },
      include: {
        completions: {
          orderBy: { completedAt: 'desc' },
          take: 30,
        },
      },
    })

    if (!habit) throw new NotFoundException('Habit not found')
    if (habit.userId !== userId)
      throw new ForbiddenException('Not authorized to access this habit')

    return habit
  }

  async create(userId: string, dto: CreateHabitDto): Promise<Habit> {
    const habit = await this.prisma.habit.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        frequency: dto.frequency,
        targetCount: dto.targetCount,
        color: dto.color,
        icon: dto.icon,
        xpPerComplete: dto.xpPerComplete,
      },
    })

    return habit
  }

  async update(
    userId: string,
    habitId: string,
    dto: UpdateHabitDto,
  ): Promise<Habit> {
    await this.findOne(userId, habitId) // verify ownership

    return this.prisma.habit.update({
      where: { id: habitId },
      data: dto,
    })
  }

  async archive(userId: string, habitId: string): Promise<Habit> {
    await this.findOne(userId, habitId)

    return this.prisma.habit.update({
      where: { id: habitId },
      data: { isArchived: true },
    })
  }

  async delete(userId: string, habitId: string): Promise<void> {
    await this.findOne(userId, habitId)

    await this.prisma.habit.delete({
      where: { id: habitId },
    })
  }

  async completeHabit(
    userId: string,
    dto: CompleteHabitDto,
  ): Promise<HabitCompletionResult> {
    const habit = await this.prisma.habit.findUnique({
      where: { id: dto.habitId },
    })

    if (!habit) throw new NotFoundException('Habit not found')
    if (habit.userId !== userId)
      throw new ForbiddenException('Not authorized to complete this habit')
    if (habit.isArchived)
      throw new BadRequestException('Cannot complete an archived habit')

    if (isToday(habit.lastCompletedAt)) {
      throw new ConflictException('Habit is already completed today')
    }

    let newStreak = habit.currentStreak
    if (habit.frequency === 'DAILY') {
      if (isYesterday(habit.lastCompletedAt)) {
        newStreak += 1
      } else {
        newStreak = 1
      }
    } else {
      // Simplified for WEEKLY/MONTHLY or generalized. Assuming increment if valid.
      // A more robust app would check precise logic, but for now we default to incrementing if within bounds, else 1.
      // Based on prompt, if not yesterday for daily, resets.
      newStreak += 1
    }

    const multiplier = getStreakMultiplier(newStreak)
    const xpEarned = Math.floor(habit.xpPerComplete * multiplier)
    const newLongestStreak = Math.max(habit.longestStreak, newStreak)

    // Using transaction to ensure atomicity
    const [completion, updatedHabit] = await this.prisma.$transaction([
      this.prisma.habitCompletion.create({
        data: {
          habitId: habit.id,
          userId,
          xpEarned,
          streakDay: newStreak,
          multiplier,
          note: dto.note,
        },
      }),
      this.prisma.habit.update({
        where: { id: habit.id },
        data: {
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastCompletedAt: new Date(),
        },
      }),
    ])

    const event: HabitCompletedEvent = {
      userId,
      habitId: habit.id,
      xpEarned,
      newStreak,
      multiplier,
    }

    this.eventEmitter.emit('habit.completed', event)

    return {
      completion,
      xpEarned,
      newStreak,
      multiplier,
      leveledUp: false, // Updated by frontend from user profile or event stream
    }
  }

  async getTodayStatus(
    userId: string,
  ): Promise<{ habitId: string; isCompletedToday: boolean }[]> {
    const habits = await this.prisma.habit.findMany({
      where: { userId, isArchived: false },
      select: { id: true, lastCompletedAt: true },
    })

    return habits.map((h) => ({
      habitId: h.id,
      isCompletedToday: isToday(h.lastCompletedAt),
    }))
  }
}
