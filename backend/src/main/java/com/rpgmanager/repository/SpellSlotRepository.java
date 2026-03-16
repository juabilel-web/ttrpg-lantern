package com.rpgmanager.repository;

import com.rpgmanager.model.SpellSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SpellSlotRepository extends JpaRepository<SpellSlot, Long> {
    List<SpellSlot> findByCharacterId(Long characterId);
}
