package com.rpgmanager.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "combats")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Combat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "campaign_id", nullable = false)
    private Long campaignId;

    @Column(nullable = false)
    private boolean active;

    @Column(name = "current_turn_index", nullable = false)
    private int currentTurnIndex;

    @OneToMany(mappedBy = "combatId", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @OrderBy("orderIndex ASC")
    private List<CombatTurn> turns;
}
