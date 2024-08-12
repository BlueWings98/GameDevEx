package Game.DevEx.Controller;

import Game.DevEx.Service.SonarCloudService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SonarCloudController {

    @Autowired
    private SonarCloudService sonarCloudService;

    @GetMapping("/sonarcloud")
    public String getSonarProject(@RequestBody String projectName) {
        JSONObject json = new JSONObject(projectName);
        String projectNameValue = json.getString("projectName");
        JSONObject temp = sonarCloudService.getSonarProjectIssues(projectNameValue);
        return temp.toString();
    }
}
