package com.rpgmanager.dto;

import lombok.*;
import com.rpgmanager.model.CombatTurn;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RollInitiativeRequest {
    private List<InitiativeEntry> entries;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class InitiativeEntry {
        private CombatTurn.EntityType entityType;
        private Long entityId;
        private String entityName;
        private int initiative;
    }
}
