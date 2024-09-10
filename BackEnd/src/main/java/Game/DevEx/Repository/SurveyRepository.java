package Game.DevEx.Repository;

import Game.DevEx.Entity.Survey;
import org.springframework.data.repository.CrudRepository;

public interface SurveyRepository extends CrudRepository<Survey, Integer> {
    Iterable<Survey> findAllByProjectID(int ProjectID);
}
