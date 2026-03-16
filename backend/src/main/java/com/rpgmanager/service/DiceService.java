package com.rpgmanager.service;

import com.rpgmanager.dto.*;
import com.rpgmanager.util.DiceParser;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DiceService {

    private final SimpMessagingTemplate messagingTemplate;

    public DiceRollResponse roll(DiceRollRequest request) {
        DiceRollResponse response = DiceParser.parse(request.getExpression());

        // Broadcast dice roll event
        GameEvent event = GameEvent.builder()
                .type("DICE_ROLL")
                .payload(response)
                .timestamp(LocalDateTime.now().toString())
                .build();
        messagingTemplate.convertAndSend("/topic/events", event);

        return response;
    }
}
