import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
    imports: [PrismaModule, GamificationModule],
    providers: [AnalyticsService],
    controllers: [AnalyticsController],
    exports: [AnalyticsService]
})
export class AnalyticsModule {}
