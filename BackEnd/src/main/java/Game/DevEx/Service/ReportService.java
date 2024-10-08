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
        String setupPromtp = "Eres un auditor de proyectos de software. Tu respuesta debe ser en español. Se te ha pedido que proporciones un informe y recomendaciones. " +
                "Debes elegir dos estrategias de equipo y dos estrategias personales utilizando la información que se te proporcionará. " +
                "Por favor, no repitas la información dada, solo menciona los puntos más importantes y las recomendaciones, y no des una respuesta demasiado extensa." +
                "Utiliza estas estrategias para tu respuesta: " + getAllStrategies();
        String prompt = "";

        prompt += mostImportantDXFactorByProject(ProjectId);
        prompt += mostImportantBarrierByProject(ProjectId);
        prompt += getSubjectiveEvaluation(ProjectId) ;
        prompt += getSonarProjectScore(ProjectId);


        double temperature = 1.0;
        String response = chatGptService.getSuperCompletition(prompt, temperature, setupPromtp);

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
        return "El factor de experiencia del desarrollador más importante para este proyecto es: " + mostCommonDXFactor.getDxFactorName() + ", con un promedio de: " + dxFactorValues.get(0).getAverageDxFactorValue() + ". El valor máximo es 10, que representa el peor valor posible.";

    }
    public String mostImportantDXFactorByAllProjects() {
        List<AverageDxFactorDto> dxFactorValues = surveyRepository.findAverageDxfactorValuesForAllProjects();
        //Get the DXFactor with the highest average value
        DXFactor mostCommonDXFactor = dxFactorRepository.findById(dxFactorValues.get(0).getDxFactorId()).get();
        return "El factor DX más importante para todos los proyectos es: " + mostCommonDXFactor.getDxFactorName() + ", con un promedio de: " + dxFactorValues.get(0).getAverageDxFactorValue();
    }
    public String mostImportantBarrierByProject(int ProjectId) {
        List<AverageBarrierDto> barrierValues = barrierResponseRepository.findAverageBarrierValuesForAllProjects();
        //Get the Barrier with the highest average value
        BarrierToImprovement mostCommonBarrier = barrierToImprovementRepository.findById(barrierValues.get(0).getBarrierToImprovementId()).get();
        return "La barrera más importante para el proyecto" + ProjectId + " es " + mostCommonBarrier.getName() + ", con un promedio de: " + barrierValues.get(0).getAverageBarrierValue();
    }
    public String mostImportantBarrierByAllProjects() {
        List<AverageBarrierDto> barrierValues = barrierResponseRepository.findAverageBarrierValuesForAllProjects();
        //Get the Barrier with the highest average value
        BarrierToImprovement mostCommonBarrier = barrierToImprovementRepository.findById(barrierValues.get(0).getBarrierToImprovementId()).get();
        return "La barrera más importante para todos los proyectos es: " + mostCommonBarrier.getName() + ", con un promedio de: " + barrierValues.get(0).getAverageBarrierValue();
    }


    private String getAllStrategies(){
        Iterable<Strategy> strategies = strategyRepository.findAll();
        StringBuilder strategiesString = new StringBuilder();
        for (Strategy strategy : strategies) {
            strategiesString.append(strategy.getName()).append(", ");
            if(strategy.getIsTeamStrategy()){
                strategiesString.append(" (Equipo), ");
            } else {
                strategiesString.append(" (Personal), ");
            }
        }
        return "Las estrategias disponibles son las siguientes, elige la mejor: "+ strategiesString;
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
        return "Las estrategias disponibles son las siguientes: " + jsonArray;
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

        return ". Luego de muchas encuestas en el proyecto, concluimos que la salud del repositorio tiene las siguientes categorías y puntajes: " + evaluationString + " Siendo un 100 un perfecto ambiente laboral y de desarrollo.";
    }

    private String getSonarProjectScore(int projectID) {
        JSONObject project = new JSONObject(projectService.getProject(projectID));
        String projectKey = project.getString("projectKey");
        // Need the Project Key not the project name
        double projectScore = sonarCloudService.getSonarProjectScore(projectKey);

        return String.format("Después de un análisis de SonarCloud, concluimos que el estado del repositorio es del %.2f%% siendo un 100 cuando cumple con todas las metas de calidad propuestas.", projectScore);
    }

}
