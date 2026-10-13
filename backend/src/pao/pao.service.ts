import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaoEntryEntity } from '../entities/pao-entry.entity';
import { ALL_PAO_SEED, NUMBERS_PAO_SEED, CARDS_PAO_SEED } from './pao-seed.data';
import { UpdatePaoDto } from './dto/update-pao.dto';

@Injectable()
export class PaoService {
  constructor(
    @InjectRepository(PaoEntryEntity)
    private readonly paoRepository: Repository<PaoEntryEntity>,
  ) {}

  async getAllPao(userId?: string): Promise<{ numbers: any[]; cards: any[] }> {
    let customEntriesMap = new Map<string, PaoEntryEntity>();
    if (userId) {
      const userEntries = await this.paoRepository.find({
        where: { user: { id: userId } },
      });
      userEntries.forEach((entry) => customEntriesMap.set(entry.key, entry));
    }

    const numbers = NUMBERS_PAO_SEED.map((seed) => {
      const custom = customEntriesMap.get(seed.key);
      if (custom) {
        return {
          id: custom.id,
          key: custom.key,
          type: 'number',
          person: custom.person || seed.person,
          action: custom.action || seed.action,
          object: custom.object || seed.object,
          notes: custom.notes || seed.notes || '',
          imageUrl: custom.imageUrl || null,
          isCustom: true,
        };
      }
      return {
        ...seed,
        isCustom: false,
      };
    });

    const cards = CARDS_PAO_SEED.map((seed) => {
      const custom = customEntriesMap.get(seed.key);
      if (custom) {
        return {
          id: custom.id,
          key: custom.key,
          type: 'card',
          person: custom.person || seed.person,
          action: custom.action || seed.action,
          object: custom.object || seed.object,
          notes: custom.notes || seed.notes || '',
          imageUrl: custom.imageUrl || null,
          isCustom: true,
        };
      }
      return {
        ...seed,
        isCustom: false,
      };
    });

    return { numbers, cards };
  }

  async updatePao(userId: string, key: string, dto: UpdatePaoDto): Promise<PaoEntryEntity> {
    const isCard = CARDS_PAO_SEED.some((c) => c.key === key);
    const defaultSeed = ALL_PAO_SEED.find((s) => s.key === key);
    if (!defaultSeed) {
      throw new BadRequestException(`Unknown PAO key: ${key}`);
    }

    let entry = await this.paoRepository.findOne({
      where: { user: { id: userId }, key },
    });

    if (!entry) {
      entry = this.paoRepository.create({
        user: { id: userId } as any,
        key,
        type: isCard ? 'card' : 'number',
        person: dto.person ?? defaultSeed?.person ?? '',
        action: dto.action ?? defaultSeed?.action ?? '',
        object: dto.object ?? defaultSeed?.object ?? '',
        notes: dto.notes ?? defaultSeed?.notes ?? '',
        imageUrl: dto.imageUrl,
        isCustom: true,
      });
    } else {
      if (dto.person !== undefined) entry.person = dto.person;
      if (dto.action !== undefined) entry.action = dto.action;
      if (dto.object !== undefined) entry.object = dto.object;
      if (dto.notes !== undefined) entry.notes = dto.notes;
      if (dto.imageUrl !== undefined) entry.imageUrl = dto.imageUrl;
      entry.isCustom = true;
    }

    return this.paoRepository.save(entry);
  }

  async resetPao(userId: string): Promise<{ success: boolean }> {
    await this.paoRepository.delete({ user: { id: userId } });
    return { success: true };
  }

  async getSeedDictionary(): Promise<{ numbers: any[]; cards: any[] }> {
    return {
      numbers: NUMBERS_PAO_SEED.map((item) => ({ ...item, isCustom: false })),
      cards: CARDS_PAO_SEED.map((item) => ({ ...item, isCustom: false })),
    };
  }
}
