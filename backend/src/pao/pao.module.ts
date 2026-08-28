import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaoEntryEntity } from '../entities/pao-entry.entity';
import { PaoService } from './pao.service';
import { PaoController } from './pao.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PaoEntryEntity]), AuthModule],
  controllers: [PaoController],
  providers: [PaoService],
  exports: [PaoService],
})
export class PaoModule {}
