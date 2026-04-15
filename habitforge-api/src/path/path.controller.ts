import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { PathService } from './path.service';
import { CreatePathDto } from './dto/create-path.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request } from 'express';
import type { JwtUser } from '../auth/strategies/jwt.strategy';

@UseGuards(JwtAuthGuard)
@Controller('paths')
export class PathController {
  constructor(private readonly pathService: PathService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async createPath(@Req() req: Request & { user: JwtUser }, @Body() dto: CreatePathDto) {
    return this.pathService.createPath(req.user.userId, dto);
  }

  @Get()
  async getMyPaths(@Req() req: Request & { user: JwtUser }) {
    return this.pathService.getMyPaths(req.user.userId);
  }

  @Get(':id')
  async getPathDetail(@Req() req: Request & { user: JwtUser }, @Param('id') id: string) {
    return this.pathService.getPathDetail(req.user.userId, id);
  }

  @Get(':id/today')
  async getTodayTask(@Req() req: Request & { user: JwtUser }, @Param('id') id: string) {
    return this.pathService.getTodayTask(req.user.userId, id);
  }

  @Put(':id/tasks/:taskId/complete')
  async completeTask(
    @Req() req: Request & { user: JwtUser },
    @Param('id') pathId: string,
    @Param('taskId') taskId: string,
    @Body() dto: any
  ) {
    return this.pathService.completeTask(req.user.userId, pathId, taskId, dto);
  }

  @Put(':id/pause')
  async pausePath(@Req() req: Request & { user: JwtUser }, @Param('id') id: string) {
    return this.pathService.pausePath(req.user.userId, id);
  }

  @Put(':id/resume')
  async resumePath(@Req() req: Request & { user: JwtUser }, @Param('id') id: string) {
    return this.pathService.resumePath(req.user.userId, id);
  }

  @Delete(':id')
  async abandonPath(@Req() req: Request & { user: JwtUser }, @Param('id') id: string) {
    return this.pathService.abandonPath(req.user.userId, id);
  }

  @Get(':id/progress')
  async getPathProgress(@Req() req: Request & { user: JwtUser }, @Param('id') id: string) {
    return this.pathService.getPathProgress(req.user.userId, id);
  }
}
