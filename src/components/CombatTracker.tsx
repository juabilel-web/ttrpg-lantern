import { useState } from 'react';
import { Combat, CombatTurn } from '@/types/rpg';
import { Button } from '@/components/ui/button';
import { Swords, ChevronRight, Skull, Shield } from 'lucide-react';

interface CombatTrackerProps {
  combat: Combat | null;
  onNextTurn: () => void;
  onStartCombat: () => void;
}

export default function CombatTracker({ combat, onNextTurn, onStartCombat }: CombatTrackerProps) {
  if (!combat || !combat.active) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
        <Swords className="w-16 h-16 text-muted-foreground/30" />
        <h2 className="font-display text-xl text-muted-foreground">No Active Combat</h2>
        <Button variant="combat" onClick={onStartCombat}>
          <Swords className="w-4 h-4" />
          Start Combat
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl text-foreground">Initiative Order</h2>
        <Button variant="combat" size="sm" onClick={onNextTurn}>
          Next Turn <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {combat.turns.map((turn, index) => {
          const isActive = index === combat.currentTurnIndex;
          const isNPC = turn.entityType === 'NPC';
          return (
            <div
              key={turn.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-150 ${
                isActive
                  ? 'bg-primary/15 border-primary/50 shadow-[0_0_12px_hsl(var(--primary)/0.15)]'
                  : 'bg-card border-border hover:border-border/80'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
              }`}>
                {turn.initiative}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {isNPC ? <Skull className="w-3.5 h-3.5 text-hp-damage" /> : <Shield className="w-3.5 h-3.5 text-primary" />}
                  <span className={`font-medium text-sm truncate ${isActive ? 'text-foreground' : 'text-card-foreground'}`}>
                    {turn.entityName}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{isNPC ? 'NPC' : 'Player'}</span>
              </div>

              {isActive && (
                <span className="text-xs font-bold text-primary uppercase tracking-wider animate-pulse">Active</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
