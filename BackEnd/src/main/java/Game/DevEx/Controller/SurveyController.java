package Game.DevEx.Controller;

import Game.DevEx.Interface.iSurveyService;
import Game.DevEx.Service.SurveyService;
import org.json.JSONObject;
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

    @PostMapping("/generatequestion")
    public String executeSurvey() {
        return surveyService.executeSurvey();
    }
    @PostMapping("/receiveanswer")
    public String receiveUserAnswer(@RequestBody String userResponse, @RequestParam int userID, @RequestParam String characterEmotion) {
        JSONObject response = new JSONObject(userResponse);
        String userResponseValue = response.getString("userResponse");
        return surveyService.receiveUserAnswer(userResponseValue, userID, characterEmotion);
    }
    @PostMapping("/casualconversation")
    public String casualConversation(@RequestBody String userResponse, @RequestParam String characterEmotion) {
        return surveyService.casualConversation(userResponse, characterEmotion);
    }
}

