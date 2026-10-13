import { Injectable, BadRequestException } from '@nestjs/common';

export interface Card {
  key: string;      // e.g. "AS", "10H", "KD"
  suit: 'S' | 'H' | 'D' | 'C';
  suitName: 'Spades' | 'Hearts' | 'Diamonds' | 'Clubs';
  suitSymbol: '♠' | '♥' | '♦' | '♣';
  suitColor: 'black' | 'red';
  rank: 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
  name: string;
}

export interface GeneratedCardsResponse {
  discipline: 'cards';
  cards: Card[];
  chunkSize: number;
  loci: Card[][];
  totalCards: number;
}

const SUIT_META: Record<string, { name: 'Spades' | 'Hearts' | 'Diamonds' | 'Clubs'; symbol: '♠' | '♥' | '♦' | '♣'; color: 'black' | 'red' }> = {
  S: { name: 'Spades', symbol: '♠', color: 'black' },
  H: { name: 'Hearts', symbol: '♥', color: 'red' },
  D: { name: 'Diamonds', symbol: '♦', color: 'red' },
  C: { name: 'Clubs', symbol: '♣', color: 'black' },
};

const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;
const SUITS = ['S', 'H', 'D', 'C'] as const;

@Injectable()
export class CardsService {
  getFullDeck(): Card[] {
    const deck: Card[] = [];
    for (const suit of SUITS) {
      const meta = SUIT_META[suit];
      for (const rank of RANKS) {
        deck.push({
          key: `${rank}${suit}`,
          suit,
          suitName: meta.name,
          suitSymbol: meta.symbol,
          suitColor: meta.color,
          rank,
          name: `${rank} of ${meta.name}`,
        });
      }
    }
    return deck;
  }

  generate(deckSize = 52, chunkSize = 1): GeneratedCardsResponse {
    if (!Number.isInteger(deckSize) || deckSize < 4 || deckSize > 52) {
      throw new BadRequestException('Deck size must be between 4 and 52 cards');
    }
    if (![1, 2, 3].includes(chunkSize)) {
      throw new BadRequestException('Chunk size must be 1, 2, or 3 cards per locus');
    }

    const fullDeck = this.getFullDeck();

    // Fisher-Yates Shuffle
    for (let i = fullDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [fullDeck[i], fullDeck[j]] = [fullDeck[j], fullDeck[i]];
    }

    const selectedCards = fullDeck.slice(0, deckSize);
    const loci: Card[][] = [];
    for (let i = 0; i < selectedCards.length; i += chunkSize) {
      loci.push(selectedCards.slice(i, i + chunkSize));
    }

    return {
      discipline: 'cards',
      cards: selectedCards,
      chunkSize,
      loci,
      totalCards: selectedCards.length,
    };
  }
}
