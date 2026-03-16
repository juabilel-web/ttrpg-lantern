package com.rpgmanager.service;

import com.rpgmanager.dto.*;
import com.rpgmanager.model.Campaign;
import com.rpgmanager.model.Player;
import com.rpgmanager.repository.CampaignRepository;
import com.rpgmanager.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final PlayerRepository playerRepository;

    public Campaign createCampaign(CreateCampaignRequest request) {
        Campaign campaign = Campaign.builder()
                .name(request.getName())
                .system(request.getSystem())
                .joinCode(UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .build();
        return campaignRepository.save(campaign);
    }

    public Campaign getCampaign(Long id) {
        return campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found: " + id));
    }

    public Player joinCampaign(JoinCampaignRequest request) {
        Campaign campaign = campaignRepository.findByJoinCode(request.getJoinCode())
                .orElseThrow(() -> new RuntimeException("Invalid join code: " + request.getJoinCode()));

        Player player = Player.builder()
                .name(request.getPlayerName())
                .campaignId(campaign.getId())
                .isGM(false)
                .build();
        return playerRepository.save(player);
    }

    public List<Player> getCampaignPlayers(Long campaignId) {
        return playerRepository.findByCampaignId(campaignId);
    }
}
