import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as webpush from 'web-push';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly config: ConfigService
    ) {
        const vapidPublic = this.config.get<string>('VAPID_PUBLIC_KEY');
        const vapidPrivate = this.config.get<string>('VAPID_PRIVATE_KEY');
        const vapidSubject = this.config.get<string>('VAPID_SUBJECT', 'mailto:admin@habitforge.app');

        if (vapidPublic && vapidPrivate) {
            webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate);
        } else {
            this.logger.warn('VAPID keys not configured. Web push will not work.');
        }
    }

    async getNotifications(userId: string) {
        // Fetch 50 unread and 50 read
        const [unread, read] = await Promise.all([
            this.prisma.userNotification.findMany({
                where: { userId, isRead: false },
                orderBy: { createdAt: 'desc' },
                take: 50
            }),
            this.prisma.userNotification.findMany({
                where: { userId, isRead: true },
                orderBy: { createdAt: 'desc' },
                take: 50
            })
        ]);

        return { unread, read };
    }

    async markRead(userId: string, notificationId: string) {
        return this.prisma.userNotification.updateMany({
            where: { id: notificationId, userId },
            data: { isRead: true }
        });
    }

    async markAllRead(userId: string) {
        return this.prisma.userNotification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });
    }

    async savePushSubscription(userId: string, subscription: any) {
        // Check if endpoint exists
        const existing = await this.prisma.pushSubscription.findUnique({
            where: { endpoint: subscription.endpoint }
        });

        if (existing) {
            if (existing.userId !== userId) {
                return this.prisma.pushSubscription.update({
                    where: { id: existing.id },
                    data: { userId }
                });
            }
            return existing;
        }

        return this.prisma.pushSubscription.create({
            data: {
                userId,
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth
            }
        });
    }

    async sendPush(userId: string, title: string, body: string, data?: any) {
        const subs = await this.prisma.pushSubscription.findMany({
            where: { userId }
        });

        const payload = JSON.stringify({ title, body, data });

        const pushPromises = subs.map(async (sub) => {
            const pushSub = {
                endpoint: sub.endpoint,
                keys: { p256dh: sub.p256dh, auth: sub.auth }
            };
            try {
                await webpush.sendNotification(pushSub, payload);
            } catch (error: any) {
                if (error.statusCode === 410 || error.statusCode === 404) {
                    // Subscription expired or invalid - clean up
                    await this.prisma.pushSubscription.delete({ where: { id: sub.id } });
                } else {
                    this.logger.error(`Push error: ${error.message}`);
                }
            }
        });

        await Promise.allSettled(pushPromises);
    }
}
