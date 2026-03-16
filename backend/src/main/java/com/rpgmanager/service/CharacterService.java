package com.rpgmanager.service;

import com.rpgmanager.dto.*;
import com.rpgmanager.model.GameCharacter;
import com.rpgmanager.model.SpellSlot;
import com.rpgmanager.repository.CharacterRepository;
import com.rpgmanager.repository.SpellSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CharacterService {

    private final CharacterRepository characterRepository;
    private final SpellSlotRepository spellSlotRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public GameCharacter createCharacter(CreateCharacterRequest request) {
        GameCharacter character = GameCharacter.builder()
                .playerId(request.getPlayerId())
                .name(request.getName())
                .characterClass(request.getCharacterClass())
                .level(request.getLevel())
                .attributes(request.getAttributes())
                .maxHp(request.getMaxHp())
                .currentHp(request.getCurrentHp())
                .notes(request.getNotes())
                .build();
        return characterRepository.save(character);
    }

    public GameCharacter getCharacter(Long id) {
        return characterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Character not found: " + id));
    }

    public GameCharacter updateCharacter(Long id, CreateCharacterRequest request) {
        GameCharacter character = getCharacter(id);
        character.setName(request.getName());
        character.setCharacterClass(request.getCharacterClass());
        character.setLevel(request.getLevel());
        character.setAttributes(request.getAttributes());
        character.setMaxHp(request.getMaxHp());
        character.setCurrentHp(request.getCurrentHp());
        character.setNotes(request.getNotes());
        return characterRepository.save(character);
    }

    public GameCharacter getCharacterByPlayerId(Long playerId) {
        return characterRepository.findByPlayerId(playerId)
                .orElseThrow(() -> new RuntimeException("Character not found for player: " + playerId));
    }

    public GameCharacter damage(Long id, int amount) {
        GameCharacter character = getCharacter(id);
        character.setCurrentHp(Math.max(0, character.getCurrentHp() - amount));
        GameCharacter saved = characterRepository.save(character);
        broadcastHpChange(saved, "DAMAGE", amount);
        return saved;
    }

    public GameCharacter heal(Long id, int amount) {
        GameCharacter character = getCharacter(id);
        character.setCurrentHp(Math.min(character.getMaxHp(), character.getCurrentHp() + amount));
        GameCharacter saved = characterRepository.save(character);
        broadcastHpChange(saved, "HEAL", amount);
        return saved;
    }

    public SpellSlot createSpellSlot(Long characterId, SpellSlotRequest request) {
        SpellSlot slot = SpellSlot.builder()
                .characterId(characterId)
                .spellLevel(request.getSpellLevel())
                .totalSlots(request.getTotalSlots())
                .usedSlots(request.getUsedSlots())
                .build();
        return spellSlotRepository.save(slot);
    }

    public SpellSlot updateSpellSlot(Long id, SpellSlotRequest request) {
        SpellSlot slot = spellSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Spell slot not found: " + id));
        slot.setSpellLevel(request.getSpellLevel());
        slot.setTotalSlots(request.getTotalSlots());
        slot.setUsedSlots(request.getUsedSlots());
        return spellSlotRepository.save(slot);
    }

    private void broadcastHpChange(GameCharacter character, String changeType, int amount) {
        GameEvent event = GameEvent.builder()
                .type("HP_CHANGE")
                .payload(new HpChangePayload(character.getId(), character.getName(),
                        character.getCurrentHp(), character.getMaxHp(), changeType, amount))
                .timestamp(LocalDateTime.now().toString())
                .build();
        messagingTemplate.convertAndSend("/topic/events", event);
    }

    @lombok.Getter @lombok.AllArgsConstructor
    private static class HpChangePayload {
        private Long characterId;
        private String characterName;
        private int currentHp;
        private int maxHp;
        private String changeType;
        private int amount;
    }
}
