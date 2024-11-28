package Game.DevEx.Repository;

import Game.DevEx.DTOs.AverageDxFactorDto;
import Game.DevEx.Entity.Survey;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface SurveyRepository extends CrudRepository<Survey, Integer> {

    // Existing method to find all surveys by project ID
    Iterable<Survey> findAllByProjectID(int projectID);

    // Find average DX factor values for all projects
    @Query("SELECT new Game.DevEx.DTOs.AverageDxFactorDto(s.DXFactorID, AVG(s.DXFactorValue)) " +
            "FROM Survey s WHERE s.projectID = ?1 GROUP BY s.DXFactorID ORDER BY s.DXFactorID ASC")
    List<AverageDxFactorDto> findAverageDxfactorValuesByProjectID(int projectID);


    // Find average DX factor values for a specific project
    @Query("SELECT new Game.DevEx.DTOs.AverageDxFactorDto(s.DXFactorID, AVG(s.DXFactorValue)) " +
            "FROM Survey s GROUP BY s.DXFactorID ORDER BY s.DXFactorID ASC")
    List<AverageDxFactorDto> findAverageDxfactorValuesForAllProjects();

    long countByProjectID(int projectID);
}

