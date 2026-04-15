import { Controller, Get, Query, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request } from 'express';
import type { JwtUser } from '../auth/strategies/jwt.strategy';

@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}

    @Get('summary')
    async getDashboardSummary(@Req() req: Request & { user: JwtUser }) {
        return this.analyticsService.getDashboardSummary(req.user.userId);
    }

    @Get('heatmap')
    async getHeatmapData(@Req() req: Request & { user: JwtUser }, @Query('year', ParseIntPipe) year: number) {
        return this.analyticsService.getHeatmapData(req.user.userId, year);
    }

    @Get('completion')
    async getCompletionChart(@Req() req: Request & { user: JwtUser }, @Query('days', ParseIntPipe) days: number) {
        return this.analyticsService.getCompletionChart(req.user.userId, days);
    }

    @Get('habits-breakdown')
    async getHabitBreakdown(@Req() req: Request & { user: JwtUser }) {
        return this.analyticsService.getHabitBreakdown(req.user.userId);
    }

    @Get('xp-history')
    async getXPHistory(@Req() req: Request & { user: JwtUser }, @Query('days', ParseIntPipe) days: number) {
        return this.analyticsService.getXPHistory(req.user.userId, days);
    }

    @Get('streak/:habitId')
    async getStreakHistory(@Req() req: Request & { user: JwtUser }, @Param('habitId') habitId: string) {
        return this.analyticsService.getStreakHistory(req.user.userId, habitId);
    }
}
