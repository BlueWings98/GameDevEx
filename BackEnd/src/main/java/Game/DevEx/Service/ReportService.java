package Game.DevEx.Service;

import Game.DevEx.DTOs.AverageBarrierDto;
import Game.DevEx.DTOs.AverageDxFactorDto;
import Game.DevEx.Entity.BarrierToImprovement;
import Game.DevEx.Entity.DXFactor;
import Game.DevEx.Entity.Strategy;
import Game.DevEx.Repository.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.List;

@Service
public class ReportService {

    private final SurveyRepository surveyRepository;
    private final DXFactorRepository dxFactorRepository;
    private final BarrierResponseRepository barrierResponseRepository;
    private final StrategyRepository strategyRepository;
    private final BarrierToImprovementRepository barrierToImprovementRepository;

    private final ChatGptService chatGptService;
    private final SonarCloudService sonarCloudService;
    private final ProjectService projectService;

    public ReportService(SurveyRepository surveyRepository, DXFactorRepository dxFactorRepository,
                         BarrierResponseRepository barrierResponseRepository, StrategyRepository strategyRepository,
                         ChatGptService chatGptService, SonarCloudService sonarCloudService, ProjectService projectService,
                         BarrierToImprovementRepository barrierToImprovementRepository) {
        this.surveyRepository = surveyRepository;
        this.dxFactorRepository = dxFactorRepository;
        this.barrierResponseRepository = barrierResponseRepository;
        this.strategyRepository = strategyRepository;
        this.chatGptService = chatGptService;
        this.sonarCloudService = sonarCloudService;
        this.projectService = projectService;
        this.barrierToImprovementRepository = barrierToImprovementRepository;
    }
    public String generateRecomendationsByProjectId(int ProjectId) {
        String setupPromtp = "You are a software project auditor. You have been asked to provide a report and recommendations. " +
                "You need to choose two team and two personal strategies using the information you will be provided. " +
                "Please do not repeat the information given, only the most important points and recommendations and do not give a overly long answer." +
                "Use these strategies for your answer: " + getAllStrategies();
        String prompt = "";

        prompt += mostImportantDXFactorByProject(ProjectId);
        prompt += mostImportantBarrierByProject(ProjectId);
        prompt += getSubjectiveEvaluation(ProjectId) ;
        prompt += getSonarProjectScore(ProjectId);


        double temperature = 1.0;
        String response = chatGptService.getVanillaCompletition(prompt, temperature, setupPromtp);

        JSONObject jsonResponse = new JSONObject(response);
        // Navigate through the JSON structure to get the content
        JSONArray choicesArray = jsonResponse.getJSONArray("choices");
        JSONObject firstChoice = choicesArray.getJSONObject(0);
        JSONObject messageObject = firstChoice.getJSONObject("message");
        return messageObject.getString("content");
    }

    public String mostImportantDXFactorByProject(int ProjectId) {
        List<AverageDxFactorDto> dxFactorValues = surveyRepository.findAverageDxfactorValuesByProjectID(ProjectId);
        //Get the DXFactor with the highest average value
        DXFactor mostCommonDXFactor = dxFactorRepository.findById(dxFactorValues.get(0).getDxFactorId()).get();
        return "The most important Developer Experience Factor for this project is " + mostCommonDXFactor.getDxFactorName() + " with an average value of " + dxFactorValues.get(0).getAverageDxFactorValue() + " The maximun value is 10 that represents the worst possible value.";

    }
    public String mostImportantDXFactorByAllProjects() {
        List<AverageDxFactorDto> dxFactorValues = surveyRepository.findAverageDxfactorValuesForAllProjects();
        //Get the DXFactor with the highest average value
        DXFactor mostCommonDXFactor = dxFactorRepository.findById(dxFactorValues.get(0).getDxFactorId()).get();
        return "The most important DX Factor for all projects is " + mostCommonDXFactor.getDxFactorName() + " with an average value of " + dxFactorValues.get(0).getAverageDxFactorValue();
    }
    public String mostImportantBarrierByProject(int ProjectId) {
        List<AverageBarrierDto> barrierValues = barrierResponseRepository.findAverageBarrierValuesForAllProjects();
        //Get the Barrier with the highest average value
        BarrierToImprovement mostCommonBarrier = barrierToImprovementRepository.findById(barrierValues.get(0).getBarrierToImprovementId()).get();
        return "The most important Barrier for project " + ProjectId + " is " + mostCommonBarrier.getName() + " with an average value of " + barrierValues.get(0).getAverageBarrierValue();
    }
    public String mostImportantBarrierByAllProjects() {
        List<AverageBarrierDto> barrierValues = barrierResponseRepository.findAverageBarrierValuesForAllProjects();
        //Get the Barrier with the highest average value
        BarrierToImprovement mostCommonBarrier = barrierToImprovementRepository.findById(barrierValues.get(0).getBarrierToImprovementId()).get();
        return "The most important Barrier for all projects is " + mostCommonBarrier.getName() + " with an average value of " + barrierValues.get(0).getAverageBarrierValue();
    }


    private String getAllStrategies(){
        Iterable<Strategy> strategies = strategyRepository.findAll();
        StringBuilder strategiesString = new StringBuilder();
        for (Strategy strategy : strategies) {
            strategiesString.append(strategy.getName()).append(", ");
            if(strategy.getIsTeamStrategy()){
                strategiesString.append(" (Team Strategy), ");
            } else {
                strategiesString.append(" (Personal Strategy), ");
            }
        }
        return "The strategies available are the following, choose the best one: " + strategiesString;
    }
    private String getAllStrategiesJson(){
        Iterable<Strategy> strategies = strategyRepository.findAll();
        JSONArray jsonArray = new JSONArray();
        for (Strategy strategy : strategies) {
            JSONObject temp = new JSONObject();
            temp.put("strategyID", strategy.getStrategyID());
            temp.put("strategyName", strategy.getName());
            temp.put("isTeamStrategy", strategy.getIsTeamStrategy());
            jsonArray.put(temp);
        }
        return "The strategies available are the following: " + jsonArray;
    }

    private String getSubjectiveEvaluation(int projectID) {
        DecimalFormat df = new DecimalFormat("#.##");
        StringBuilder evaluationString = new StringBuilder();
        JSONObject evaluationObject = projectService.getSubjectiveEvaluation(projectID);

        for (String key : evaluationObject.keySet()) {
            Object value = evaluationObject.get(key);
            // Check if the value is a number and format it
            if (value instanceof Number) {
                double doubleValue = ((Number) value).doubleValue();
                evaluationString.append(key).append(": ").append(df.format(doubleValue)).append(", ");
            } else {
                evaluationString.append(key).append(": ").append(value).append(", ");
            }
        }

        return "After many surveys in the project, we concluded that the repository health has the following categories and scores: " + evaluationString;
    }

    private String getSonarProjectScore(int projectID) {
        JSONObject project = new JSONObject(projectService.getProject(projectID));
        String projectKey = project.getString("projectKey");
        // Need the Project Key not the project name
        double projectScore = sonarCloudService.getSonarProjectScore(projectKey);

        return String.format("After a SonarCloud analysis, we concluded that the repository health is %.2f%%", projectScore);
    }

}
