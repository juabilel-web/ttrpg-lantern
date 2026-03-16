package com.rpgmanager.repository;

import com.rpgmanager.model.GameCharacter;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CharacterRepository extends JpaRepository<GameCharacter, Long> {
    Optional<GameCharacter> findByPlayerId(Long playerId);
}
