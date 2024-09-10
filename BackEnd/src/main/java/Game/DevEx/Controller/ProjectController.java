package Game.DevEx.Controller;

import Game.DevEx.Service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
}
