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
        return surveyService.executeSurvey(surveyRequestDto.getTotoloID(), surveyRequestDto.getCharacterEmotion(), surveyRequestDto.getNumberOfSurveys());
    }
    @PostMapping("/receiveanswer")
    public String receiveUserAnswer(@RequestBody ReceiveAnswerDto receiveAnswerDto ) {
        String userResponseValue = receiveAnswerDto.getUserResponse();
        String gptResponseValue = receiveAnswerDto.getGptResponse();
        int projectID = receiveAnswerDto.getProjectID();
        int userID = receiveAnswerDto.getUserID();
        String characterEmotion = receiveAnswerDto.getCharacterEmotion();
        int dxFactorID = receiveAnswerDto.getDxFactorID();
        return surveyService.receiveUserAnswer(userResponseValue, userID, characterEmotion, gptResponseValue, projectID, dxFactorID);
    }
    @PostMapping("/casualconversation")
    public String casualConversation(@RequestBody String userResponse, @RequestParam String characterEmotion) {
        return surveyService.casualConversation(userResponse, characterEmotion);
    }
    @GetMapping("/byprojectid")
    public String getSurveyByProjectID(@RequestParam int projectID) {
        return surveyService.getSurveysByProjectID(projectID).toString();
    }
    @GetMapping("/barrier/byname")
    public String getBarrierIDByName(@RequestParam String barrierName) {
        JSONObject response = new JSONObject();
        response.put("barrierID", surveyService.getBarrierIDByName(barrierName));
        return response.toString();
    }
    @GetMapping("/count/byprojectid")
    public String getSurveyCountByProjectID(@RequestParam int projectID) {
        JSONObject response = new JSONObject();
        response.put("count", surveyService.getSurveyCountByProjectID(projectID));
        return response.toString();
    }
    @GetMapping("/count")
    public String getSurveyCount() {
        JSONObject response = new JSONObject();
        response.put("count", surveyService.getSurveyCount());
        return response.toString();
    }

}

