package Game.DevEx.Repository;

import Game.DevEx.Entity.Totolo;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TotoloRepository extends CrudRepository<Totolo, Integer> {
}
