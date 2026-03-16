import { useState } from 'react';
import { parseDiceExpression } from '@/utils/dice';
import { DiceRollResult } from '@/types/rpg';
import { Dices, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DiceRollerFABProps {
  onRoll: (result: DiceRollResult) => void;
}

const quickDice = ['d20', '2d6', 'd12', 'd10', 'd8', 'd4'];

export default function DiceRollerFAB({ onRoll }: DiceRollerFABProps) {
  const [open, setOpen] = useState(false);
  const [expression, setExpression] = useState('1d20');
  const [lastResult, setLastResult] = useState<DiceRollResult | null>(null);
  const [shaking, setShaking] = useState(false);

  const handleRoll = (expr?: string) => {
    try {
      const result = parseDiceExpression(expr || expression);
      setLastResult(result);
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      onRoll(result);
    } catch {
      // invalid expression
    }
  };

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-150 flex items-center justify-center"
      >
        {open ? <X className="w-6 h-6" /> : <Dices className="w-6 h-6" />}
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-72 bg-card border border-border rounded-lg shadow-2xl p-4 animate-slide-in">
          <h3 className="font-display text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Dices className="w-4 h-4 text-accent" /> Quick Roll
          </h3>

          {/* Quick dice buttons */}
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {quickDice.map((d) => (
              <Button
                key={d}
                variant="dice"
                size="sm"
                onClick={() => handleRoll(d)}
                className="text-xs"
              >
                {d}
              </Button>
            ))}
          </div>

          {/* Custom expression */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRoll()}
              placeholder="e.g. 2d6+3"
              className="flex-1 h-9 px-3 text-sm bg-secondary border border-border rounded-md text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <Button variant="dice" size="sm" onClick={() => handleRoll()}>
              Roll
            </Button>
          </div>

          {/* Result */}
          {lastResult && (
            <div className="bg-secondary/50 rounded-md p-3 border border-accent/20 text-center">
              <div className="text-xs text-muted-foreground mb-1">{lastResult.expression}</div>
              <div className={`text-3xl font-bold font-mono text-accent ${shaking ? 'animate-shake' : ''}`}>
                {lastResult.result}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                [{lastResult.rolls.join(', ')}]
                {lastResult.modifier !== 0 && ` ${lastResult.modifier > 0 ? '+' : ''}${lastResult.modifier}`}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
