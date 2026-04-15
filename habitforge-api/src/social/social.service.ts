import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { DUMMY_LEADERBOARD_USERS, LeaderboardUser } from '../common/constants';
import { Group, Friendship } from '@prisma/client';

export interface LeaderboardEntry extends LeaderboardUser {
    rank: number;
    isCurrentUser?: boolean;
}

@Injectable()
export class SocialService {
  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // FRIENDSHIP METHODS
  // ==========================================

  async sendFriendRequest(requesterId: string, addresseeUsername: string) {
    const addressee = await this.prisma.user.findUnique({ where: { username: addresseeUsername } });
    if (!addressee) throw new NotFoundException('User not found');
    if (addressee.id === requesterId) throw new ConflictException('Cannot send friend request to yourself');

    const existing = await this.prisma.friendship.findFirst({
        where: {
            OR: [
                { requesterId, addresseeId: addressee.id },
                { requesterId: addressee.id, addresseeId: requesterId }
            ]
        }
    });

    if (existing) {
        throw new ConflictException(`Friendship status: ${existing.status}`);
    }

    const friendship = await this.prisma.friendship.create({
        data: { requesterId, addresseeId: addressee.id, status: 'PENDING' }
    });

    await this.prisma.userNotification.create({
        data: {
            userId: addressee.id,
            type: 'FRIEND_REQUEST',
            title: 'New Friend Request',
            body: 'You have received a new friend request',
            data: { friendshipId: friendship.id, requesterId }
        }
    });

    return friendship;
  }

  async respondToRequest(userId: string, friendshipId: string, action: 'accept' | 'decline') {
      const friendship = await this.prisma.friendship.findUnique({ where: { id: friendshipId } });
      if (!friendship) throw new NotFoundException('Friendship request not found');
      if (friendship.addresseeId !== userId) throw new ForbiddenException('Not authorized');
      if (friendship.status !== 'PENDING') throw new ConflictException('Request already processed');

      if (action === 'decline') {
          await this.prisma.friendship.update({ where: { id: friendshipId }, data: { status: 'DECLINED' } });
      } else {
          await this.prisma.friendship.update({ where: { id: friendshipId }, data: { status: 'ACCEPTED' } });
          await this.prisma.userNotification.create({
            data: {
                userId: friendship.requesterId,
                type: 'FRIEND_ACCEPTED',
                title: 'Friend Request Accepted',
                body: 'Your friend request was accepted',
                data: { friendId: userId }
            }
        });
      }
      return { success: true, action };
  }

  async removeFriend(userId: string, friendId: string) {
    const friendship = await this.prisma.friendship.findFirst({
        where: {
            OR: [
                { requesterId: userId, addresseeId: friendId },
                { requesterId: friendId, addresseeId: userId }
            ],
            status: 'ACCEPTED'
        }
    });

    if (!friendship) throw new NotFoundException('Friendship not found');

    await this.prisma.friendship.delete({ where: { id: friendship.id } });
    return { success: true };
  }

  async getFriends(userId: string) {
    const friendships = await this.prisma.friendship.findMany({
        where: {
            OR: [{ requesterId: userId }, { addresseeId: userId }],
            status: 'ACCEPTED'
        },
        include: {
            requester: { select: { id: true, username: true, displayName: true, avatarEmoji: true, totalXP: true, currentLevel: true, longestStreak: true }},
            addressee: { select: { id: true, username: true, displayName: true, avatarEmoji: true, totalXP: true, currentLevel: true, longestStreak: true }}
        }
    });

    return friendships.map(f => f.requesterId === userId ? f.addressee : f.requester);
  }

  async getPendingRequests(userId: string) {
      return this.prisma.friendship.findMany({
          where: { addresseeId: userId, status: 'PENDING' },
          include: {
            requester: { select: { id: true, username: true, displayName: true, avatarEmoji: true }}
          }
      });
  }

  async searchUsers(query: string, currentUserId: string) {
      return this.prisma.user.findMany({
          where: {
              id: { not: currentUserId },
              isPublic: true,
              OR: [
                  { username: { contains: query, mode: 'insensitive' } },
                  { displayName: { contains: query, mode: 'insensitive' } }
              ]
          },
          select: { id: true, username: true, displayName: true, avatarEmoji: true },
          take: 20
      });
  }

  async blockUser(userId: string, targetId: string) {
      // Create or update to BLOCKED
      const existing = await this.prisma.friendship.findFirst({
        where: {
            OR: [
                { requesterId: userId, addresseeId: targetId },
                { requesterId: targetId, addresseeId: userId }
            ]
        }
      });

      if (existing) {
          return this.prisma.friendship.update({ where: { id: existing.id }, data: { status: 'BLOCKED' }});
      } else {
          return this.prisma.friendship.create({ data: { requesterId: userId, addresseeId: targetId, status: 'BLOCKED' }});
      }
  }

  // ==========================================
  // LEADERBOARD METHODS
  // ==========================================

  async getGlobalLeaderboard(userId: string, page: number = 1, limit: number = 25) {
      // Fetch top users
      const realUsers = await this.prisma.user.findMany({
          where: { isPublic: true, showOnLeaderboard: true, totalXP: { gt: 0 } },
          select: { id: true, username: true, displayName: true, avatarEmoji: true, totalXP: true, currentLevel: true, longestStreak: true },
          orderBy: { totalXP: 'desc' },
          take: Math.max(limit * page, 100) // fetch enough to merge with dummies safely
      });

      const mappedRealUsers: LeaderboardUser[] = realUsers.map(u => ({
          id: u.id,
          name: u.displayName,
          avatarEmoji: u.avatarEmoji,
          totalXP: u.totalXP,
          currentLevel: u.currentLevel,
          longestStreak: u.longestStreak,
          isDummy: false
      }));

      const combined = [...mappedRealUsers, ...DUMMY_LEADERBOARD_USERS].sort((a, b) => b.totalXP - a.totalXP);
      
      const ranked: LeaderboardEntry[] = combined.map((u, index) => ({
          ...u,
          rank: index + 1,
          isCurrentUser: u.id === userId
      }));

      let currentUserRank = ranked.find(r => r.id === userId)?.rank || null;

      // Filter to the actual page slice
      const start = (page - 1) * limit;
      const end = start + limit;
      const paged = ranked.slice(start, end);

      return {
          leaderboard: paged,
          currentUserRank,
          total: ranked.length
      };
  }

  async getFriendsLeaderboard(userId: string) {
      const friends = await this.getFriends(userId);
      const currentUser = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!currentUser) throw new NotFoundException('User not found');

      const all = [
          { ...currentUser, isCurrentUser: true },
          ...friends.map(f => ({ ...f, isCurrentUser: false }))
      ];

      all.sort((a, b) => b.totalXP - a.totalXP);

      return all.map((u, index) => ({ ...u, rank: index + 1 }));
  }

  async getGroupLeaderboard(groupId: string) {
      // Find members
      const members = await this.prisma.groupMember.findMany({
          where: { groupId },
          include: { 
              user: { select: { id: true, displayName: true, avatarEmoji: true, totalXP: true, currentLevel: true, longestStreak: true } }
          }
      });

      const sorted = members.map(m => m.user).sort((a, b) => b.totalXP - a.totalXP);
      return sorted.map((u, index) => ({ ...u, rank: index + 1 }));
  }

  // ==========================================
  // GROUP METHODS
  // ==========================================

  async createGroup(userId: string, dto: CreateGroupDto) {
      return this.prisma.$transaction(async (tx) => {
          const group = await tx.group.create({
              data: {
                  ownerId: userId,
                  name: dto.name,
                  description: dto.description || '',
                  icon: dto.icon || '🏆',
                  isPublic: dto.isPublic !== false,
                  targetXP: dto.targetXP || 10000,
                  endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
              }
          });

          await tx.groupMember.create({
              data: {
                  groupId: group.id,
                  userId,
                  role: 'OWNER'
              }
          });

          return group;
      });
  }

  async joinGroup(userId: string, groupId: string) {
      const group = await this.prisma.group.findUnique({ where: { id: groupId }});
      if (!group) throw new NotFoundException('Group not found');
      if (!group.isPublic) throw new ForbiddenException('Group is private');

      const existing = await this.prisma.groupMember.findUnique({
          where: { groupId_userId: { groupId, userId } }
      });

      if (existing) throw new ConflictException('Already a member');

      return this.prisma.groupMember.create({
          data: { groupId, userId, role: 'MEMBER' }
      });
  }

  async leaveGroup(userId: string, groupId: string) {
       const member = await this.prisma.groupMember.findUnique({
          where: { groupId_userId: { groupId, userId } }
      });

      if (!member) throw new NotFoundException('Not a member');
      if (member.role === 'OWNER') throw new ConflictException('Owners cannot leave without transferring or disbanding');

      await this.prisma.groupMember.delete({ where: { id: member.id } });
      return { success: true };
  }

  async getMyGroups(userId: string) {
      const memberships = await this.prisma.groupMember.findMany({
          where: { userId },
          include: { 
              group: {
                  include: {
                      _count: { select: { members: true }}
                  }
              }
          }
      });

      return memberships.map(m => m.group);
  }

  async getGroupDetail(groupId: string) {
      const group = await this.prisma.group.findUnique({
          where: { id: groupId },
          include: {
              members: {
                  include: {
                      user: { select: { id: true, displayName: true, avatarEmoji: true, totalXP: true } }
                  }
              }
          }
      });
      if (!group) throw new NotFoundException('Group not found');
      
      const leaderboard = await this.getGroupLeaderboard(groupId);
      return { ...group, leaderboard };
  }

  async inviteToGroup(userId: string, groupId: string, inviteeId: string) {
      const group = await this.prisma.group.findUnique({ where: { id: groupId }});
      if (!group) throw new NotFoundException('Group not found');

      await this.prisma.userNotification.create({
          data: {
              userId: inviteeId,
              type: 'GROUP_INVITE',
              title: 'Group Invitation',
              body: `You have been invited to join ${group.name}`,
              data: { groupId, inviterId: userId }
          }
      });

      return { success: true };
  }
}
