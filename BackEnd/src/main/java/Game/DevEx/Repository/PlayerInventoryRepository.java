package Game.DevEx.Repository;

import Game.DevEx.Entity.PlayerInventory;
import Game.DevEx.Entity.PlayerInventoryId;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerInventoryRepository extends CrudRepository<PlayerInventory, PlayerInventoryId> {

    // Query method to find gameItemId and quantity by userId
    @Query("SELECT p.id.gameItemId, p.quantity FROM PlayerInventory p WHERE p.id.userId = :userId")
    List<Object[]> findGameItemIdsAndQuantitiesByUserId(@Param("userId") int userId);
}
