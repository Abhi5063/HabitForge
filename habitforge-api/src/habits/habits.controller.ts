import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common'
import { HabitsService } from './habits.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateHabitDto } from './dto/create-habit.dto'
import { UpdateHabitDto } from './dto/update-habit.dto'
import { CompleteHabitDto } from './dto/complete-habit.dto'
import type { Request } from 'express'
import type { JwtUser } from '../auth/strategies/jwt.strategy'

@UseGuards(JwtAuthGuard)
@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get('today')
  async getTodayStatus(@Req() req: Request & { user: JwtUser }) {
    return this.habitsService.getTodayStatus(req.user.userId)
  }

  @Get()
  async findAll(@Req() req: Request & { user: JwtUser }) {
    return this.habitsService.findAll(req.user.userId)
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: Request & { user: JwtUser },
  ) {
    return this.habitsService.findOne(req.user.userId, id)
  }

  @Post()
  async create(
    @Body() dto: CreateHabitDto,
    @Req() req: Request & { user: JwtUser },
  ) {
    return this.habitsService.create(req.user.userId, dto)
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateHabitDto,
    @Req() req: Request & { user: JwtUser },
  ) {
    return this.habitsService.update(req.user.userId, id, dto)
  }

  @Put(':id/complete')
  async completeHabit(
    @Param('id') id: string,
    @Body() dto: Partial<CompleteHabitDto>,
    @Req() req: Request & { user: JwtUser },
  ) {
    const fullDto: CompleteHabitDto = { habitId: id, note: dto.note }
    return this.habitsService.completeHabit(req.user.userId, fullDto)
  }

  @Put(':id/archive')
  async archive(
    @Param('id') id: string,
    @Req() req: Request & { user: JwtUser },
  ) {
    return this.habitsService.archive(req.user.userId, id)
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: Request & { user: JwtUser },
  ) {
    return this.habitsService.delete(req.user.userId, id)
  }
}
