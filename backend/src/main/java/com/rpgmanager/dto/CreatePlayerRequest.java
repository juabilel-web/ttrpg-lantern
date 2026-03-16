package com.rpgmanager.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CreatePlayerRequest {
    private String name;
    private Long campaignId;
    private boolean isGM;
}
