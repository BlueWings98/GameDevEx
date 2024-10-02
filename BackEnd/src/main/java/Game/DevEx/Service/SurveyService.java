package Game.DevEx.Service;

import Game.DevEx.Entity.BarrierResponse;
import Game.DevEx.Entity.BarrierToImprovement;
import Game.DevEx.Entity.DXFactor;
import Game.DevEx.Entity.Survey;
import Game.DevEx.Repository.BarrierResponseRepository;
import Game.DevEx.Repository.BarrierToImprovementRepository;
import Game.DevEx.Repository.DXFactorRepository;
import Game.DevEx.Repository.SurveyRepository;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
public class SurveyService {

    private final DXFactorRepository dxFactorRepository;
    private final SurveyRepository surveyRepository;
    private final BarrierToImprovementRepository barrierToImprovementRepository;
    private final BarrierResponseRepository barrierResponseRepository;
    private final ChatGptService chatGptService;
    private final InventoryService inventoryService;
    private final TotoloService totoloService;

    private static final String initPrompt = "Te llamas Totolo, eres un pequeño tanuki y necesito que ayudes a tu humano a tener mejor experiencia de desarrollador. Tus respuestas deben ser cortas pero tiernas. Si vas a hacer una recomendación esta ser amigable y creativa. ";
    private static final String questionPromptBase = ". Recuerda saludar siempre. Te voy a dar un factor que influye en la experiencia de desarrollador y quiero que generes una pregunta con la intencion de medir la gravedad de la situación. Solo haz la pregunta, no repitas las instrucciones dadas. Se creativo. Las preguntas deben siempre ser abiertas."+
            "El tema de la pregunta de Developer Experience es: ";
    private static final String characterMoodInjection = "Maneja una emoción: ";
    private static final String setUpEmotionReader = "Solo respondiendo en números del 1 al 10, que tan impactante en el contexto de la Experiencia del Desarrollador, encuentras la siguiente respuesta siendo 10 el maximo y 1 el minimo? Esto significa que si es altamente negativa se le otorga un 10, si es altamente positiva un 1 y otras respuestas algun numero intermedio. Si la respuesta no esta relacionada o no es satisfactoria responde 0: ";
    private static final String casualConversationPromptBase = "Necesito que me des una respuesta honesta dentro del personaje intentando hacer recomendaciones muy cortas y amigables de una o dos frases. para mejorar la experiencia de desarrollador de tu humano. ";
    private static final String initBarrierToImprovementPrompt = "Necesito que a partir de la respuesta del usuario y de Totolo, escogas la barrera para la mejora mas relevante a partir de la siguiente lista. Solo escoge una y tu respuesta debe ser el nombre y un numero del 1 al 10 siendo 10 el mas relevante y 1 el menos relevante. Necesito que solo me des como respuesta lo que te pido, el resto no es valido. No cambies ningun nombre de las barreras, las necesito tal cual: ";
    private static final String barrierToImprovementPrompt = "Necesito que a partir de la respuesta del usuario y de Totolo, escogas la barrera para la mejora mas relevante a partir de la siguiente lista. Solo escoge una y tu respuesta debe ser el nombre y un numero del 1 al 10 siendo 10 el mas relevante y 1 el menos relevante: ";


    @Autowired
    public SurveyService(DXFactorRepository dxFactorRepository, SurveyRepository surveyRepository, ChatGptService chatGptService,
                         InventoryService inventoryService, TotoloService totoloService, BarrierToImprovementRepository barrierToImprovementRepository,
                         BarrierResponseRepository barrierResponseRepository) {
        this.dxFactorRepository = dxFactorRepository;
        this.surveyRepository = surveyRepository;
        this.chatGptService = chatGptService;
        this.inventoryService = inventoryService;
        this.totoloService = totoloService;
        this.barrierToImprovementRepository = barrierToImprovementRepository;
        this.barrierResponseRepository = barrierResponseRepository;
    }
    public String executeSurvey(int totoloID, String characterEmotion, int numberOfSurveys) {
        DXFactor randomDxFactor;
        double temperature = 1.2;
        DXFactor selectedDxFactor;
        if(totoloService.dischargeBatteryBySurvey(totoloID, numberOfSurveys)){
            Optional<DXFactor> gptResponse = getRandomDxFactor();
            if(gptResponse.isPresent()){
                randomDxFactor = getRandomDxFactor().get();
                selectedDxFactor = randomDxFactor;
            } else {
                throw new NullPointerException();
            }
        } else {
            return "No tienes suficiente batería para realizar una encuesta. Esta se recargará sola mañana.";
        }
        String prompt = questionPromptBase.concat(randomDxFactor.getDxFactorName());
        String response = chatGptService.getVanillaCompletition(prompt,temperature, initPrompt.concat(characterMoodInjection + characterEmotion) );
        JSONObject jsonResponse = getJsonObject(response);
        jsonResponse.put("dxFactorID", selectedDxFactor.getDxFactorID());
        return jsonResponse.toString();
    }

    private static JSONObject getJsonObject(String response) {
        JSONObject jsonResponse = new JSONObject(response);
        // gptResponse = jsonResponse.choices[0].message.content;
        // Navigate through the JSON structure to get the content
        JSONArray choicesArray = jsonResponse.getJSONArray("choices");
        JSONObject firstChoice = choicesArray.getJSONObject(0);
        JSONObject messageObject = firstChoice.getJSONObject("message");
        String gptResponse = messageObject.getString("content");
        // Return gptResponse and dxFactorID
        jsonResponse = new JSONObject();
        jsonResponse.put("gptResponse", gptResponse);
        return jsonResponse;
    }

    public String receiveUserAnswer(String userResponse, int userID, String characterEmotion, String gptResponse, int projectID, int dxFactorID) {
        int measuredEmotion = measureEmotion(userResponse);
        JSONObject response = new JSONObject();
        response.put("isAnswerValid", true);
        if(measuredEmotion == 0){
            response.put("gptResponse", "No puedo continuar si no me das una respuesta valida.");
            response.put("isAnswerValid", false);
            return response.toString();
        }
        DXFactor selectedDxFactor = dxFactorRepository.findById(dxFactorID).orElse(null);
        if(selectedDxFactor == null){
            throw new NullPointerException("No puedo recibir una respuesta si no se ha generado una pregunta primero.");
        };
        Survey survey = new Survey(
                selectedDxFactor.getDxFactorName(),
                selectedDxFactor.getDxFactorID(),
                userID,
                userResponse,
                measuredEmotion,
                gptResponse,
                projectID
        );
        this.surveyRepository.save(survey);
        // Como la respuesta fue satisfactoria, se le otorga una modena al usuario.
        this.inventoryService.addItem(userID, 8, 1);
        // Se calcula la barrera para la mejora mas relevante.
        if(calculateBarriersToImprovement(userResponse, gptResponse)){
            response.put("gptResponse", casualConversation(userResponse, characterEmotion));
        }
        return response.toString();
    }
    public Boolean calculateBarriersToImprovement(String userReponse, String gptResponse){
        // A partir de las dos respuestas del usuario y de Totolo, se calcula cual seria la barrera para la mejora mas relevante.
        Iterable<BarrierToImprovement> barrierToImprovement = barrierToImprovementRepository.findAll();
        //Necesito concatenar las respuestas del usuario y de Totolo para poder hacer la comparación.
        String concatenatedResponses = barrierToImprovementPrompt.concat("Esta fue tu pregunta: " + gptResponse);
        concatenatedResponses = concatenatedResponses.concat(" Esta fue la respuesta del usuario: " + userReponse);
        String allBarriers = " ";
        for(BarrierToImprovement barrier : barrierToImprovement){
            allBarriers = allBarriers.concat(barrier.getName() + ", ");
        }
        concatenatedResponses = concatenatedResponses.concat(" Las barreras para la mejora son: " + allBarriers);
        double temperature = 1;
        String gptResponseBarrier = chatGptService.getVanillaCompletition(concatenatedResponses,temperature, initBarrierToImprovementPrompt);
        JSONObject jsonResponse = getJsonObject(gptResponseBarrier);
        String content = jsonResponse.getString("gptResponse");
        System.out.println("Content: " + content);
        return determineBarrierValue(content);
    }
    private Boolean determineBarrierValue(String gptResponse) {
        // Split the response into parts based on the last comma and number
        String barrera = gptResponse.replaceAll(", \\d+$", ""); // Remove final comma and number
        int numero = 0;

        // Extraer el número
        String[] parts = gptResponse.split(",\\s+"); // Split by comma and spaces before the number
        try {
            numero = Integer.parseInt(parts[parts.length - 1].replaceAll("[^0-9]", ""));
        } catch (NumberFormatException e) {
            System.out.println("No se pudo extraer el número de la respuesta.");
        }

        // Guardar en variables
        int numeroBarrera = numero;
        System.out.println("Barrera más relevante: " + barrera);
        int barrierID = barrierToImprovementRepository.findIdByName(barrera);
        System.out.println("ID de la barrera: " + barrierID);
        BarrierResponse barrierResponse = new BarrierResponse(
                barrierID,
                numeroBarrera,
                java.time.LocalDate.now()
        );
        barrierResponseRepository.save(barrierResponse);

        System.out.println("Barrera más relevante: " + barrera);
        System.out.println("Número de barrera: " + numeroBarrera);
        return true;
    }

    public int getBarrierIDByName(String barrierName){
        return barrierToImprovementRepository.findIdByName(barrierName);
    }
    public String casualConversation(String userResponse, String characterEmotion) {
        // Necesito generar la respuesta honesta de chatgpt dentro del personaje de la mascota pero manteniendo el contexto con el usuario.
        String casualConversationPrompt = casualConversationPromptBase.concat("Maneja una emoción: "+ characterEmotion + ". La ultima respuesta del usuario fue: " +userResponse);
        double temperature = 0.8;
        JSONObject jsonResponse = getJsonObject(chatGptService.getVanillaCompletition(casualConversationPrompt,temperature, initPrompt));
        return jsonResponse.getString("gptResponse");

    }
    public int measureEmotion(String userResponse){
        //The temperature can go between 0 and 2. 0 Is the most predictable, I need to quantify emotion as cold and predictable as possible.
        double temperature = 0.8;
        String promt = setUpEmotionReader.concat(userResponse);
        String gptResponse = chatGptService.getVanillaCompletition(promt,temperature,"");
        JSONObject jsonResponse = getJsonObject(gptResponse);
        String content = jsonResponse.getString("gptResponse");
        System.out.println("Content: " + content);
        return Integer.parseInt(content.replaceAll("[^0-9]", ""));
    }
    //Get all surveys by projectID
    public Iterable<Survey> getSurveysByProjectID(int projectID){
        return this.surveyRepository.findAllByProjectID(projectID);
    }

    public void printAllDxFactors() {
        dxFactorRepository.findAll().forEach(System.out::println);
    }
    private Optional<DXFactor> getRandomDxFactor(){
        int numberOfFactors = (int) dxFactorRepository.count();
        if (numberOfFactors == 0) {
            throw new IllegalStateException("No factors available");
        }
        //Generate a number between 1 and numberOfFactors and then return a random entry in dxFactoRepository
        Random random = new Random();
        int MIN = 1;
        int randomNumber = random.nextInt(numberOfFactors - MIN + 1) + MIN;
        return dxFactorRepository.findById(randomNumber);

    }

    public long getSurveyCountByProjectID(int projectID) {
        return surveyRepository.countByProjectID(projectID);
    }

    public long getSurveyCount() {
        return surveyRepository.count();
    }
}
