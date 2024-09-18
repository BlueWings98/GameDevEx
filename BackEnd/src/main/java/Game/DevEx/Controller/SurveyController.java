package Game.DevEx.Controller;

import Game.DevEx.DTOs.ReceiveAnswerDto;
import Game.DevEx.DTOs.SurveyRequestDto;
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
    public String executeSurvey(@RequestBody SurveyRequestDto surveyRequestDto) {
        return surveyService.executeSurvey(surveyRequestDto.getUserID(), surveyRequestDto.getCharacterEmotion(), surveyRequestDto.getNumberOfSurveys());
    }
    @PostMapping("/receiveanswer")
    public String receiveUserAnswer(@RequestBody ReceiveAnswerDto receiveAnswerDto ,@RequestParam int userID, @RequestParam String characterEmotion) {
        String userResponseValue = receiveAnswerDto.getUserResponse();
        String gptResponseValue = receiveAnswerDto.getGptResponse();
        int projectID = receiveAnswerDto.getProjectID();
        return surveyService.receiveUserAnswer(userResponseValue, userID, characterEmotion, gptResponseValue, projectID);
    }
    @PostMapping("/casualconversation")
    public String casualConversation(@RequestBody String userResponse, @RequestParam String characterEmotion) {
        return surveyService.casualConversation(userResponse, characterEmotion);
    }
    @GetMapping("/byprojectid")
    public String getSurveyByProjectID(@RequestParam int projectID) {
        return surveyService.getSurveysByProjectID(projectID).toString();
    }
}

