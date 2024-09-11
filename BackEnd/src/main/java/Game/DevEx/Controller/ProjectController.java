package Game.DevEx.Controller;

import Game.DevEx.DTOs.ProjectStatusDto;
import Game.DevEx.Service.ProjectService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    @GetMapping("/project")
    public String getProject(@RequestParam("projectID") String projectID) {
        return projectService.getProject(Integer.parseInt(projectID));
    }
    @GetMapping("/project/all")
    public String getAllProjects() {
        return projectService.getAllProjects();
    }
    @GetMapping("/project/subjective-evaluation")
    public String getSubjectiveEvaluation(@RequestParam("projectID") int projectID) {
        return projectService.getSubjectiveEvaluation(projectID).toString();
    }
    @PostMapping("/project/status")
    public String updateProjectStatus(@RequestBody ProjectStatusDto projectStatusDto) {
        int projectID = projectStatusDto.getProjectID();
        int projectStatus = projectStatusDto.getProjectStatus();
        String response = projectService.updateProjectStatus(projectID, projectStatus);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("response", response);
        return jsonObject.toString();
    }
    @GetMapping("/project/status")
    public String getProjectStatus(@RequestParam("projectID") int projectID) {
        String response = projectService.getProjectStatus(projectID);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("response", response);
        return jsonObject.toString();
    }
}
