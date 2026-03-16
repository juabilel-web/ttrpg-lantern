package com.rpgmanager.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SpellSlotRequest {
    private int spellLevel;
    private int totalSlots;
    private int usedSlots;
}
