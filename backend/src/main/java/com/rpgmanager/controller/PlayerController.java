package com.rpgmanager.controller;

import com.rpgmanager.dto.CreatePlayerRequest;
import com.rpgmanager.model.Player;
import com.rpgmanager.service.PlayerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/players")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PlayerController {

    private final PlayerService playerService;

    @PostMapping
    public ResponseEntity<Player> createPlayer(@RequestBody CreatePlayerRequest request) {
        return ResponseEntity.ok(playerService.createPlayer(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayer(@PathVariable Long id) {
        return ResponseEntity.ok(playerService.getPlayer(id));
    }
}
