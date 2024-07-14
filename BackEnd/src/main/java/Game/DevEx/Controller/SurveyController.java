package Game.DevEx.Controller;

import Game.DevEx.Interface.iSurveyService;
import Game.DevEx.Service.SurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/survey")
public class SurveyController {

    private final SurveyService surveyService;

    @Autowired
    public SurveyController(SurveyService surveyService) {
        this.surveyService = surveyService;
    }

    @GetMapping("/factors")
    public void printAllDxFactors() {
        surveyService.printAllDxFactors();
    }

    @PostMapping("/{numberOfQuestions}")
    public String executeSurvey(@PathVariable int numberOfQuestions) {
        return surveyService.executeSurvey(numberOfQuestions);
    }
}

