import { useState } from 'react';
import { CombatEntity, EntityKind } from '@/types/combat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (entity: Omit<CombatEntity, 'id' | 'conditions' | 'dead' | 'unconscious' | 'initiative'>, copies: number, sharedHp: boolean) => void;
  initial?: CombatEntity | null;
}

const empty = {
  name: '', kind: 'enemy' as EntityKind, hp: 10, maxHp: 10,
  ac: 10, bab: 0, fort: 0, ref: 0, will: 0, initiativeMod: 0,
};

export default function EntityDialog({ open, onClose, onSave, initial }: Props) {
  const [form, setForm] = useState(initial ? {
    name: initial.name, kind: initial.kind, hp: initial.hp, maxHp: initial.maxHp,
    ac: initial.ac, bab: initial.bab, fort: initial.fort, ref: initial.ref,
    will: initial.will, initiativeMod: initial.initiativeMod,
  } : empty);
  const [copies, setCopies] = useState(1);
  const [sharedHp, setSharedHp] = useState(false);

  const update = (k: keyof typeof form, v: string | number) =>
    setForm((p) => ({ ...p, [k]: v }));

  const num = (k: keyof typeof form) => (
    <Input type="number" value={form[k] as number}
      onChange={(e) => update(k, parseInt(e.target.value) || 0)} />
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? 'Editar' : 'Nova'} Entidade</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label>Nome</Label>
            <Input value={form.name} onChange={(e) => update('name', e.target.value)} autoFocus />
          </div>
          <div>
            <Label>Tipo</Label>
            <select className="w-full h-10 rounded-md bg-background border border-input px-3"
              value={form.kind} onChange={(e) => update('kind', e.target.value as EntityKind)}>
              <option value="enemy">Inimigo</option>
              <option value="player">Jogador</option>
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
          {!initial && form.kind === 'enemy' && (
            <>
              <div>
                <Label>Cópias</Label>
                <Input type="number" min={1} value={copies}
                  onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))} />
              </div>
              <div className="flex items-end gap-2">
                <input type="checkbox" id="shared" checked={sharedHp}
                  onChange={(e) => setSharedHp(e.target.checked)} className="w-4 h-4" />
                <Label htmlFor="shared" className="cursor-pointer">HP compartilhado</Label>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => { onSave(form, copies, sharedHp); onClose(); }}
            disabled={!form.name.trim()}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
