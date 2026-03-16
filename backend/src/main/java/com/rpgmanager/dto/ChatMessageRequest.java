package com.rpgmanager.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChatMessageRequest {
    private Long campaignId;
    private Long senderId;
    private String senderName;
    private Long targetPlayerId;
    private String content;
}
