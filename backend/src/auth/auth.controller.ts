import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard, OptionalJwtGuard } from './optional-jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('guest')
  async createGuest() {
    return this.authService.createGuestUser();
  }

  @UseGuards(OptionalJwtGuard)
  @Post('register')
  async register(@Body() dto: RegisterDto, @Request() req: any) {
    const currentUserId = req.user?.id;
    return this.authService.register(dto, currentUserId);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }
}
