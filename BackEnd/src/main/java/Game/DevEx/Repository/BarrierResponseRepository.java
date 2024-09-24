package Game.DevEx.Repository;

import Game.DevEx.DTOs.AverageBarrierDto;
import Game.DevEx.Entity.BarrierResponse;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface BarrierResponseRepository extends CrudRepository<BarrierResponse, Integer> {


    @Query("SELECT new Game.DevEx.DTOs.AverageBarrierDto(br.barriertoimprovementiId, AVG(br.responseValue)) " +
            "FROM BarrierResponse br GROUP BY br.barriertoimprovementiId ORDER BY br.barriertoimprovementiId ASC")
    List<AverageBarrierDto> findAverageBarrierValuesForAllProjects();
}

