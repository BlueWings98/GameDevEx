package Game.DevEx.Service;

import Game.DevEx.Entity.Project;
import Game.DevEx.Repository.ProjectRepository;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public String getProject(int projectID){
        JSONObject jsonObject = new JSONObject();
        Project project = this.projectRepository.findById(projectID).orElse(null);
        assert project != null;
        jsonObject.put("projectID", project.getProjectId());
        jsonObject.put("projectKey", project.getProjectKey());
        jsonObject.put("projectName", project.getProjectName());
        jsonObject.put("projectDescription", project.getProjectDescription());
        return jsonObject.toString();
    }
    public String getAllProjects(){
        Iterable<Project> projects = this.projectRepository.findAll();
        JSONArray jsonArray = new JSONArray();
        for (Project project : projects) {
            JSONObject temp = new JSONObject();
            temp.put("projectID", project.getProjectId());
            temp.put("projectKey", project.getProjectKey());
            temp.put("projectName", project.getProjectName());
            temp.put("projectDescription", project.getProjectDescription());
            jsonArray.put(temp);
        }
        return jsonArray.toString();
    }
}
