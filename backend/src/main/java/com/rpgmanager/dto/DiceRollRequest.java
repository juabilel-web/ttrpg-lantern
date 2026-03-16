package com.rpgmanager.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DiceRollRequest {
    private String expression;
}
