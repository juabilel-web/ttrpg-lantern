import { useState, useRef, useEffect } from 'react';
import { ChatMessage, DiceRollResult } from '@/types/rpg';
import { Send, Dices } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LogEntry {
  type: 'chat' | 'dice' | 'event';
  data: ChatMessage | DiceRollResult | { message: string };
  timestamp: string;
}

interface UnifiedLogProps {
  messages: ChatMessage[];
  diceResults: DiceRollResult[];
  onSendMessage: (content: string) => void;
}

export default function UnifiedLog({ messages, diceResults, onSendMessage }: UnifiedLogProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Combine and sort all log entries
  const entries: LogEntry[] = [
    ...messages.map((m) => ({ type: 'chat' as const, data: m, timestamp: m.timestamp })),
    ...diceResults.map((d) => ({ type: 'dice' as const, data: d, timestamp: new Date().toISOString() })),
  ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [entries.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <aside className="w-72 bg-card border-l border-border flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <h3 className="font-display text-sm font-semibold text-foreground">Session Log</h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
        {entries.map((entry, i) => {
          if (entry.type === 'chat') {
            const msg = entry.data as ChatMessage;
            return (
              <div key={`chat-${msg.id}`} className="animate-slide-in">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-semibold text-primary">{msg.senderName}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-foreground/90 mt-0.5">{msg.content}</p>
              </div>
            );
          }
          if (entry.type === 'dice') {
            const roll = entry.data as DiceRollResult;
            return (
              <div key={`dice-${i}`} className="bg-secondary/50 rounded-md p-2 border border-accent/20 animate-slide-in">
                <div className="flex items-center gap-1.5">
                  <Dices className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs font-semibold text-accent">{roll.expression}</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-accent animate-shake">{roll.result}</span>
                  <span className="text-xs text-muted-foreground">
                    [{roll.rolls.join(', ')}]{roll.modifier !== 0 ? ` ${roll.modifier > 0 ? '+' : ''}${roll.modifier}` : ''}
                  </span>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-border flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message..."
          className="flex-1 h-9 px-3 text-sm bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <Button type="submit" size="icon" variant="ghost" className="h-9 w-9">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </aside>
  );
}
