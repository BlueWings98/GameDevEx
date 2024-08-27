package Game.DevEx.Controller;

import Game.DevEx.DTOs.PullsDto;
import Game.DevEx.Entity.GameItem;
import Game.DevEx.Service.PullService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/pull")
public class PullController {
    private final PullService pullService;

    @Autowired
    public PullController(PullService pullService) {
        this.pullService = pullService;
    }
    @PostMapping
    public ResponseEntity<List<GameItem>> pull(@RequestBody PullsDto pullsDto) {
        return ResponseEntity.ok(pullService.pull(pullsDto));
    }
}
