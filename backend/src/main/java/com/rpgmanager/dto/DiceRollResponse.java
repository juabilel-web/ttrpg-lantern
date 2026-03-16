package com.rpgmanager.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DiceRollResponse {
    private String expression;
    private int result;
    private List<Integer> rolls;
    private int modifier;
}
