package com.rpgmanager.service;

import com.rpgmanager.dto.*;
import com.rpgmanager.model.Combat;
import com.rpgmanager.model.CombatTurn;
import com.rpgmanager.repository.CombatRepository;
import com.rpgmanager.repository.CombatTurnRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CombatService {

    private final CombatRepository combatRepository;
    private final CombatTurnRepository combatTurnRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public Combat startCombat(Long campaignId) {
        // Deactivate any existing combat
        combatRepository.findByCampaignIdAndActiveTrue(campaignId)
                .ifPresent(c -> {
                    c.setActive(false);
                    combatRepository.save(c);
                });

        Combat combat = Combat.builder()
                .campaignId(campaignId)
                .active(true)
                .currentTurnIndex(0)
                .turns(new ArrayList<>())
                .build();
        return combatRepository.save(combat);
    }

    public Combat rollInitiative(Long combatId, RollInitiativeRequest request) {
        Combat combat = getCombat(combatId);

        // Sort entries by initiative descending
        List<RollInitiativeRequest.InitiativeEntry> sorted = request.getEntries().stream()
                .sorted(Comparator.comparingInt(RollInitiativeRequest.InitiativeEntry::getInitiative).reversed())
                .toList();

        // Clear existing turns
        combatTurnRepository.deleteAll(combat.getTurns());

        List<CombatTurn> turns = new ArrayList<>();
        for (int i = 0; i < sorted.size(); i++) {
            var entry = sorted.get(i);
            CombatTurn turn = CombatTurn.builder()
                    .combatId(combatId)
                    .entityType(entry.getEntityType())
                    .entityId(entry.getEntityId())
                    .entityName(entry.getEntityName())
                    .initiative(entry.getInitiative())
                    .orderIndex(i)
                    .build();
            turns.add(combatTurnRepository.save(turn));
        }

        combat.setTurns(turns);
        combat.setCurrentTurnIndex(0);
        Combat saved = combatRepository.save(combat);

        broadcastCombatEvent(saved);
        return saved;
    }

    public Combat nextTurn(Long combatId) {
        Combat combat = getCombat(combatId);
        int nextIndex = (combat.getCurrentTurnIndex() + 1) % combat.getTurns().size();
        combat.setCurrentTurnIndex(nextIndex);
        Combat saved = combatRepository.save(combat);

        broadcastCombatEvent(saved);
        return saved;
    }

    public Combat getCombat(Long id) {
        return combatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Combat not found: " + id));
    }

    private void broadcastCombatEvent(Combat combat) {
        CombatTurn currentTurn = combat.getTurns().get(combat.getCurrentTurnIndex());
        GameEvent event = GameEvent.builder()
                .type("COMBAT_TURN")
                .payload(combat)
                .timestamp(LocalDateTime.now().toString())
                .build();
        messagingTemplate.convertAndSend("/topic/combat", event);
    }
}
