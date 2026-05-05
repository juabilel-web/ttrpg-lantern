import { LogEntry } from '@/types/combat';
import { Trash2 } from 'lucide-react';

interface Props { entries: LogEntry[]; onClear?: () => void; }

export default function CombatLog({ entries, onClear }: Props) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Log</span>
        <button
          onClick={onClear}
          disabled={!entries.length}
          title="Limpar log"
          className="text-muted-foreground hover:text-hp-damage disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {entries.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">Sem rolagens ainda.</p>
        )}
        {entries.slice().reverse().map((e) => (
          <div key={e.id} className={`text-xs px-2 py-1.5 rounded border-l-2 animate-slide-in ${
            e.kind === 'damage' ? 'border-hp-damage bg-hp-damage/5'
            : e.kind === 'heal' ? 'border-hp-heal bg-hp-heal/5'
            : e.kind === 'roll' ? 'border-accent bg-accent/5'
            : e.kind === 'turn' ? 'border-primary bg-primary/5'
            : 'border-border bg-secondary/30'
          }`}>
            <div className="font-mono text-foreground">{e.text}</div>
            <div className="text-[10px] text-muted-foreground">{e.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
