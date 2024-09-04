package Game.DevEx.Repository;

import Game.DevEx.Entity.Metric;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MetricRepository extends CrudRepository<Metric, Integer> {
}
