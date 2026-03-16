package com.rpgmanager.controller;

import com.rpgmanager.dto.DiceRollRequest;
import com.rpgmanager.dto.DiceRollResponse;
import com.rpgmanager.service.DiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dice")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DiceController {

    private final DiceService diceService;

    @PostMapping("/roll")
    public ResponseEntity<DiceRollResponse> roll(@RequestBody DiceRollRequest request) {
        return ResponseEntity.ok(diceService.roll(request));
    }
}
