package com.rpgmanager.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateCharacterRequest {
    private Long playerId;
    private String name;
    private String characterClass;
    private int level;
    private String attributes; // JSON string
    private int maxHp;
    private int currentHp;
    private String notes;
}
