export type EntityKind = 'player' | 'enemy';

export interface Condition {
  id: string;
  name: string;
}

export interface CombatEntity {
  id: string;
  name: string;
  kind: EntityKind;
  hp: number;
  maxHp: number;
  ac: number;
  bab: number;
  fort: number;
  ref: number;
  will: number;
  initiativeMod: number;
  initiative: number | null;
  conditions: Condition[];
  dead: boolean;
  unconscious: boolean;
  groupId?: string; // shared HP group
  notes?: string;
}

export interface SavedCombat {
  id: string;
  name: string;
  savedAt: string;
  entities: CombatEntity[];
  round: number;
  turnIndex: number;
  log: LogEntry[];
}

export interface LogEntry {
  id: string;
  time: string;
  text: string;
  kind: 'roll' | 'damage' | 'heal' | 'turn' | 'info';
}
