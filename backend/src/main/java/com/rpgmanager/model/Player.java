package com.rpgmanager.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "players")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "campaign_id", nullable = false)
    private Long campaignId;

    @Column(name = "is_gm", nullable = false)
    private boolean isGM;
}
