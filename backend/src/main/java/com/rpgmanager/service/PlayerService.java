package com.rpgmanager.service;

import com.rpgmanager.dto.CreatePlayerRequest;
import com.rpgmanager.model.Player;
import com.rpgmanager.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;

    public Player createPlayer(CreatePlayerRequest request) {
        Player player = Player.builder()
                .name(request.getName())
                .campaignId(request.getCampaignId())
                .isGM(request.isGM())
                .build();
        return playerRepository.save(player);
    }

    public Player getPlayer(Long id) {
        return playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Player not found: " + id));
    }
}
