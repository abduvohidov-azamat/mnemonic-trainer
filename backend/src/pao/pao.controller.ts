import { Controller, Get, Put, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { PaoService } from './pao.service';
import { UpdatePaoDto } from './dto/update-pao.dto';
import { OptionalJwtGuard, JwtAuthGuard } from '../auth/optional-jwt.guard';

@Controller('pao')
export class PaoController {
  constructor(private readonly paoService: PaoService) {}

  @UseGuards(OptionalJwtGuard)
  @Get()
  async getPaoMatrix(@Request() req: any) {
    const userId = req.user?.id;
    return this.paoService.getAllPao(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':key')
  async updateEntry(@Request() req: any, @Param('key') key: string, @Body() dto: UpdatePaoDto) {
    return this.paoService.updatePao(req.user.id, key, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset')
  async resetToSeed(@Request() req: any) {
    return this.paoService.resetPao(req.user.id);
  }
}
