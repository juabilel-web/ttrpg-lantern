package com.rpgmanager.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HpChangeRequest {
    private int amount;
}
