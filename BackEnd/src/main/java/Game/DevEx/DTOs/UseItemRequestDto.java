package Game.DevEx.DTOs;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UseItemRequestDto {
    private int userID;
    private int itemID;
    private int quantity;

}
