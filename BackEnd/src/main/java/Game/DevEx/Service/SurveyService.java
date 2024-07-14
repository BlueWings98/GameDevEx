package Game.DevEx.Service;

import Game.DevEx.Entity.DXFactor;
import Game.DevEx.Interface.iSurveyService;
import Game.DevEx.Repository.DXFactorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
public class SurveyService implements iSurveyService {
    private final int MIN = 1;

    private final DXFactorRepository dxFactorRepository;
    private final ChatGptService chatGptService;

    private static final String initPrompt = "Necesito que te comportes como una mascota que quiere ayudar a su humano a tener mejor experiencia de desarrollador. " +
            "Te voy a dar un factor que influye en la experiencia de desarrollador y quiero que generes una pregunta con la intencion de medir la gravedad de la situación. ";
    private static final String questionPromptBase = "Dentro de personaje necesito que hagas una pregunta de Developer Experience basada en: ";
    private static final String setUpEmotionReader = "Solo respondiendo en números del 1 al 10, que tan emocional encuentras la siguiente respuesta siendo 10 el maximo y 1 el minimo?: ";

    @Autowired
    public SurveyService(DXFactorRepository dxFactorRepository, ChatGptService chatGptService) {
        this.dxFactorRepository = dxFactorRepository;
        this.chatGptService = chatGptService;
    }
    @Override
    public String executeSurvey(int numberOfQuestions) {
        Optional<DXFactor> gptResponse = getRandomDxFactor();
        DXFactor randomDxFactor;
        double temperature = 1.5;
        if(gptResponse.isPresent()){
            randomDxFactor = getRandomDxFactor().get();
        } else {
            throw new NullPointerException();
        }
        return chatGptService.getVanillaCompletition(questionPromptBase.concat(randomDxFactor.getDxFactorName()),temperature, initPrompt );
    }
    public int measureEmotion(String userResponse){
        //The temperature can go between 0 and 2. 0 Is the most predictable, I need to quantify emotion as cold and predictable as possible.
        double temperature = 0.0;
        String promt = setUpEmotionReader.concat(userResponse);
        String gptResponse = chatGptService.getVanillaCompletition(promt,temperature,initPrompt);
        return Integer.parseInt(gptResponse.replaceAll("[^0-9]", ""));
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
