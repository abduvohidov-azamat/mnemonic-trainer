import { Injectable, BadRequestException } from '@nestjs/common';

export interface GeneratedNumbersResponse {
  discipline: 'numbers';
  sequence: string;
  chunkSize: number;
  loci: string[];
  totalDigits: number;
}

@Injectable()
export class NumbersService {
  generate(count = 20, chunkSize = 2): GeneratedNumbersResponse {
    if (!Number.isInteger(count) || count < 2 || count > 1000) {
      throw new BadRequestException('Count must be between 2 and 1000 digits');
    }
    if (![1, 2, 3].includes(chunkSize)) {
      throw new BadRequestException('Chunk size must be 1, 2, or 3 digits');
    }

    let sequence = '';
    for (let i = 0; i < count; i++) {
      sequence += Math.floor(Math.random() * 10).toString();
    }

    const loci: string[] = [];
    for (let i = 0; i < sequence.length; i += chunkSize) {
      loci.push(sequence.slice(i, i + chunkSize));
    }

    return {
      discipline: 'numbers',
      sequence,
      chunkSize,
      loci,
      totalDigits: sequence.length,
    };
  }
}
