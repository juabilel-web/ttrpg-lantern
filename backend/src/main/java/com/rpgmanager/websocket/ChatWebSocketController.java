package com.rpgmanager.websocket;

import com.rpgmanager.dto.ChatMessageRequest;
import com.rpgmanager.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatService chatService;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessageRequest request) {
        chatService.sendMessage(request);
    }
}
