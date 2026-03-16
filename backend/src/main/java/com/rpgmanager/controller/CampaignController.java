package com.rpgmanager.controller;

import com.rpgmanager.dto.*;
import com.rpgmanager.model.Campaign;
import com.rpgmanager.model.Player;
import com.rpgmanager.service.CampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/campaigns")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CampaignController {

    private final CampaignService campaignService;

    @PostMapping
    public ResponseEntity<Campaign> createCampaign(@RequestBody CreateCampaignRequest request) {
        return ResponseEntity.ok(campaignService.createCampaign(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Campaign> getCampaign(@PathVariable Long id) {
        return ResponseEntity.ok(campaignService.getCampaign(id));
    }

    @PostMapping("/join")
    public ResponseEntity<Player> joinCampaign(@RequestBody JoinCampaignRequest request) {
        return ResponseEntity.ok(campaignService.joinCampaign(request));
    }

    @GetMapping("/{id}/players")
    public ResponseEntity<List<Player>> getCampaignPlayers(@PathVariable Long id) {
        return ResponseEntity.ok(campaignService.getCampaignPlayers(id));
    }
}
