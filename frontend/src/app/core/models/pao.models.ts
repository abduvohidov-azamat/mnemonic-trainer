export interface PaoEntry {
  id?: string;
  key: string;
  type: 'number' | 'card';
  person: string;
  action: string;
  object: string;
  notes?: string;
  imageUrl?: string;
  isCustom?: boolean;
}

export interface PaoMatrixResponse {
  numbers: PaoEntry[];
  cards: PaoEntry[];
}
