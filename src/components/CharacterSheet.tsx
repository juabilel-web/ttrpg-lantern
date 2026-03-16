import { useState } from 'react';
import { Character, SpellSlot } from '@/types/rpg';
import { Heart, Shield, Sparkles, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CharacterSheetProps {
  character: Character;
  spellSlots: SpellSlot[];
  onDamage: (charId: number, amount: number) => void;
  onHeal: (charId: number, amount: number) => void;
}

export default function CharacterSheet({ character, spellSlots, onDamage, onHeal }: CharacterSheetProps) {
  const [hpDelta, setHpDelta] = useState(1);
  const [flashType, setFlashType] = useState<'damage' | 'heal' | null>(null);
  const hpPercent = Math.round((character.currentHp / character.maxHp) * 100);
  const hpColor = hpPercent > 50 ? 'bg-hp-heal' : hpPercent > 25 ? 'bg-accent' : 'bg-hp-damage';

  const handleDamage = () => {
    onDamage(character.id, hpDelta);
    setFlashType('damage');
    setTimeout(() => setFlashType(null), 600);
  };

  const handleHeal = () => {
    onHeal(character.id, hpDelta);
    setFlashType('heal');
    setTimeout(() => setFlashType(null), 600);
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-5 space-y-5 ${
      flashType === 'damage' ? 'animate-flash-damage' : flashType === 'heal' ? 'animate-flash-heal' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">{character.name}</h3>
          <p className="text-sm text-muted-foreground">
            Level {character.level} {character.characterClass}
          </p>
        </div>
        <Shield className="w-5 h-5 text-primary" />
      </div>

      {/* HP Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-hp-damage" />
            <span className="font-medium text-foreground">HP</span>
          </div>
          <span className="font-mono font-bold text-foreground">
            {character.currentHp} / {character.maxHp}
          </span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full ${hpColor} rounded-full transition-all duration-300`}
            style={{ width: `${Math.max(0, hpPercent)}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="destructive" size="sm" onClick={handleDamage}>
            <Minus className="w-3 h-3" /> Dmg
          </Button>
          <input
            type="number"
            min={1}
            value={hpDelta}
            onChange={(e) => setHpDelta(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-14 h-9 text-center text-sm bg-secondary border border-border rounded-md text-foreground font-mono"
          />
          <Button variant="default" size="sm" className="bg-hp-heal hover:bg-hp-heal/80 text-accent-foreground" onClick={handleHeal}>
            <Plus className="w-3 h-3" /> Heal
          </Button>
        </div>
      </div>

      {/* Attributes */}
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(character.attributes).map(([key, value]) => (
          <div key={key} className="bg-secondary/50 rounded-md p-2 text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{key.slice(0, 3)}</div>
            <div className="text-lg font-bold text-foreground font-mono">{value}</div>
            <div className="text-xs text-muted-foreground">
              {value !== undefined ? (value >= 10 ? `+${Math.floor((value - 10) / 2)}` : `${Math.floor((value - 10) / 2)}`) : ''}
            </div>
          </div>
        ))}
      </div>

      {/* Spell Slots */}
      {spellSlots.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            Spell Slots
          </div>
          <div className="space-y-1.5">
            {spellSlots.map((slot) => (
              <div key={slot.id} className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground w-16">Lvl {slot.spellLevel}</span>
                <div className="flex gap-1">
                  {Array.from({ length: slot.totalSlots }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-sm border ${
                        i < slot.usedSlots
                          ? 'bg-muted border-border'
                          : 'bg-primary/30 border-primary/50'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground ml-auto">
                  {slot.totalSlots - slot.usedSlots}/{slot.totalSlots}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {character.notes && (
        <p className="text-xs text-muted-foreground italic border-t border-border pt-3">{character.notes}</p>
      )}
    </div>
  );
}
