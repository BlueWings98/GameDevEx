package Game.DevEx.Controller;

import Game.DevEx.Service.SonarCloudService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SonarCloudController {

    @Autowired
    private SonarCloudService sonarCloudService;

    @GetMapping("/sonarcloud")
    public String getSonarProject(@RequestParam String projectName) {
        JSONObject temp = sonarCloudService.getSonarProjectIssues(projectName);
        return temp.toString();
    }
    @GetMapping("/sonarcloud/analysis")
    public String getSonarProjectAnalysis(@RequestParam String projectName) {
        JSONObject temp = sonarCloudService.analyzeSonarProject(projectName);
        return temp.toString();
    }
    @GetMapping("/sonarcloud/metrics")
    public String getSonarProjectMetrics(@RequestParam String projectName) {
        JSONObject temp = sonarCloudService.getSonarProjectMetrics(projectName);
        return temp.toString();
    }
    @GetMapping("/sonarcloud/score")
    public String getSonarProjectScore(@RequestParam String projectName) {
        //Final Tiberon Score
        double tiberonScore = sonarCloudService.getSonarProjectScore(projectName);
        JSONObject temp = new JSONObject();
        temp.put("TiberonScore", tiberonScore);
        return temp.toString();
    }
    @GetMapping("/sonarcloud/metrics/report")
    public String getSonarProjectMetricsReport() {
        JSONObject temp = sonarCloudService.getMetricReport();
        return temp.toString();
    }

}
