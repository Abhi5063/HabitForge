import { Module } from '@nestjs/common'
import { HabitsService } from './habits.service'
import { HabitsController } from './habits.controller'
import { StreaksCron } from './streaks.cron'
import { GamificationModule } from '../gamification/gamification.module'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [GamificationModule, PrismaModule],
  controllers: [HabitsController],
  providers: [HabitsService, StreaksCron],
  exports: [HabitsService],
})
export class HabitsModule {}
