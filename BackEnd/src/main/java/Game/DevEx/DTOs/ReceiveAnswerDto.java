package Game.DevEx.DTOs;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.bind.annotation.RequestParam;

@Getter
@Setter
public class ReceiveAnswerDto {
    private String userResponse;
    private String gptResponse;
    private int projectID;
    private int userID;
    private String characterEmotion;
}
