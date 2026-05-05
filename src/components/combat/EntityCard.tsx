import { useState } from 'react';
import { CombatEntity } from '@/types/combat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Swords, Skull, Pencil, Trash2, Copy, Plus, X, ShieldOff } from 'lucide-react';
import { rollD20 } from '@/lib/dice';

const COMMON_CONDITIONS = ['Atordoado', 'Caído', 'Envenenado', 'Cego', 'Confuso', 'Enredado', 'Paralisado', 'Surpreso'];

interface Props {
  entity: CombatEntity;
  isActive: boolean;
  onUpdate: (e: CombatEntity) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onEdit: (id: string) => void;
  onRoll: (text: string) => void;
}

export default function EntityCard({ entity, isActive, onUpdate, onRemove, onDuplicate, onEdit, onRoll }: Props) {
  const [hpDelta, setHpDelta] = useState('');
  const [showCond, setShowCond] = useState(false);

  const applyHp = (sign: 1 | -1) => {
    const n = parseInt(hpDelta);
    if (!n) return;
    const newHp = Math.min(entity.maxHp, Math.max(-100, entity.hp + sign * n));
    onUpdate({ ...entity, hp: newHp, dead: newHp <= -10, unconscious: newHp <= 0 && newHp > -10 });
    setHpDelta('');
  };

  const hpPct = Math.max(0, (entity.hp / entity.maxHp) * 100);
  const hpColor = hpPct > 50 ? 'bg-hp-heal' : hpPct > 25 ? 'bg-accent' : 'bg-hp-damage';

  const toggleCondition = (name: string) => {
    const exists = entity.conditions.find((c) => c.name === name);
    const conditions = exists
      ? entity.conditions.filter((c) => c.name !== name)
      : [...entity.conditions, { id: crypto.randomUUID(), name }];
    onUpdate({ ...entity, conditions });
  };

  return (
    <div className={`rounded-lg border p-3 transition-all ${
      isActive ? 'bg-primary/10 border-primary shadow-[0_0_16px_hsl(var(--primary)/0.25)]'
        : entity.dead ? 'bg-card/40 border-border opacity-60'
        : 'bg-card border-border hover:border-border/80'
    }`}>
      <div className="flex items-start gap-2 sm:gap-3">
        <div className={`shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-md flex flex-col items-center justify-center font-bold ${
          entity.kind === 'enemy' ? 'bg-hp-damage/20 text-hp-damage' : 'bg-primary/20 text-primary'
        }`}>
          <span className="text-base sm:text-lg leading-none">{entity.initiative ?? '—'}</span>
          <span className="text-[9px] uppercase opacity-60">init</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold truncate">{entity.name}</span>
            {entity.dead && <Skull className="w-4 h-4 text-hp-damage" />}
            {entity.unconscious && !entity.dead && <ShieldOff className="w-4 h-4 text-accent" />}
            {isActive && <span className="text-[10px] font-bold text-primary uppercase tracking-wider">ATUAL</span>}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
            <span>CA <b className="text-foreground">{entity.ac}</b></span>
            <span>BBA <b className="text-foreground">{entity.bab >= 0 ? '+' : ''}{entity.bab}</b></span>
            <span>Fort <b className="text-foreground">{entity.fort >= 0 ? '+' : ''}{entity.fort}</b></span>
            <span>Ref <b className="text-foreground">{entity.ref >= 0 ? '+' : ''}{entity.ref}</b></span>
            <span>Von <b className="text-foreground">{entity.will >= 0 ? '+' : ''}{entity.will}</b></span>
          </div>

          <div className="mt-2">
            <div className="flex justify-between text-xs mb-0.5">
              <span className="text-muted-foreground">HP</span>
              <span className="font-mono">{entity.hp} / {entity.maxHp}</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div className={`h-full transition-all ${hpColor}`} style={{ width: `${hpPct}%` }} />
            </div>
          </div>

          {entity.conditions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {entity.conditions.map((c) => (
                <button key={c.id} onClick={() => toggleCondition(c.name)}
                  className="text-[10px] uppercase font-semibold tracking-wider bg-accent/20 text-accent px-2 py-0.5 rounded inline-flex items-center gap-1 hover:bg-accent/30">
                  {c.name} <X className="w-2.5 h-2.5" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Input className="h-7 w-16 text-xs" placeholder="±HP" value={hpDelta}
              onChange={(e) => setHpDelta(e.target.value.replace(/[^0-9]/g, ''))}
              onKeyDown={(e) => { if (e.key === 'Enter') applyHp(-1); }} />
            <Button size="sm" variant="destructive" className="h-7 px-2" onClick={() => applyHp(-1)}>
              <Swords className="w-3 h-3" />
            </Button>
            <Button size="sm" className="h-7 px-2 bg-hp-heal text-background hover:bg-hp-heal/80" onClick={() => applyHp(1)}>
              <Heart className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="outline" className="h-7 px-2 text-xs"
              onClick={() => onRoll(`${entity.name} ataque: ${rollD20(entity.bab, 'Ataque').total}`)}>
              Atk
            </Button>
            <Button size="sm" variant="outline" className="h-7 px-2 text-xs"
              onClick={() => onRoll(`${entity.name} Fort: ${rollD20(entity.fort, 'Fort').total}`)}>F</Button>
            <Button size="sm" variant="outline" className="h-7 px-2 text-xs"
              onClick={() => onRoll(`${entity.name} Ref: ${rollD20(entity.ref, 'Ref').total}`)}>R</Button>
            <Button size="sm" variant="outline" className="h-7 px-2 text-xs"
              onClick={() => onRoll(`${entity.name} Von: ${rollD20(entity.will, 'Von').total}`)}>V</Button>

            <div className="ml-auto flex gap-1">
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setShowCond((v) => !v)} title="Condições">
                <Plus className="w-3.5 h-3.5" />
              </Button>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => onDuplicate(entity.id)} title="Duplicar">
                <Copy className="w-3.5 h-3.5" />
              </Button>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => onEdit(entity.id)} title="Editar">
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-hp-damage hover:text-hp-damage" onClick={() => onRemove(entity.id)} title="Remover">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {showCond && (
            <div className="mt-2 flex flex-wrap gap-1 border-t border-border pt-2">
              {COMMON_CONDITIONS.map((c) => {
                const active = entity.conditions.some((x) => x.name === c);
                return (
                  <button key={c} onClick={() => toggleCondition(c)}
                    className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded transition-colors ${
                      active ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}>{c}</button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
