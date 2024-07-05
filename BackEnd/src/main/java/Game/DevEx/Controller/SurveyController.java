package Game.DevEx.Controller;

import Game.DevEx.Interface.iSurveyService;
import Game.DevEx.Service.SurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SurveyController {

    private SurveyService surveyService;

    @Autowired
    public SurveyController(SurveyService surveyService) {
        this.surveyService = surveyService;
    }

    @GetMapping("/survey")
    public void printAllDxFactors() {
        surveyService.printAllDxFactors();
    }
}
