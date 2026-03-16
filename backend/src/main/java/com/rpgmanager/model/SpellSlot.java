package com.rpgmanager.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "spell_slots")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SpellSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "character_id", nullable = false)
    private Long characterId;

    @Column(name = "spell_level", nullable = false)
    private int spellLevel;

    @Column(name = "total_slots", nullable = false)
    private int totalSlots;

    @Column(name = "used_slots", nullable = false)
    private int usedSlots;
}
