import { useState, useCallback } from 'react';
import { DiceRollResult } from '@/types/rpg';
import { mockCampaign, mockPlayers, mockCharacters, mockSpellSlots, mockCombat, mockMessages } from '@/data/mockData';
import CampaignSidebar from '@/components/CampaignSidebar';
import CombatTracker from '@/components/CombatTracker';
import CharacterSheet from '@/components/CharacterSheet';
import UnifiedLog from '@/components/UnifiedLog';
import DiceRollerFAB from '@/components/DiceRollerFAB';

const Index = () => {
  const [activeView, setActiveView] = useState('combat');
  const [combat, setCombat] = useState(mockCombat);
  const [characters, setCharacters] = useState(mockCharacters);
  const [messages, setMessages] = useState(mockMessages);
  const [diceResults, setDiceResults] = useState<DiceRollResult[]>([]);

  const handleNextTurn = useCallback(() => {
    setCombat((prev) => ({
      ...prev,
      currentTurnIndex: (prev.currentTurnIndex + 1) % prev.turns.length,
    }));
  }, []);

  const handleDamage = useCallback((charId: number, amount: number) => {
    setCharacters((prev) =>
      prev.map((c) =>
        c.id === charId ? { ...c, currentHp: Math.max(0, c.currentHp - amount) } : c
      )
    );
  }, []);

  const handleHeal = useCallback((charId: number, amount: number) => {
    setCharacters((prev) =>
      prev.map((c) =>
        c.id === charId ? { ...c, currentHp: Math.min(c.maxHp, c.currentHp + amount) } : c
      )
    );
  }, []);

  const handleSendMessage = useCallback((content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        campaignId: 1,
        senderId: 1,
        senderName: 'You',
        content,
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  const handleDiceRoll = useCallback((result: DiceRollResult) => {
    setDiceResults((prev) => [...prev, result]);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <CampaignSidebar
        campaign={mockCampaign}
        players={mockPlayers}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Center Stage */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-12 border-b border-border flex items-center px-6">
          <h1 className="font-display text-base font-semibold text-foreground">
            {activeView === 'combat' ? 'Combat Tracker' : 'Character Sheets'}
          </h1>
        </header>

        {activeView === 'combat' ? (
          <CombatTracker
            combat={combat}
            onNextTurn={handleNextTurn}
            onStartCombat={() => setCombat({ ...mockCombat, active: true })}
          />
        ) : (
          <div className="flex-1 overflow-auto p-6 grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 auto-rows-min">
            {characters.map((char) => (
              <CharacterSheet
                key={char.id}
                character={char}
                spellSlots={mockSpellSlots.filter((s) => s.characterId === char.id)}
                onDamage={handleDamage}
                onHeal={handleHeal}
              />
            ))}
          </div>
        )}
      </main>

      <UnifiedLog messages={messages} diceResults={diceResults} onSendMessage={handleSendMessage} />
      <DiceRollerFAB onRoll={handleDiceRoll} />
    </div>
  );
};

export default Index;
