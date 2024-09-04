package Game.DevEx.Repository;

import Game.DevEx.Entity.DXFactor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DXFactorRepository extends CrudRepository<DXFactor, Integer>{
}
