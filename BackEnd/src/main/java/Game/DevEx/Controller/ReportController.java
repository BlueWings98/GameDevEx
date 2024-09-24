package Game.DevEx.Controller;


import Game.DevEx.Service.ReportService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/report")
public class ReportController {

    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }
    @GetMapping("/dx-factor")
    public String mostImportantDxFactorByID(@RequestParam int ProjectId) {
        String response = reportService.mostImportantDXFactorByProject(ProjectId);
        JSONObject object = new JSONObject();
        object.put("response", response);
        return object.toString();
    }
    @GetMapping("/dx-factor/all")
    public String mostImportantDxFactorByAllProjects() {
        String response = reportService.mostImportantDXFactorByAllProjects();
        JSONObject object = new JSONObject();
        object.put("response", response);
        return object.toString();
    }
    @GetMapping
    public String generateRecomendationsByProjectId(@RequestParam int ProjectId) {
        String response = reportService.generateRecomendationsByProjectId(ProjectId);
        JSONObject object = new JSONObject();
        object.put("response", response);
        return object.toString();
    }

}