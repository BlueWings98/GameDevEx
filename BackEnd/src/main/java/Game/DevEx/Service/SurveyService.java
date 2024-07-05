package Game.DevEx.Service;

import Game.DevEx.Interface.iSurveyService;
import Game.DevEx.Repository.DXFactorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SurveyService implements iSurveyService {

    private final DXFactorRepository dxFactorRepository;
    @Autowired
    public SurveyService(DXFactorRepository dxFactorRepository) {
        this.dxFactorRepository = dxFactorRepository;
    }
    @Override
    public String executeSurvey(int numberOfQuestions) {
        return null;
    }

    @Override
    public void printAllDxFactors() {
        dxFactorRepository.findAll().forEach(System.out::println);
    }
}
