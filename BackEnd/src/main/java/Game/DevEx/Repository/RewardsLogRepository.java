package Game.DevEx.Repository;

import Game.DevEx.Entity.RewardsLog;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RewardsLogRepository extends CrudRepository<RewardsLog, Integer> {
    // Find all pulls by the user ordered by date, descending
    List<RewardsLog> findAllByUserIdOrderByRewardDateDesc(int userId);
}

