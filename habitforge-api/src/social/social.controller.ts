import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { SocialService } from './social.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateGroupDto } from './dto/create-group.dto';
import type { Request } from 'express';
import type { JwtUser } from '../auth/strategies/jwt.strategy';

@UseGuards(JwtAuthGuard)
@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Get('leaderboard/global')
  async getGlobalLeaderboard(
      @Req() req: Request & { user: JwtUser },
      @Query('page') page: string = '1',
      @Query('limit') limit: string = '25'
  ) {
      return this.socialService.getGlobalLeaderboard(req.user.userId, parseInt(page, 10), parseInt(limit, 10));
  }

  @Get('leaderboard/friends')
  async getFriendsLeaderboard(@Req() req: Request & { user: JwtUser }) {
      return this.socialService.getFriendsLeaderboard(req.user.userId);
  }

  @Get('friends')
  async getFriends(@Req() req: Request & { user: JwtUser }) {
      return this.socialService.getFriends(req.user.userId);
  }

  @Get('friends/requests')
  async getPendingRequests(@Req() req: Request & { user: JwtUser }) {
      return this.socialService.getPendingRequests(req.user.userId);
  }

  @Post('friends/request')
  async sendRequest(@Req() req: Request & { user: JwtUser }, @Body('username') username: string) {
      return this.socialService.sendFriendRequest(req.user.userId, username);
  }

  @Put('friends/request/:id')
  async respondToRequest(
      @Req() req: Request & { user: JwtUser }, 
      @Param('id') id: string, 
      @Body('action') action: 'accept' | 'decline'
  ) {
      return this.socialService.respondToRequest(req.user.userId, id, action);
  }

  @Delete('friends/:id')
  async removeFriend(@Req() req: Request & { user: JwtUser }, @Param('id') id: string) {
      return this.socialService.removeFriend(req.user.userId, id);
  }

  @Get('users/search')
  async searchUsers(@Req() req: Request & { user: JwtUser }, @Query('query') query: string) {
      if (!query || query.length < 2) return [];
      return this.socialService.searchUsers(query, req.user.userId);
  }

  @Post('groups')
  async createGroup(@Req() req: Request & { user: JwtUser }, @Body() dto: CreateGroupDto) {
      return this.socialService.createGroup(req.user.userId, dto);
  }

  @Get('groups')
  async getMyGroups(@Req() req: Request & { user: JwtUser }) {
      return this.socialService.getMyGroups(req.user.userId);
  }

  @Get('groups/:id')
  async getGroupDetail(@Param('id') id: string) {
      return this.socialService.getGroupDetail(id);
  }

  @Post('groups/:id/join')
  async joinGroup(@Req() req: Request & { user: JwtUser }, @Param('id') id: string) {
      return this.socialService.joinGroup(req.user.userId, id);
  }

  @Delete('groups/:id/leave')
  async leaveGroup(@Req() req: Request & { user: JwtUser }, @Param('id') id: string) {
      return this.socialService.leaveGroup(req.user.userId, id);
  }

  @Post('groups/:id/invite')
  async inviteToGroup(
      @Req() req: Request & { user: JwtUser }, 
      @Param('id') id: string, 
      @Body('inviteeId') inviteeId: string
  ) {
      return this.socialService.inviteToGroup(req.user.userId, id, inviteeId);
  }
}
