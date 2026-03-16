package com.rpgmanager.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GameEvent {
    private String type; // HP_CHANGE, COMBAT_TURN, DICE_ROLL, CHAT_MESSAGE
    private Object payload;
    private String timestamp;
}
