import { useEffect, useMemo, useState, useCallback } from 'react';
import { CombatEntity, LogEntry } from '@/types/combat';
import { rollD20, rollDie } from '@/lib/dice';
import { loadCurrent, saveCurrent, listSaved, saveCombat, deleteSaved } from '@/lib/storage';
import EntityCard from '@/components/combat/EntityCard';
import EntityDialog from '@/components/combat/EntityDialog';
import DicePanel from '@/components/combat/DicePanel';
import CombatLog from '@/components/combat/CombatLog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus, Play, RotateCcw, ChevronRight, Save, FolderOpen, Dice5,
  CheckSquare, Square, Trash2, Flag, Swords,
} from 'lucide-react';

const newId = () => crypto.randomUUID();

const Index = () => {
  const initial = loadCurrent();
  const [entities, setEntities] = useState<CombatEntity[]>(initial?.entities ?? []);
  const [round, setRound] = useState(initial?.round ?? 0);
  const [turnIndex, setTurnIndex] = useState(initial?.turnIndex ?? 0);
  const [log, setLog] = useState<LogEntry[]>(initial?.log ?? []);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [saved, setSaved] = useState(listSaved());
  const [stats, setStats] = useState({ damage: 0, healing: 0, startedAt: 0 });

  // autosave
  useEffect(() => {
    saveCurrent({ entities, round, turnIndex, log });
  }, [entities, round, turnIndex, log]);

  const ordered = useMemo(() => {
    return [...entities].sort((a, b) => {
      if (a.initiative === null && b.initiative === null) return 0;
      if (a.initiative === null) return 1;
      if (b.initiative === null) return -1;
      if (b.initiative !== a.initiative) return b.initiative - a.initiative;
      return b.initiativeMod - a.initiativeMod;
    });
  }, [entities]);

  const activeId = round > 0 && ordered[turnIndex] ? ordered[turnIndex].id : null;

  const addLog = useCallback((text: string, kind: LogEntry['kind'] = 'info') => {
    setLog((p) => [...p, { id: newId(), time: new Date().toLocaleTimeString(), text, kind }]);
  }, []);

  const updateEntity = (e: CombatEntity) => {
    setEntities((prev) => {
      const old = prev.find((x) => x.id === e.id);
      if (old) {
        const diff = old.hp - e.hp;
        if (diff > 0) { setStats((s) => ({ ...s, damage: s.damage + diff })); addLog(`${e.name} sofreu ${diff} de dano (HP: ${e.hp})`, 'damage'); }
        else if (diff < 0) { setStats((s) => ({ ...s, healing: s.healing - diff })); addLog(`${e.name} curou ${-diff} (HP: ${e.hp})`, 'heal'); }
      }
      return prev.map((x) => (x.id === e.id ? e : x));
    });
  };

  const handleSaveEntity = (data: Omit<CombatEntity, 'id' | 'conditions' | 'dead' | 'unconscious' | 'initiative'>, copies: number, sharedHp: boolean) => {
    if (editingId) {
      setEntities((p) => p.map((x) => x.id === editingId ? { ...x, ...data } : x));
      setEditingId(null);
      return;
    }
    const groupId = sharedHp && copies > 1 ? newId() : undefined;
    const items: CombatEntity[] = [];
    for (let i = 0; i < copies; i++) {
      items.push({
        id: newId(),
        ...data,
        name: copies > 1 ? `${data.name} ${i + 1}` : data.name,
        conditions: [], dead: false, unconscious: false, initiative: null,
        groupId,
      });
    }
    setEntities((p) => [...p, ...items]);
    addLog(`Adicionado: ${data.name}${copies > 1 ? ` x${copies}` : ''}`);
  };

  const removeEntity = (id: string) => setEntities((p) => p.filter((x) => x.id !== id));
  const duplicateEntity = (id: string) => {
    const e = entities.find((x) => x.id === id);
    if (!e) return;
    const sameRoot = entities.filter((x) => x.name.replace(/ \d+$/, '') === e.name.replace(/ \d+$/, ''));
    const copy: CombatEntity = { ...e, id: newId(), name: `${e.name.replace(/ \d+$/, '')} ${sameRoot.length + 1}`, conditions: [], initiative: null };
    setEntities((p) => [...p, copy]);
  };

  const editEntity = (id: string) => { setEditingId(id); setDialogOpen(true); };

  const toggleSelect = (id: string) => setSelected((s) => {
    const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n;
  });
  const allSelected = selected.size === entities.length && entities.length > 0;
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(entities.map((e) => e.id)));

  const rollInitiative = (onlySelected: boolean) => {
    const targetIds = onlySelected ? selected : new Set(entities.map((e) => e.id));
    setEntities((p) => p.map((e) => {
      if (!targetIds.has(e.id)) return e;
      const r = rollDie(20) + e.initiativeMod;
      return { ...e, initiative: r };
    }));
    addLog(`Iniciativa rolada para ${onlySelected ? `${targetIds.size} selecionado(s)` : 'todos'}`, 'roll');
  };

  const startCombat = () => {
    if (entities.some((e) => e.initiative === null)) {
      rollInitiative(false);
    }
    setRound(1); setTurnIndex(0);
    setStats({ damage: 0, healing: 0, startedAt: Date.now() });
    addLog('⚔️ Combate iniciado — Rodada 1', 'turn');
  };

  const nextTurn = useCallback(() => {
    if (round === 0 || ordered.length === 0) return;
    let next = turnIndex + 1;
    let r = round;
    if (next >= ordered.length) { next = 0; r += 1; addLog(`— Rodada ${r} —`, 'turn'); }
    setTurnIndex(next); setRound(r);
    const cur = ordered[next];
    if (cur) addLog(`Turno: ${cur.name}`, 'turn');
  }, [round, turnIndex, ordered, addLog]);

  const restartRound = () => { setTurnIndex(0); addLog('Rodada reiniciada', 'turn'); };

  const endCombat = () => {
    const dur = stats.startedAt ? Math.round((Date.now() - stats.startedAt) / 1000) : 0;
    addLog(`🏁 Combate finalizado — ${round} rodadas, ${dur}s, ${stats.damage} dano, ${stats.healing} cura`, 'turn');
    setRound(0); setTurnIndex(0);
  };

  const clearAll = () => {
    if (!confirm('Limpar todas as entidades e log?')) return;
    setEntities([]); setRound(0); setTurnIndex(0); setLog([]); setSelected(new Set());
  };

  const handleSaveCombat = () => {
    const name = prompt('Nome do combate:', `Combate ${new Date().toLocaleString()}`);
    if (!name) return;
    saveCombat(name, { entities, round, turnIndex, log });
    setSaved(listSaved());
    addLog(`💾 Combate "${name}" salvo`);
  };

  const loadSaved = (id: string) => {
    const c = listSaved().find((x) => x.id === id);
    if (!c) return;
    setEntities(c.entities); setRound(c.round); setTurnIndex(c.turnIndex); setLog(c.log);
    setShowSaved(false);
  };

  // keyboard shortcut
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.key === ' ' || e.key === 'n') { e.preventDefault(); nextTurn(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [nextTurn]);

  const editingEntity = editingId ? entities.find((e) => e.id === editingId) ?? null : null;

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-border px-4 py-3 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-primary" />
            <h1 className="font-display text-lg font-bold">Mestre D&amp;D 3.5</h1>
          </div>

          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-xs text-muted-foreground">Rodada</span>
            <span className="font-mono font-bold text-base px-2 py-0.5 rounded bg-secondary">{round}</span>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-1.5">
            <Button size="sm" variant="outline" onClick={() => { setEditingId(null); setDialogOpen(true); }}>
              <Plus className="w-3.5 h-3.5" /> Entidade
            </Button>
            <Button size="sm" variant="outline" onClick={() => rollInitiative(false)} disabled={!entities.length}>
              <Dice5 className="w-3.5 h-3.5" /> Init Todos
            </Button>
            <Button size="sm" variant="outline" onClick={() => rollInitiative(true)} disabled={!selected.size}>
              <Dice5 className="w-3.5 h-3.5" /> Init Sel ({selected.size})
            </Button>
            {round === 0 ? (
              <Button size="sm" variant="combat" onClick={startCombat} disabled={!entities.length}>
                <Play className="w-3.5 h-3.5" /> Iniciar
              </Button>
            ) : (
              <>
                <Button size="sm" variant="combat" onClick={nextTurn}>
                  Próx. <ChevronRight className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="outline" onClick={restartRound} title="Reiniciar rodada">
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="destructive" onClick={endCombat}>
                  <Flag className="w-3.5 h-3.5" /> Fim
                </Button>
              </>
            )}
            <Button size="sm" variant="ghost" onClick={handleSaveCombat} title="Salvar">
              <Save className="w-3.5 h-3.5" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setSaved(listSaved()); setShowSaved((v) => !v); }} title="Carregar">
              <FolderOpen className="w-3.5 h-3.5" />
            </Button>
            <Button size="sm" variant="ghost" onClick={clearAll} title="Limpar tudo">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </header>

        {showSaved && (
          <div className="border-b border-border bg-card/50 p-3 max-h-48 overflow-auto">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Combates salvos</div>
            {saved.length === 0 && <p className="text-sm text-muted-foreground">Nenhum combate salvo.</p>}
            <div className="space-y-1">
              {saved.map((c) => (
                <div key={c.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-secondary/50">
                  <button className="flex-1 text-left" onClick={() => loadSaved(c.id)}>
                    <div className="text-sm font-medium">{c.name}</div>
                    <div className="text-[10px] text-muted-foreground">{new Date(c.savedAt).toLocaleString()} · {c.entities.length} entidades</div>
                  </button>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { deleteSaved(c.id); setSaved(listSaved()); }}>
                    <Trash2 className="w-3.5 h-3.5 text-hp-damage" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {entities.length > 0 && (
          <div className="px-4 py-2 border-b border-border flex items-center gap-2 text-xs">
            <button onClick={toggleAll} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
              {allSelected ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
              Selecionar todos
            </button>
            <span className="text-muted-foreground">· Atalho: <kbd className="px-1.5 py-0.5 bg-secondary rounded font-mono">Espaço</kbd> avança turno</span>
          </div>
        )}

        <div className="flex-1 overflow-auto p-4 space-y-2">
          {entities.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Swords className="w-16 h-16 opacity-20" />
              <p>Nenhuma entidade. Adicione jogadores e inimigos para começar.</p>
              <Button onClick={() => { setEditingId(null); setDialogOpen(true); }}>
                <Plus className="w-4 h-4" /> Nova Entidade
              </Button>
            </div>
          )}
          {ordered.map((e) => (
            <div key={e.id} className="flex items-start gap-2">
              <button onClick={() => toggleSelect(e.id)} className="mt-3 text-muted-foreground hover:text-foreground">
                {selected.has(e.id) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
              </button>
              <div className="flex-1">
                <EntityCard
                  entity={e}
                  isActive={e.id === activeId}
                  onUpdate={updateEntity}
                  onRemove={removeEntity}
                  onDuplicate={duplicateEntity}
                  onEdit={editEntity}
                  onRoll={(t) => addLog(t, 'roll')}
                />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Side panel */}
      <aside className="w-80 border-l border-border flex flex-col bg-card/30">
        <div className="p-3 border-b border-border">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Estatísticas</div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-secondary/50 rounded p-2">
              <div className="text-[10px] text-muted-foreground uppercase">Rodadas</div>
              <div className="font-bold">{round}</div>
            </div>
            <div className="bg-hp-damage/10 rounded p-2">
              <div className="text-[10px] text-hp-damage uppercase">Dano</div>
              <div className="font-bold text-hp-damage">{stats.damage}</div>
            </div>
            <div className="bg-hp-heal/10 rounded p-2">
              <div className="text-[10px] text-hp-heal uppercase">Cura</div>
              <div className="font-bold text-hp-heal">{stats.healing}</div>
            </div>
          </div>
        </div>
        <CombatLog entries={log} />
        <DicePanel onRoll={(t) => addLog(t, 'roll')} />
      </aside>

      <EntityDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditingId(null); }}
        onSave={handleSaveEntity}
        initial={editingEntity}
      />
    </div>
  );
};

export default Index;
