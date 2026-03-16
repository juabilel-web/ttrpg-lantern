package com.rpgmanager.service;

import com.rpgmanager.dto.*;
import com.rpgmanager.model.ChatMessage;
import com.rpgmanager.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatMessage sendMessage(ChatMessageRequest request) {
        ChatMessage message = ChatMessage.builder()
                .campaignId(request.getCampaignId())
                .senderId(request.getSenderId())
                .senderName(request.getSenderName())
                .targetPlayerId(request.getTargetPlayerId())
                .content(request.getContent())
                .build();
        ChatMessage saved = chatMessageRepository.save(message);

        // Broadcast to campaign topic
        if (request.getTargetPlayerId() == null) {
            messagingTemplate.convertAndSend(
                    "/topic/campaign/" + request.getCampaignId() + "/chat", saved);
        } else {
            // Private message - send to specific user topic
            messagingTemplate.convertAndSend(
                    "/topic/campaign/" + request.getCampaignId() + "/chat/player/" + request.getTargetPlayerId(), saved);
            // Also send to sender
            messagingTemplate.convertAndSend(
                    "/topic/campaign/" + request.getCampaignId() + "/chat/player/" + request.getSenderId(), saved);
        }

        // Broadcast event
        GameEvent event = GameEvent.builder()
                .type("CHAT_MESSAGE")
                .payload(saved)
                .timestamp(LocalDateTime.now().toString())
                .build();
        messagingTemplate.convertAndSend(
                "/topic/campaign/" + request.getCampaignId() + "/events", event);

        return saved;
    }

    public List<ChatMessage> getCampaignMessages(Long campaignId) {
        return chatMessageRepository.findByCampaignIdOrderByTimestampAsc(campaignId);
    }
}
