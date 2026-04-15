import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';
import { Habit, PathPlan, PathTask } from '@prisma/client';

export interface DashboardSummary {
  todayHabits: { total: number; completed: number; percentage: number };
  weekHabits: { total: number; completed: number; percentage: number };
  currentStreaks: { habit: Habit; streak: number }[];
  xpToday: number;
  xpThisWeek: number;
  xpThisMonth: number;
  level: number;
  levelProgressPercent: number;
  xpToNextLevel: number;
  totalXP: number;
  recentBadges: any[]; // UserBadge with Badge joined
  activePaths: { path: PathPlan; todayTask: PathTask | null }[];
  motivationalQuote: { text: string; author: string };
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private quoteCache: Map<string, { text: string; author: string }> = new Map();

  private readonly fallbackQuotes = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Small daily improvements are the key to staggering long-term results.", author: "Unknown" },
    { text: "A habit cannot be tossed out the window; it must be coaxed down the stairs a step at a time.", author: "Mark Twain" },
    { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
    { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant" },
    { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
    { text: "Depending on what they are, our habits will either make us or break us. We become what we repeatedly do.", author: "Sean Covey" },
    { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
    { text: "Chains of habit are too light to be felt until they are too heavy to be broken.", author: "Warren Buffett" },
    { text: "First we make our habits, then our habits make us.", author: "Charles C. Noble" },
    { text: "If you want to change your world, you need to start cultivating good habits.", author: "Mina Parker" },
    { text: "Successful people are simply those with successful habits.", author: "Brian Tracy" },
    { text: "Good habits form; bad habits we fall into.", author: "Charles Koch" },
    { text: "Your net worth to the world is usually determined by what remains after your bad habits are subtracted from your good ones.", author: "Benjamin Franklin" },
    { text: "Habits change into character.", author: "Ovid" },
    { text: "Greatness is nothing more than the conscious pursuit of daily habits.", author: "Unknown" },
    { text: "It is easier to prevent bad habits than to break them.", author: "Benjamin Franklin" },
    { text: "You leave old habits behind by starting out with the thought, 'I release the need for this in my life'.", author: "Wayne Dyer" },
    { text: "Every action you take is a vote for the type of person you wish to become.", author: "James Clear" },
    { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" }
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly gamification: GamificationService
  ) {}

  // Helpers for exact date ranges
  private startOfDay(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private startOfYear(year: number) {
    return new Date(year, 0, 1);
  }

  private addDays(date: Date, days: number) {
    const res = new Date(date);
    res.setDate(res.getDate() + days);
    return res;
  }

  private toISODate(d: Date) {
      return d.toISOString().split('T')[0];
  }

  async getMotivationalQuote(userId: string): Promise<{ text: string; author: string }> {
    const todayStr = this.toISODate(new Date());
    const cacheKey = `${userId}_${todayStr}`;
    
    if (this.quoteCache.has(cacheKey)) {
        return this.quoteCache.get(cacheKey)!;
    }

    const randomIndex = Math.floor(Math.random() * this.fallbackQuotes.length);
    const quote = this.fallbackQuotes[randomIndex];
    this.quoteCache.set(cacheKey, quote);
    
    // In-memory cache cleanup (just clear all when size is getting big, realistically could just use pure random)
    if (this.quoteCache.size > 5000) this.quoteCache.clear();
    
    return quote;
  }

  async getDashboardSummary(userId: string): Promise<DashboardSummary> {
    const now = new Date();
    const today = this.startOfDay(now);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
            habits: { where: { isArchived: false } },
            userBadges: { 
                include: { badge: true },
                orderBy: { unlockedAt: 'desc' },
                take: 3
            },
            pathPlans: {
                where: { status: 'ACTIVE' },
                include: {
                    tasks: true
                }
            }
        }
    });

    if (!user) throw new Error('User not found');

    const habitCompletionsThisMonth = await this.prisma.habitCompletion.findMany({
        where: { userId, completedAt: { gte: startOfMonth } },
        select: { completedAt: true, xpEarned: true }
    });

    const pathCompletionsThisMonth = await this.prisma.pathTaskCompletion.findMany({
        where: { userId, doneAt: { gte: startOfMonth } },
        select: { doneAt: true, xpEarned: true }
    });

    // Metric Calculations
    let xpToday = 0;
    let xpThisWeek = 0;
    let xpThisMonth = 0;

    let todayHabitCount = 0;
    let todayHabitCompleted = 0;

    const completedHabitIdsToday = new Set<string>();

    habitCompletionsThisMonth.forEach(h => {
        xpThisMonth += h.xpEarned;
        if (h.completedAt >= startOfWeek) xpThisWeek += h.xpEarned;
        if (h.completedAt >= today) {
            xpToday += h.xpEarned;
            // Since we're tracking purely count for today
        }
    });

    pathCompletionsThisMonth.forEach(p => {
        xpThisMonth += p.xpEarned;
        if (p.doneAt >= startOfWeek) xpThisWeek += p.xpEarned;
        if (p.doneAt >= today) xpToday += p.xpEarned;
    });

    // Populate active habits tracking
    const currentStreaks = user.habits
        .filter(h => h.currentStreak > 0)
        .map(h => ({ habit: h, streak: h.currentStreak }))
        .sort((a, b) => b.streak - a.streak);

    user.habits.forEach(h => {
        // Daily habits frequency check
        if (h.frequency === 'DAILY') {
            todayHabitCount++;
            if (h.lastCompletedAt && h.lastCompletedAt >= today) {
                todayHabitCompleted++;
            }
        }
    });

    // Weekly habits tracking
    const thirtyDaysAgo = this.addDays(today, -30);
    const recentWeekCompletions = await this.prisma.habitCompletion.count({
        where: { userId, completedAt: { gte: startOfWeek } }
    });

    const totalActiveExpectedWeekly = user.habits.filter(h => h.frequency === 'DAILY').length * 7 
                                    + user.habits.filter(h => h.frequency === 'WEEKLY').length;

    // Active path parsing
    const activePaths = user.pathPlans.map(plan => {
        const todayTask = plan.tasks.find(t => t.dayNumber === plan.currentDay) || null;
        return { path: plan, todayTask };
    });

    const stats = await this.gamification.getUserStats(userId);

    return {
        todayHabits: {
            total: todayHabitCount,
            completed: todayHabitCompleted,
            percentage: todayHabitCount === 0 ? 0 : Math.floor((todayHabitCompleted / todayHabitCount) * 100)
        },
        weekHabits: {
            total: totalActiveExpectedWeekly,
            completed: recentWeekCompletions,
            percentage: totalActiveExpectedWeekly === 0 ? 0 : Math.floor((recentWeekCompletions / totalActiveExpectedWeekly) * 100)
        },
        currentStreaks,
        xpToday,
        xpThisWeek,
        xpThisMonth,
        level: stats.level,
        levelProgressPercent: stats.levelProgressPercent,
        xpToNextLevel: stats.nextLevelXP - stats.totalXP, // relative remaining XP
        totalXP: stats.totalXP,
        recentBadges: user.userBadges,
        activePaths,
        motivationalQuote: await this.getMotivationalQuote(userId)
    };
  }

  async getHeatmapData(userId: string, year: number): Promise<{ date: string; count: number; xp: number }[]> {
      const start = this.startOfYear(year);
      const end = this.addDays(this.startOfYear(year + 1), -1);

      const completions = await this.prisma.habitCompletion.findMany({
          where: {
              userId,
              completedAt: { gte: start, lte: end }
          },
          select: { completedAt: true, xpEarned: true }
      });

      const map = new Map<string, { count: number; xp: number }>();

      completions.forEach(c => {
          const dStr = this.toISODate(c.completedAt);
          const current = map.get(dStr) || { count: 0, xp: 0 };
          map.set(dStr, { count: current.count + 1, xp: current.xp + c.xpEarned });
      });

      return Array.from(map.entries()).map(([date, data]) => ({
          date,
          count: data.count,
          xp: data.xp
      })).sort((a, b) => a.date.localeCompare(b.date));
  }

  async getCompletionChart(userId: string, days: number): Promise<{ date: string; completionCount: number; xpEarned: number; habitsTotal: number }[]> {
      const start = this.addDays(this.startOfDay(), -days);
      
      const completions = await this.prisma.habitCompletion.findMany({
          where: { userId, completedAt: { gte: start } },
          select: { completedAt: true, xpEarned: true }
      });

      const activeHabitsCount = await this.prisma.habit.count({
          where: { userId, isArchived: false }
      });

      const map = new Map<string, { count: number; xp: number }>();
      
      // Initialize zero-days
      for(let i=0; i<days; i++) {
          map.set(this.toISODate(this.addDays(start, i)), { count: 0, xp: 0 });
      }

      completions.forEach(c => {
          const dStr = this.toISODate(c.completedAt);
          if (map.has(dStr)) {
              const current = map.get(dStr)!;
              current.count++;
              current.xp += c.xpEarned;
          }
      });

      return Array.from(map.entries()).map(([date, data]) => ({
          date,
          completionCount: data.count,
          xpEarned: data.xp,
          habitsTotal: activeHabitsCount
      })).sort((a, b) => a.date.localeCompare(b.date));
  }

  async getHabitBreakdown(userId: string) {
      const thirtyDaysAgo = this.addDays(this.startOfDay(), -30);

      const habits = await this.prisma.habit.findMany({
          where: { userId, isArchived: false, createdAt: { lte: new Date() } },
          include: {
              completions: {
                  where: { completedAt: { gte: thirtyDaysAgo } },
                  select: { id: true }
              }
          }
      });

      return habits.map(h => {
          // Time since creation max 30 days
          const daysSinceCreate = Math.max(1, Math.min(30, Math.ceil((new Date().getTime() - h.createdAt.getTime()) / (1000 * 3600 * 24))));
          const completionsCount = h.completions.length;
          
          let rate = 0;
          if (h.frequency === 'DAILY') {
              rate = Math.floor((completionsCount / daysSinceCreate) * 100);
          } else if (h.frequency === 'WEEKLY') {
              const expected = Math.max(1, Math.ceil(daysSinceCreate / 7));
              rate = Math.floor((completionsCount / expected) * 100);
          } else {
              rate = completionsCount > 0 ? 100 : 0;
          }

          return {
              habitId: h.id,
              title: h.title,
              icon: h.icon,
              color: h.color,
              completionRatePercentage: Math.min(100, rate),
              completionsCount,
              totalDays: daysSinceCreate
          };
      });
  }

  async getXPHistory(userId: string, days: number) {
      const start = this.addDays(this.startOfDay(), -days);

      const [habitComps, pathComps] = await Promise.all([
          this.prisma.habitCompletion.findMany({
              where: { userId, completedAt: { gte: start } },
              select: { completedAt: true, xpEarned: true }
          }),
          this.prisma.pathTaskCompletion.findMany({
              where: { userId, doneAt: { gte: start } },
              select: { doneAt: true, xpEarned: true }
          })
      ]);

      const map = new Map<string, { habitXP: number; pathXP: number; totalXP: number }>();
      
      for(let i=0; i<days; i++) {
        map.set(this.toISODate(this.addDays(start, i)), { habitXP: 0, pathXP: 0, totalXP: 0 });
      }

      habitComps.forEach(h => {
          const dStr = this.toISODate(h.completedAt);
          if (map.has(dStr)) {
              const current = map.get(dStr)!;
              current.habitXP += h.xpEarned;
              current.totalXP += h.xpEarned;
          }
      });

      pathComps.forEach(p => {
          const dStr = this.toISODate(p.doneAt);
          if (map.has(dStr)) {
              const current = map.get(dStr)!;
              current.pathXP += p.xpEarned;
              current.totalXP += p.xpEarned;
          }
      });

      return Array.from(map.entries()).map(([date, data]) => ({
          date,
          ...data
      })).sort((a, b) => a.date.localeCompare(b.date));
  }

  async getStreakHistory(userId: string, habitId: string) {
      // Returns completions grouped into sequential streak chains
      const completions = await this.prisma.habitCompletion.findMany({
          where: { userId, habitId },
          orderBy: { completedAt: 'asc' },
          select: { completedAt: true, streakDay: true }
      });

      if (completions.length === 0) return [];

      const streaks: any[] = [];
      let currentChain: any = null;

      for (let i = 0; i < completions.length; i++) {
          const c = completions[i];
          if (c.streakDay === 1) {
              if (currentChain) streaks.push(currentChain);
              currentChain = { startDate: this.toISODate(c.completedAt), endDate: this.toISODate(c.completedAt), length: 1 };
          } else if (currentChain) {
              currentChain.endDate = this.toISODate(c.completedAt);
              currentChain.length = c.streakDay;
          }
      }
      if (currentChain) streaks.push(currentChain);

      // Return top 5 largest streaks for this habit
      return streaks.sort((a, b) => b.length - a.length).slice(0, 5);
  }
}
