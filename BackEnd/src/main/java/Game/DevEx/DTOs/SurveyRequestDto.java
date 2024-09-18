package Game.DevEx.DTOs;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class SurveyRequestDto {
    private int userID;
    private String characterEmotion;
    private int numberOfSurveys;

}
