package com.rpgmanager.repository;

import com.rpgmanager.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByCampaignId(Long campaignId);
}
