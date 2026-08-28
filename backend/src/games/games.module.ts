import { Module } from '@nestjs/common';
import { NumbersService } from './numbers.service';
import { CardsService } from './cards.service';
import { WordsService } from './words.service';
import { GamesController } from './games.controller';

@Module({
  controllers: [GamesController],
  providers: [NumbersService, CardsService, WordsService],
  exports: [NumbersService, CardsService, WordsService],
})
export class GamesModule {}
