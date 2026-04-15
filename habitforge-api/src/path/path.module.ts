import { Module } from '@nestjs/common';
import { PathService } from './path.service';
import { PathController } from './path.controller';
import { GeminiService } from './gemini.service';
import { GamificationModule } from '../gamification/gamification.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, PrismaModule, GamificationModule],
  providers: [PathService, GeminiService],
  controllers: [PathController],
  exports: [PathService]
})
export class PathModule {}
