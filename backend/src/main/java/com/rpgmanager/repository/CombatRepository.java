package com.rpgmanager.repository;

import com.rpgmanager.model.Combat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CombatRepository extends JpaRepository<Combat, Long> {
    Optional<Combat> findByCampaignIdAndActiveTrue(Long campaignId);
}
