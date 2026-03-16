package com.rpgmanager.repository;

import com.rpgmanager.model.CombatTurn;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CombatTurnRepository extends JpaRepository<CombatTurn, Long> {
    List<CombatTurn> findByCombatIdOrderByOrderIndexAsc(Long combatId);
}
