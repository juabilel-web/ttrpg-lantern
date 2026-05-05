import { CombatEntity } from '@/types/combat';

export type CharacterPreset = Omit<
  CombatEntity,
  'id' | 'conditions' | 'dead' | 'unconscious' | 'initiative' | 'groupId'
> & { id: string; createdAt: string };

const KEY = 'dnd35.library';

export function listPresets(): CharacterPreset[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CharacterPreset[]) : [];
  } catch {
    return [];
  }
}

export function savePreset(
  data: Omit<CharacterPreset, 'id' | 'createdAt'>
): CharacterPreset {
  const list = listPresets();
  const item: CharacterPreset = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  list.unshift(item);
  localStorage.setItem(KEY, JSON.stringify(list));
  return item;
}

export function updatePreset(id: string, data: Partial<CharacterPreset>) {
  const list = listPresets().map((p) => (p.id === id ? { ...p, ...data } : p));
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function deletePreset(id: string) {
  const list = listPresets().filter((p) => p.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
}
