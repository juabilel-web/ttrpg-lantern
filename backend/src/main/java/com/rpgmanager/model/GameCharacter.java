package com.rpgmanager.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "characters")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GameCharacter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "player_id", nullable = false)
    private Long playerId;

    @Column(nullable = false)
    private String name;

    @Column(name = "character_class", nullable = false)
    private String characterClass;

    @Column(nullable = false)
    private int level;

    @Column(columnDefinition = "TEXT")
    private String attributes; // JSON string

    @Column(name = "max_hp", nullable = false)
    private int maxHp;

    @Column(name = "current_hp", nullable = false)
    private int currentHp;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
