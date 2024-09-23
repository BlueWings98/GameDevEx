package Game.DevEx.Repository;

import Game.DevEx.Entity.BarrierToImprovement;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface BarrierToImprovementRepository extends CrudRepository<BarrierToImprovement, Integer> {

    // Metodo para encontrar el ID de una barrera por su nombre
    @Query("SELECT b.barrierToImprovementId FROM BarrierToImprovement b WHERE b.name = :name")
    Integer findIdByName(@Param("name") String name);
}
