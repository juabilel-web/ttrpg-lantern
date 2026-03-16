package com.rpgmanager.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class JoinCampaignRequest {
    private String joinCode;
    private String playerName;
}
