package com.rpgmanager.repository;

import com.rpgmanager.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByCampaignIdOrderByTimestampAsc(Long campaignId);
}
