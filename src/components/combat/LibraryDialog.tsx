import { useState } from 'react';
import { CharacterPreset, listPresets, savePreset, deletePreset } from '@/lib/library';
import { EntityKind } from '@/types/combat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2, Plus, UserPlus, BookOpen } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onAddToCombat: (preset: CharacterPreset) => void;
}

const empty = {
  name: '', kind: 'player' as EntityKind, hp: 10, maxHp: 10,
  ac: 10, bab: 0, fort: 0, ref: 0, will: 0, initiativeMod: 0,
};

export default function LibraryDialog({ open, onClose, onAddToCombat }: Props) {
  const [presets, setPresets] = useState<CharacterPreset[]>(listPresets());
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(empty);

  const refresh = () => setPresets(listPresets());

  const update = (k: keyof typeof form, v: string | number) =>
    setForm((p) => ({ ...p, [k]: v }));

  const num = (k: keyof typeof form) => (
    <Input type="number" value={form[k] as number}
      onChange={(e) => update(k, parseInt(e.target.value) || 0)} />
  );

  const handleSave = () => {
    if (!form.name.trim()) return;
    savePreset(form);
    setForm(empty);
    setCreating(false);
    refresh();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Remover este personagem da biblioteca?')) return;
    deletePreset(id);
    refresh();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> Biblioteca de Personagens
          </DialogTitle>
        </DialogHeader>

        {!creating ? (
          <>
            <div className="flex justify-end">
              <Button size="sm" onClick={() => setCreating(true)}>
                <Plus className="w-3.5 h-3.5" /> Novo Personagem
              </Button>
            </div>
            <div className="flex-1 overflow-auto space-y-1.5 mt-2">
              {presets.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  Nenhum personagem salvo. Crie um para reutilizar entre combates.
                </div>
              )}
              {presets.map((p) => (
                <div key={p.id} className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
                  <div className={`w-10 h-10 rounded shrink-0 flex items-center justify-center font-bold ${
                    p.kind === 'enemy' ? 'bg-hp-damage/20 text-hp-damage' : 'bg-primary/20 text-primary'
                  }`}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground">
                      HP {p.maxHp} · CA {p.ac} · Init {p.initiativeMod >= 0 ? '+' : ''}{p.initiativeMod} ·
                      {' '}BBA {p.bab >= 0 ? '+' : ''}{p.bab} · F/R/V {p.fort}/{p.ref}/{p.will}
                    </div>
                  </div>
                  <Button size="sm" variant="combat" onClick={() => onAddToCombat(p)}>
                    <UserPlus className="w-3.5 h-3.5" /> Adicionar
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-hp-damage" onClick={() => handleDelete(p.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Nome</Label>
                <Input value={form.name} onChange={(e) => update('name', e.target.value)} autoFocus />
              </div>
              <div>
                <Label>Tipo</Label>
                <select className="w-full h-10 rounded-md bg-background border border-input px-3"
                  value={form.kind} onChange={(e) => update('kind', e.target.value as EntityKind)}>
                  <option value="player">Jogador</option>
                  <option value="enemy">Inimigo</option>
                </select>
              </div>
              <div><Label>Mod. Iniciativa</Label>{num('initiativeMod')}</div>
              <div><Label>HP atual</Label>{num('hp')}</div>
              <div><Label>HP máximo</Label>{num('maxHp')}</div>
              <div><Label>CA</Label>{num('ac')}</div>
              <div><Label>BBA</Label>{num('bab')}</div>
              <div><Label>Fortitude</Label>{num('fort')}</div>
              <div><Label>Reflexos</Label>{num('ref')}</div>
              <div><Label>Vontade</Label>{num('will')}</div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => { setCreating(false); setForm(empty); }}>Cancelar</Button>
              <Button onClick={handleSave} disabled={!form.name.trim()}>Salvar na Biblioteca</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
