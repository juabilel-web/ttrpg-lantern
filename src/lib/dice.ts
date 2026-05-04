export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

export function rollDice(count: number, sides: number): number[] {
  return Array.from({ length: count }, () => rollDie(sides));
}

export interface RollResult {
  expression: string;
  rolls: number[];
  modifier: number;
  total: number;
}

export function rollD20(modifier = 0, label = 'd20'): RollResult {
  const r = rollDie(20);
  return { expression: `${label} (1d20${fmtMod(modifier)})`, rolls: [r], modifier, total: r + modifier };
}

export function fmtMod(n: number): string {
  if (n === 0) return '';
  return n > 0 ? `+${n}` : `${n}`;
}

export function parseExpression(expr: string): RollResult {
  const m = expr.trim().toLowerCase().match(/^(\d*)d(\d+)\s*([+-]\s*\d+)?$/);
  if (!m) throw new Error('Expressão inválida');
  const count = m[1] ? parseInt(m[1]) : 1;
  const sides = parseInt(m[2]);
  const modifier = m[3] ? parseInt(m[3].replace(/\s+/g, '')) : 0;
  const rolls = rollDice(count, sides);
  const total = rolls.reduce((a, b) => a + b, 0) + modifier;
  return { expression: expr, rolls, modifier, total };
}
