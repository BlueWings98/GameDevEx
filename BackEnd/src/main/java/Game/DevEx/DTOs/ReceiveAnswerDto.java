package Game.DevEx.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReceiveAnswerDto {
    private String userResponse;
    private String gptResponse;
    private int projectID;
}
