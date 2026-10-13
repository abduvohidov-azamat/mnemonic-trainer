import { Injectable, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async createGuestUser(): Promise<{ accessToken: string; user: { id: string; username: string; isGuest: boolean } }> {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const guestUser = this.userRepository.create({
      username: `Athlete_${randomSuffix}`,
      isGuest: true,
    });
    const saved = await this.userRepository.save(guestUser);
    const payload = { sub: saved.id, username: saved.username, isGuest: true };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: saved.id,
        username: saved.username,
        isGuest: true,
      },
    };
  }

  async register(dto: RegisterDto, currentUserId?: string): Promise<{ accessToken: string; user: Partial<UserEntity> }> {
    const existing = await this.userRepository.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
    });

    if (existing && (!currentUserId || existing.id !== currentUserId)) {
      throw new ConflictException('Email or username is already taken');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    let user: UserEntity;
    if (currentUserId) {
      // Upgrade guest account to permanent account
      const current = await this.userRepository.findOne({ where: { id: currentUserId } });
      if (current && current.isGuest) {
        current.username = dto.username;
        current.email = dto.email;
        current.passwordHash = passwordHash;
        current.isGuest = false;
        user = await this.userRepository.save(current);
      }
    }

    if (!user) {
      user = this.userRepository.create({
        username: dto.username,
        email: dto.email,
        passwordHash,
        isGuest: false,
      });
      user = await this.userRepository.save(user);
    }

    const payload = { sub: user.id, username: user.username, isGuest: false };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isGuest: false,
      },
    };
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; user: Partial<UserEntity> }> {
    const user = await this.userRepository.findOne({
      where: [{ email: dto.identifier }, { username: dto.identifier }],
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username, isGuest: false };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isGuest: false,
      },
    };
  }

  async getProfile(userId: string): Promise<Partial<UserEntity>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      isGuest: user.isGuest,
    };
  }
}
