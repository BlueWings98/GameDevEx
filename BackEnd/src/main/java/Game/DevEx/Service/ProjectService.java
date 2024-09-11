package Game.DevEx.Service;

import Game.DevEx.Entity.DXFactor;
import Game.DevEx.Entity.Project;
import Game.DevEx.Entity.Survey;
import Game.DevEx.Repository.DXFactorRepository;
import Game.DevEx.Repository.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final DXFactorRepository dxFactorRepository;
    private final SurveyService surveyService;

    @Autowired
    public ProjectService(ProjectRepository projectRepository, DXFactorRepository dxFactorRepository, SurveyService surveyService) {
        this.projectRepository = projectRepository;
        this.dxFactorRepository = dxFactorRepository;
        this.surveyService = surveyService;
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
            temp.put("projectStatus", project.getProjectStatus());
            jsonArray.put(temp);
        }
        return jsonArray.toString();
    }
    public JSONObject getSubjectiveEvaluation(int projectID) {
        // Initialize scores for each category
        Double developmentAndRelease = 100.0;
        Double productManagement = 100.0;
        Double collaborationAndCulture = 100.0;
        Double developerFlowAndFulfillment = 100.0;

        // Counters to keep track of how many surveys contribute to each category
        int devReleaseCount = 0;
        int prodMgmtCount = 0;
        int collabCultureCount = 0;
        int devFlowCount = 0;

        // Fetch surveys for the project
        Iterable<Survey> surveys = surveyService.getSurveysByProjectID(projectID);

        // Loop through surveys and calculate scores based on DXFactorValue
        for (Survey survey : surveys) {
            String dxFactorCategory = dxFactorRepository.findById(survey.getDXFactorID()).get().getFactorCategory();
            int dxFactorValue = survey.getDXFactorValue(); // Values between 1 and 10
            double score = (10 - dxFactorValue) * 10.0;  // Convert to a score from 0 to 100

            switch (dxFactorCategory) {
                case "Development and Release":
                    developmentAndRelease = (developmentAndRelease * devReleaseCount + score) / (devReleaseCount + 1);
                    devReleaseCount++;
                    break;
                case "Product Management":
                    productManagement = (productManagement * prodMgmtCount + score) / (prodMgmtCount + 1);
                    prodMgmtCount++;
                    break;
                case "Collaboration and culture":
                    collaborationAndCulture = (collaborationAndCulture * collabCultureCount + score) / (collabCultureCount + 1);
                    collabCultureCount++;
                    break;
                case "Developer flow and fulfillment":
                    developerFlowAndFulfillment = (developerFlowAndFulfillment * devFlowCount + score) / (devFlowCount + 1);
                    devFlowCount++;
                    break;
            }
        }

        // Calculate final average score
        Double finalScore = (developmentAndRelease + productManagement + collaborationAndCulture + developerFlowAndFulfillment) / 4;

        // Return a formatted string with the final score and individual category scores
        JSONObject result = new JSONObject();
        result.put("developmentAndRelease", developmentAndRelease);
        result.put("productManagement", productManagement);
        result.put("collaborationAndCulture", collaborationAndCulture);
        result.put("developerFlowAndFulfillment", developerFlowAndFulfillment);
        result.put("finalScore", finalScore);
        return result;
    }
    public String updateProjectStatus(int projectID, int projectStatus) {
        projectRepository.findById(projectID).ifPresentOrElse(project -> {
            project.setProjectStatus(projectStatus);  // Update the project status
            projectRepository.save(project);  // Save the updated project
        }, () -> {
            throw new EntityNotFoundException("Project with ID " + projectID + " not found.");
        });
        return "The project status has been updated successfully.";
    }
    public String getProjectStatus(int projectID) {
        int response = projectRepository.findById(projectID)
                .map(Project::getProjectStatus)
                .orElseThrow(() -> new EntityNotFoundException("Project with ID " + projectID + " not found."));
        return "" + response;
    }


}
