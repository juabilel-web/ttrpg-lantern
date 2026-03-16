import { Campaign, Player, Character, Combat, CombatTurn, ChatMessage, SpellSlot } from '@/types/rpg';

// Mock data for the frontend demo (replace with real API calls when backend is running)

export const mockCampaign: Campaign = {
  id: 1,
  name: "The Lost Mines of Phandelver",
  system: "D&D 5e",
  joinCode: "ABCD1234",
  createdAt: new Date().toISOString(),
};

export const mockPlayers: Player[] = [
  { id: 1, name: "Dungeon Master", campaignId: 1, isGM: true },
  { id: 2, name: "Aric", campaignId: 1, isGM: false },
  { id: 3, name: "Lyra", campaignId: 1, isGM: false },
  { id: 4, name: "Thorin", campaignId: 1, isGM: false },
];

export const mockCharacters: Character[] = [
  {
    id: 1, playerId: 2, name: "Aric Stoneblade", characterClass: "Fighter", level: 5,
    attributes: { strength: 18, dexterity: 14, constitution: 16, intelligence: 10, wisdom: 12, charisma: 8 },
    maxHp: 52, currentHp: 38, notes: "Has a magic longsword +1",
  },
  {
    id: 2, playerId: 3, name: "Lyra Moonshadow", characterClass: "Wizard", level: 5,
    attributes: { strength: 8, dexterity: 14, constitution: 12, intelligence: 19, wisdom: 13, charisma: 11 },
    maxHp: 32, currentHp: 32, notes: "Specializes in evocation magic",
  },
  {
    id: 3, playerId: 4, name: "Thorin Ironfist", characterClass: "Cleric", level: 5,
    attributes: { strength: 16, dexterity: 10, constitution: 14, intelligence: 11, wisdom: 18, charisma: 13 },
    maxHp: 45, currentHp: 20, notes: "Follower of Moradin",
  },
];

export const mockSpellSlots: SpellSlot[] = [
  { id: 1, characterId: 2, spellLevel: 1, totalSlots: 4, usedSlots: 2 },
  { id: 2, characterId: 2, spellLevel: 2, totalSlots: 3, usedSlots: 1 },
  { id: 3, characterId: 2, spellLevel: 3, totalSlots: 2, usedSlots: 0 },
  { id: 4, characterId: 3, spellLevel: 1, totalSlots: 4, usedSlots: 3 },
  { id: 5, characterId: 3, spellLevel: 2, totalSlots: 3, usedSlots: 0 },
  { id: 6, characterId: 3, spellLevel: 3, totalSlots: 2, usedSlots: 1 },
];

export const mockCombat: Combat = {
  id: 1, campaignId: 1, active: true, currentTurnIndex: 0,
  turns: [
    { id: 1, combatId: 1, entityType: 'PLAYER', entityId: 2, entityName: "Lyra Moonshadow", initiative: 19, orderIndex: 0 },
    { id: 2, combatId: 1, entityType: 'NPC', entityId: 100, entityName: "Goblin Captain", initiative: 16, orderIndex: 1 },
    { id: 3, combatId: 1, entityType: 'PLAYER', entityId: 1, entityName: "Aric Stoneblade", initiative: 14, orderIndex: 2 },
    { id: 4, combatId: 1, entityType: 'NPC', entityId: 101, entityName: "Goblin Archer", initiative: 12, orderIndex: 3 },
    { id: 5, combatId: 1, entityType: 'PLAYER', entityId: 3, entityName: "Thorin Ironfist", initiative: 8, orderIndex: 4 },
  ],
};

export const mockMessages: ChatMessage[] = [
  { id: 1, campaignId: 1, senderId: 1, senderName: "DM", content: "You enter the dimly lit cave. Roll for perception.", timestamp: new Date(Date.now() - 300000).toISOString() },
  { id: 2, campaignId: 1, senderId: 3, senderName: "Lyra", content: "I cast Detect Magic as we enter.", timestamp: new Date(Date.now() - 240000).toISOString() },
  { id: 3, campaignId: 1, senderId: 4, senderName: "Thorin", content: "I ready my shield and move to the front.", timestamp: new Date(Date.now() - 180000).toISOString() },
  { id: 4, campaignId: 1, senderId: 1, senderName: "DM", content: "Thorin, you spot movement ahead. Roll initiative!", timestamp: new Date(Date.now() - 120000).toISOString() },
];
