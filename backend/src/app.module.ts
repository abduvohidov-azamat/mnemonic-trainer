import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserEntity } from './entities/user.entity';
import { SessionEntity } from './entities/session.entity';
import { PaoEntryEntity } from './entities/pao-entry.entity';
import { AuthModule } from './auth/auth.module';
import { PaoModule } from './pao/pao.module';
import { GamesModule } from './games/games.module';
import { SessionsModule } from './sessions/sessions.module';

const entities = [UserEntity, SessionEntity, PaoEntryEntity];

const databaseConfig: TypeOrmModuleOptions = process.env.DATABASE_URL
  ? {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      entities,
      synchronize: true,
    }
  : {
      type: 'sqlite',
      database: process.env.DATABASE_PATH || 'database.sqlite',
      entities,
      synchronize: true,
    };

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 10 }]),
    AuthModule,
    PaoModule,
    GamesModule,
    SessionsModule,
  ],
})
export class AppModule {}
