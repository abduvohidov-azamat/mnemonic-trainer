import { Controller, Post, Get, Body, UseGuards, Request, Query } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { EvaluateSessionDto } from './dto/evaluate-session.dto';
import { OptionalJwtGuard } from '../auth/optional-jwt.guard';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @UseGuards(OptionalJwtGuard)
  @Post('evaluate')
  async evaluateAndSave(@Request() req: any, @Body() dto: EvaluateSessionDto) {
    const userId = req.user?.id;
    return this.sessionsService.saveSession(dto, userId);
  }

  @UseGuards(OptionalJwtGuard)
  @Get('history')
  async getHistory(@Request() req: any, @Query('limit') limit?: string) {
    const userId = req.user?.id;
    const parsedLimit = limit ? parseInt(limit, 10) : 20;
    return this.sessionsService.getHistory(userId, parsedLimit);
  }

  @UseGuards(OptionalJwtGuard)
  @Get('stats')
  async getStats(@Request() req: any) {
    const userId = req.user?.id;
    return this.sessionsService.getStats(userId);
  }
}
