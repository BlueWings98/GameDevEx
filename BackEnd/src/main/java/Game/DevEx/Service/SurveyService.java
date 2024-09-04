package Game.DevEx.Service;

import Game.DevEx.Entity.DXFactor;
import Game.DevEx.Entity.Survey;
import Game.DevEx.Interface.iSurveyService;
import Game.DevEx.Repository.DXFactorRepository;
import Game.DevEx.Repository.SurveyRepository;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
public class SurveyService implements iSurveyService {
    private final int MIN = 1;

    private final DXFactorRepository dxFactorRepository;
    private final SurveyRepository surveyRepository;
    private final ChatGptService chatGptService;
    private final InventoryService inventoryService;

    private static final String initPrompt = "Te llamas Totolo, eres un pequeño tanuki y necesito que ayudes a tu humano a tener mejor experiencia de desarrollador. Tus respuestas deben ser cortas pero tiernas. Si vas a hacer una recomendación esta ser amigable y creativa.";
    private static final String questionPromptBase = "Recuerda saludar siempre. Te voy a dar un factor que influye en la experiencia de desarrollador y quiero que generes una pregunta con la intencion de medir la gravedad de la situación. Solo haz la pregunta, no repitas las instrucciones dadas. Se creativo. Las preguntas deben siempre ser abiertas."+
            "El tema de la pregunta de Developer Experience es: ";
    private static final String setUpEmotionReader = "Solo respondiendo en números del 1 al 10, que tan emocional encuentras la siguiente respuesta siendo 10 el maximo y 1 el minimo? Si la respuesta no esta relacionada o no es satisfactoria responde 0: ";
    private static final String casualConversationPromptBase = "Necesito que me des una respuesta honesta dentro del personaje intentando hacer recomendaciones muy cortas y amigables de una o dos frases. para mejorar la experiencia de desarrollador de tu humano. ";
    private DXFactor selectedDxFactor;

    @Autowired
    public SurveyService(DXFactorRepository dxFactorRepository, SurveyRepository surveyRepository, ChatGptService chatGptService, InventoryService inventoryService) {
        this.dxFactorRepository = dxFactorRepository;
        this.surveyRepository = surveyRepository;
        this.chatGptService = chatGptService;
        this.inventoryService = inventoryService;
    }
    @Override
    public String executeSurvey() {
        Optional<DXFactor> gptResponse = getRandomDxFactor();
        DXFactor randomDxFactor;
        double temperature = 1.2;
        if(gptResponse.isPresent()){
            randomDxFactor = getRandomDxFactor().get();
            this.selectedDxFactor = randomDxFactor;
        } else {
            throw new NullPointerException();
        }
        return chatGptService.getVanillaCompletition(questionPromptBase.concat(randomDxFactor.getDxFactorName()),temperature, initPrompt );
    }
    public String receiveUserAnswer(String userResponse, int userID, String characterEmotion, String gptResponse) {
        int measuredEmotion = measureEmotion(userResponse);
        if(measuredEmotion == 0){
            return "No puedo continuar si no me das una respuesta valida.";
        }
        if(selectedDxFactor == null){
            throw new NullPointerException("No puedo recibir una respuesta si no se ha generado una pregunta primero.");
        };
        Survey survey = new Survey(
                selectedDxFactor.getDxFactorName(),
                selectedDxFactor.getDxFactorID(),
                userID,
                userResponse,
                measuredEmotion,
                gptResponse
        );
        this.surveyRepository.save(survey);
        // Como la respuesta fue satisfactoria, se le otorga una modena al usuario.
        this.inventoryService.addItem(userID, 8, 1);
        return casualConversation(userResponse, characterEmotion);
    }
    public String casualConversation(String userResponse, String characterEmotion) {
        // Necesito generar la respuesta honesta de chatgpt dentro del personaje de la mascota pero manteniendo el contexto con el usuario.
        String casualConversationPrompt = casualConversationPromptBase.concat("Maneja una emoción: "+ characterEmotion + ". La ultima respuesta del usuario fue: " +userResponse);
        double temperature = 0.8;
        return chatGptService.getVanillaCompletition(casualConversationPrompt,temperature, initPrompt);
    }
    public int measureEmotion(String userResponse){
        //The temperature can go between 0 and 2. 0 Is the most predictable, I need to quantify emotion as cold and predictable as possible.
        double temperature = 0.5;
        String promt = setUpEmotionReader.concat(userResponse);
        String gptResponse = chatGptService.getVanillaCompletition(promt,temperature,"");
        JSONObject jsonResponse = new JSONObject(gptResponse);
        // Navigate through the JSON structure to get the content
        JSONArray choicesArray = jsonResponse.getJSONArray("choices");
        JSONObject firstChoice = choicesArray.getJSONObject(0);
        JSONObject messageObject = firstChoice.getJSONObject("message");
        String content = messageObject.getString("content");
        System.out.println("Content: " + content);
        return Integer.parseInt(content.replaceAll("[^0-9]", ""));
    }


    @Override
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
        int randomNumber = random.nextInt(numberOfFactors - MIN + 1) + MIN;
        return dxFactorRepository.findById(randomNumber);

    }
}
