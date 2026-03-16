package com.rpgmanager.controller;

import com.rpgmanager.dto.RollInitiativeRequest;
import com.rpgmanager.model.Combat;
import com.rpgmanager.service.CombatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/combats")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CombatController {

    private final CombatService combatService;

    @PostMapping("/start")
    public ResponseEntity<Combat> startCombat(@RequestParam Long campaignId) {
        return ResponseEntity.ok(combatService.startCombat(campaignId));
    }

    @PostMapping("/{id}/roll-initiative")
    public ResponseEntity<Combat> rollInitiative(@PathVariable Long id, @RequestBody RollInitiativeRequest request) {
        return ResponseEntity.ok(combatService.rollInitiative(id, request));
    }

    @PostMapping("/{id}/next-turn")
    public ResponseEntity<Combat> nextTurn(@PathVariable Long id) {
        return ResponseEntity.ok(combatService.nextTurn(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Combat> getCombat(@PathVariable Long id) {
        return ResponseEntity.ok(combatService.getCombat(id));
    }
}
