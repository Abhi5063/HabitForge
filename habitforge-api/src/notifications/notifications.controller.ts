import { Controller, Get, Put, Post, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request } from 'express';
import type { JwtUser } from '../auth/strategies/jwt.strategy';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly service: NotificationsService) {}

    @Get()
    async getNotifications(@Req() req: Request & { user: JwtUser }) {
        return this.service.getNotifications(req.user.userId);
    }

    @Put('read-all')
    async markAllRead(@Req() req: Request & { user: JwtUser }) {
        await this.service.markAllRead(req.user.userId);
        return { success: true };
    }

    @Put(':id/read')
    async markRead(@Req() req: Request & { user: JwtUser }, @Param('id') id: string) {
        await this.service.markRead(req.user.userId, id);
        return { success: true };
    }

    @Post('subscribe')
    async subscribe(@Req() req: Request & { user: JwtUser }, @Body() subscription: any) {
        return this.service.savePushSubscription(req.user.userId, subscription);
    }
}
