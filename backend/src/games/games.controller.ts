import { Controller, Post, Body } from '@nestjs/common';
import { NumbersService } from './numbers.service';
import { CardsService } from './cards.service';
import { WordsService } from './words.service';

@Controller('games')
export class GamesController {
  constructor(
    private readonly numbersService: NumbersService,
    private readonly cardsService: CardsService,
    private readonly wordsService: WordsService,
  ) {}

  @Post('numbers/generate')
  generateNumbers(@Body() body: { count?: number; chunkSize?: number }) {
    const count = body.count ? Number(body.count) : 20;
    const chunkSize = body.chunkSize ? Number(body.chunkSize) : 2;
    return this.numbersService.generate(count, chunkSize);
  }

  @Post('cards/generate')
  generateCards(@Body() body: { deckSize?: number; chunkSize?: number }) {
    const deckSize = body.deckSize ? Number(body.deckSize) : 52;
    const chunkSize = body.chunkSize ? Number(body.chunkSize) : 1;
    return this.cardsService.generate(deckSize, chunkSize);
  }

  @Post('words/generate')
  generateWords(@Body() body: { count?: number }) {
    const count = body.count ? Number(body.count) : 20;
    return this.wordsService.generate(count);
  }
}
