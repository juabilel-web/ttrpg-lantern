package com.rpgmanager.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "combat_turns")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CombatTurn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "combat_id", nullable = false)
    private Long combatId;

    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type", nullable = false)
    private EntityType entityType;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Column(name = "entity_name", nullable = false)
    private String entityName;

    @Column(nullable = false)
    private int initiative;

    @Column(name = "order_index", nullable = false)
    private int orderIndex;

    public enum EntityType {
        PLAYER, NPC
    }
}
