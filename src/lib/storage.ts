import { CombatEntity, LogEntry, SavedCombat } from '@/types/combat';

const CURRENT_KEY = 'dnd35.current';
const SAVED_KEY = 'dnd35.saved';

export interface CombatState {
  entities: CombatEntity[];
  round: number;
  turnIndex: number;
  log: LogEntry[];
}

export function loadCurrent(): CombatState | null {
  try {
    const raw = localStorage.getItem(CURRENT_KEY);
    return raw ? (JSON.parse(raw) as CombatState) : null;
  } catch {
    return null;
  }
}

export function saveCurrent(state: CombatState) {
  localStorage.setItem(CURRENT_KEY, JSON.stringify(state));
}

export function listSaved(): SavedCombat[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? (JSON.parse(raw) as SavedCombat[]) : [];
  } catch {
    return [];
  }
}

export function saveCombat(name: string, state: CombatState): SavedCombat {
  const list = listSaved();
  const item: SavedCombat = {
    id: crypto.randomUUID(),
    name,
    savedAt: new Date().toISOString(),
    ...state,
  };
  list.unshift(item);
  localStorage.setItem(SAVED_KEY, JSON.stringify(list.slice(0, 30)));
  return item;
}

export function deleteSaved(id: string) {
  const list = listSaved().filter((c) => c.id !== id);
  localStorage.setItem(SAVED_KEY, JSON.stringify(list));
}
