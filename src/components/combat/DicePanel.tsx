import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { parseExpression, rollDie } from '@/lib/dice';
import { Dices } from 'lucide-react';

interface Props {
  onRoll: (text: string) => void;
}

const QUICK = [4, 6, 8, 10, 12, 20];

export default function DicePanel({ onRoll }: Props) {
  const [expr, setExpr] = useState('1d20');

  const quick = (s: number) => {
    const r = rollDie(s);
    onRoll(`d${s}: ${r}`);
  };

  const custom = () => {
    try {
      const r = parseExpression(expr);
      onRoll(`${r.expression} = ${r.total} [${r.rolls.join(', ')}${r.modifier ? ` ${r.modifier > 0 ? '+' : ''}${r.modifier}` : ''}]`);
    } catch {
      onRoll(`Expressão inválida: ${expr}`);
    }
  };

  return (
    <div className="border-t border-border p-3 space-y-2">
      <div className="flex items-center gap-2">
        <Dices className="w-4 h-4 text-accent" />
        <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Dados rápidos</span>
      </div>
      <div className="grid grid-cols-6 gap-1">
        {QUICK.map((s) => (
          <Button key={s} variant="dice" size="sm" className="h-8 px-0 text-xs" onClick={() => quick(s)}>
            d{s}
          </Button>
        ))}
      </div>
      <div className="flex gap-1">
        <Input className="h-8 text-xs font-mono" value={expr} onChange={(e) => setExpr(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') custom(); }} placeholder="ex: 2d6+3" />
        <Button size="sm" className="h-8" onClick={custom}>Rolar</Button>
      </div>
    </div>
  );
}
