package Game.DevEx.Controller;

import Game.DevEx.DTOs.PullsDto;
import Game.DevEx.Entity.GameItem;
import Game.DevEx.Service.PullService;
import Game.DevEx.Service.ReportService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/report")
public class ReportController {

    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }
    @GetMapping
    public String mostImportantDxFactorByID(@RequestParam int ProjectId) {
        String response = reportService.mostImportantDXFactorByProject(ProjectId);
        JSONObject object = new JSONObject();
        object.put("response", response);
        return object.toString();
    }
    @GetMapping("/all")
    public String mostImportantDxFactorByAllProjects() {
        String response = reportService.mostImportantDXFactorByAllProjects();
        JSONObject object = new JSONObject();
        object.put("response", response);
        return object.toString();
    }

}