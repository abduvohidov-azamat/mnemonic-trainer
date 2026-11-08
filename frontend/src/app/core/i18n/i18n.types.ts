import type { en } from './messages/en';

export type Lang = 'en' | 'uz' | 'ru';

export interface PluralForms {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

type En = typeof en;

// Same sections and keys as en.ts; plural entries may use any forms the language needs.
export type Messages = {
  [S in keyof En]: { [K in keyof En[S]]: En[S][K] extends string ? string : PluralForms };
};

// 'section.key' for plain strings and plural entries, so templates fail to compile on a typo.
export type MessageKey = {
  [S in keyof En & string]: { [K in keyof En[S] & string]: En[S][K] extends string ? `${S}.${K}` : never }[keyof En[S] & string];
}[keyof En & string];

export type PluralKey = {
  [S in keyof En & string]: { [K in keyof En[S] & string]: En[S][K] extends string ? never : `${S}.${K}` }[keyof En[S] & string];
}[keyof En & string];

export type MessageParams = Record<string, string | number | null | undefined>;
