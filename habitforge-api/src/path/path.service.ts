import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from './gemini.service';
import { CreatePathDto } from './dto/create-path.dto';
import { GamificationService } from '../gamification/gamification.service';
import { PathPlan, PathTask } from '@prisma/client';

export interface TaskCompletionResult {
  xpEarned: number;
  newTotalXP: number;
  leveledUp: boolean;
  newLevel: number;
  newBadges: any[];
  pathCompleted: boolean;
}

@Injectable()
export class PathService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gemini: GeminiService,
    private readonly gamification: GamificationService
  ) {}

  async createPath(userId: string, dto: CreatePathDto) {
    const curriculum = await this.gemini.generateCurriculum(
      dto.goal,
      dto.durationDays,
      dto.dailyMinutes,
      dto.currentLevel,
      dto.additionalContext
    );

    const pathPlan = await this.prisma.pathPlan.create({
      data: {
        userId,
        title: curriculum.title,
        goal: dto.goal,
        durationDays: dto.durationDays,
        dailyMinutes: dto.dailyMinutes,
        geminiPrompt: `Goal: ${dto.goal}, Level: ${dto.currentLevel}, Context: ${dto.additionalContext}`,
        status: 'ACTIVE',
        currentDay: 1,
        totalXP: 0,
      }
    });

    const taskData = curriculum.tasks.map(t => ({
      pathId: pathPlan.id,
      dayNumber: t.dayNumber,
      weekNumber: t.weekNumber,
      title: t.title,
      description: t.description,
      resources: t.resources as any,
      xpReward: t.xpReward,
      estimatedMinutes: t.estimatedMinutes,
      taskType: t.taskType,
    }));

    await this.prisma.pathTask.createMany({
      data: taskData
    });

    return { pathPlan, taskCount: taskData.length };
  }

  async getMyPaths(userId: string): Promise<PathPlan[]> {
    return this.prisma.pathPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getPathDetail(userId: string, pathId: string) {
    const path = await this.prisma.pathPlan.findUnique({
      where: { id: pathId },
      include: {
        tasks: { orderBy: { dayNumber: 'asc' } },
        completions: true
      }
    });
    if (!path) throw new NotFoundException('Path not found');
    if (path.userId !== userId) throw new ForbiddenException('Not authorized');
    return path;
  }

  async getTodayTask(userId: string, pathId: string): Promise<PathTask | null> {
    const path = await this.getPathDetail(userId, pathId);
    if (path.status !== 'ACTIVE') return null;
    return path.tasks.find(t => t.dayNumber === path.currentDay) || null;
  }

  async completeTask(userId: string, pathId: string, taskId: string, dto: any): Promise<TaskCompletionResult> {
    const path = await this.prisma.pathPlan.findUnique({ where: { id: pathId } });
    if (!path) throw new NotFoundException('Path not found');
    if (path.userId !== userId) throw new ForbiddenException('Not authorized');

    const task = await this.prisma.pathTask.findUnique({ where: { id: taskId } });
    if (!task || task.pathId !== path.id) throw new NotFoundException('Task not found in this path');

    const existing = await this.prisma.pathTaskCompletion.findUnique({
      where: { taskId_userId: { taskId, userId } }
    });
    if (existing) throw new ConflictException('Task already completed');

    const userBefore = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userBefore) throw new NotFoundException('User not found');

    const { xpReward } = task;

    await this.prisma.$transaction([
      this.prisma.pathTaskCompletion.create({
        data: {
          taskId,
          pathId,
          userId,
          xpEarned: xpReward,
          note: dto.note || '',
          rating: dto.rating || 5
        }
      }),
      this.prisma.pathPlan.update({
        where: { id: pathId },
        data: {
          currentDay: path.currentDay + 1,
          totalXP: path.totalXP + xpReward,
          status: (path.currentDay + 1 > path.durationDays) ? 'COMPLETED' : path.status,
          completedAt: (path.currentDay + 1 > path.durationDays) ? new Date() : null
        }
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { totalXP: userBefore.totalXP + xpReward }
      })
    ]);

    // Manually run gamification checks
    const userAfter = await this.prisma.user.findUnique({ where: { id: userId } });
    const newLevel = Math.floor(Math.sqrt((userAfter?.totalXP || 0) / 100)); // getLevelFromXP
    const leveledUp = newLevel > userBefore.currentLevel;

    if (leveledUp) {
      await this.prisma.user.update({ where: { id: userId }, data: { currentLevel: newLevel } });
      await this.prisma.userNotification.create({
        data: { userId, type: 'LEVEL_UP', title: 'Level Up!', body: `You are now Level ${newLevel}!`, data: { newLevel } }
      });
    }

    const newBadges = await this.gamification.evaluateBadges(userId);
    const pathCompleted = (path.currentDay + 1 > path.durationDays);

    return {
      xpEarned: xpReward,
      newTotalXP: userAfter?.totalXP || 0,
      leveledUp,
      newLevel,
      newBadges,
      pathCompleted
    };
  }

  async pausePath(userId: string, pathId: string) {
    await this.getPathDetail(userId, pathId);
    return this.prisma.pathPlan.update({ where: { id: pathId }, data: { status: 'PAUSED' } });
  }

  async resumePath(userId: string, pathId: string) {
    await this.getPathDetail(userId, pathId);
    return this.prisma.pathPlan.update({ where: { id: pathId }, data: { status: 'ACTIVE' } });
  }

  async abandonPath(userId: string, pathId: string) {
    await this.getPathDetail(userId, pathId);
    return this.prisma.pathPlan.update({ where: { id: pathId }, data: { status: 'ABANDONED' } });
  }

  async getPathProgress(userId: string, pathId: string) {
    const path = await this.getPathDetail(userId, pathId);
    const pct = Math.floor(((path.currentDay - 1) / path.durationDays) * 100);
    return {
      percentComplete: pct,
      xpEarned: path.totalXP,
      daysRemaining: path.durationDays - (path.currentDay - 1)
    };
  }
}
