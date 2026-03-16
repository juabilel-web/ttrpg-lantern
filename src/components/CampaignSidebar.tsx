import { useState } from 'react';
import { Campaign, Player } from '@/types/rpg';
import { mockCampaign, mockPlayers } from '@/data/mockData';
import { Shield, Users, Settings, Swords, Dices, ScrollText } from 'lucide-react';

interface CampaignSidebarProps {
  campaign: Campaign;
  players: Player[];
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function CampaignSidebar({ campaign, players, activeView, onViewChange }: CampaignSidebarProps) {
  const navItems = [
    { id: 'combat', label: 'Combat', icon: Swords },
    { id: 'characters', label: 'Characters', icon: ScrollText },
  ];

  return (
    <aside className="w-60 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Campaign header */}
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="font-display text-sm font-semibold text-foreground truncate">{campaign.name}</h2>
        <p className="text-xs text-muted-foreground mt-1">{campaign.system}</p>
        <div className="flex items-center gap-1.5 mt-2 px-2 py-1 bg-secondary/50 rounded text-xs text-muted-foreground">
          <Shield className="w-3 h-3" />
          <span>Code: <span className="text-accent font-mono font-bold">{campaign.joinCode}</span></span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Players list */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
          <Users className="w-3 h-3" />
          <span>Players ({players.length})</span>
        </div>
        <ul className="space-y-1.5">
          {players.map((player) => (
            <li key={player.id} className="flex items-center gap-2 text-sm">
              <span className={`w-2 h-2 rounded-full ${player.isGM ? 'bg-accent' : 'bg-hp-heal'}`} />
              <span className="text-sidebar-foreground truncate">{player.name}</span>
              {player.isGM && <span className="text-[10px] text-accent font-bold ml-auto">GM</span>}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
