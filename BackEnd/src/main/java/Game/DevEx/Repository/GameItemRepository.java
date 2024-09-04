package Game.DevEx.Repository;

import Game.DevEx.Entity.GameItem;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameItemRepository extends CrudRepository<GameItem, Integer> {
}
