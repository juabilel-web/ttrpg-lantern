package com.rpgmanager.controller;

import com.rpgmanager.dto.*;
import com.rpgmanager.model.GameCharacter;
import com.rpgmanager.model.SpellSlot;
import com.rpgmanager.service.CharacterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CharacterController {

    private final CharacterService characterService;

    @PostMapping("/characters")
    public ResponseEntity<GameCharacter> createCharacter(@RequestBody CreateCharacterRequest request) {
        return ResponseEntity.ok(characterService.createCharacter(request));
    }

    @GetMapping("/characters/{id}")
    public ResponseEntity<GameCharacter> getCharacter(@PathVariable Long id) {
        return ResponseEntity.ok(characterService.getCharacter(id));
    }

    @PutMapping("/characters/{id}")
    public ResponseEntity<GameCharacter> updateCharacter(@PathVariable Long id, @RequestBody CreateCharacterRequest request) {
        return ResponseEntity.ok(characterService.updateCharacter(id, request));
    }

    @GetMapping("/players/{playerId}/character")
    public ResponseEntity<GameCharacter> getCharacterByPlayer(@PathVariable Long playerId) {
        return ResponseEntity.ok(characterService.getCharacterByPlayerId(playerId));
    }

    @PostMapping("/characters/{id}/damage")
    public ResponseEntity<GameCharacter> damage(@PathVariable Long id, @RequestBody HpChangeRequest request) {
        return ResponseEntity.ok(characterService.damage(id, request.getAmount()));
    }

    @PostMapping("/characters/{id}/heal")
    public ResponseEntity<GameCharacter> heal(@PathVariable Long id, @RequestBody HpChangeRequest request) {
        return ResponseEntity.ok(characterService.heal(id, request.getAmount()));
    }

    @PostMapping("/characters/{id}/spell-slots")
    public ResponseEntity<SpellSlot> createSpellSlot(@PathVariable Long id, @RequestBody SpellSlotRequest request) {
        return ResponseEntity.ok(characterService.createSpellSlot(id, request));
    }

    @PutMapping("/spell-slots/{id}")
    public ResponseEntity<SpellSlot> updateSpellSlot(@PathVariable Long id, @RequestBody SpellSlotRequest request) {
        return ResponseEntity.ok(characterService.updateSpellSlot(id, request));
    }
}
