// Types for the RPG Table Management System

export interface Campaign {
  id: number;
  name: string;
  system: string;
  joinCode: string;
  createdAt: string;
}

export interface Player {
  id: number;
  name: string;
  campaignId: number;
  isGM: boolean;
}

export interface CharacterAttributes {
  strength?: number;
  dexterity?: number;
  constitution?: number;
  intelligence?: number;
  wisdom?: number;
  charisma?: number;
  [key: string]: number | undefined;
}

export interface Character {
  id: number;
  playerId: number;
  name: string;
  characterClass: string;
  level: number;
  attributes: CharacterAttributes;
  maxHp: number;
  currentHp: number;
  notes: string;
}

export interface SpellSlot {
  id: number;
  characterId: number;
  spellLevel: number;
  totalSlots: number;
  usedSlots: number;
}

export interface Combat {
  id: number;
  campaignId: number;
  active: boolean;
  currentTurnIndex: number;
  turns: CombatTurn[];
}

export interface CombatTurn {
  id: number;
  combatId: number;
  entityType: 'PLAYER' | 'NPC';
  entityId: number;
  entityName: string;
  initiative: number;
  orderIndex: number;
}

export interface ChatMessage {
  id: number;
  campaignId: number;
  senderId: number;
  senderName: string;
  targetPlayerId?: number;
  content: string;
  timestamp: string;
}

export interface DiceRollResult {
  expression: string;
  result: number;
  rolls: number[];
  modifier: number;
}

export interface GameEvent {
  type: 'HP_CHANGE' | 'COMBAT_TURN' | 'DICE_ROLL' | 'CHAT_MESSAGE';
  payload: unknown;
  timestamp: string;
}
