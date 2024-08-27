package Game.DevEx.Controller;

import Game.DevEx.Service.GameItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/gameitem")
public class GameItemController {
    private final GameItemService gameItemService;

    @Autowired
    public GameItemController(GameItemService gameItemService) {
        this.gameItemService = gameItemService;
    }

    @GetMapping
    public String getAllGameItems() {
        return gameItemService.getAllGameItems();
    }

}
