package Game.DevEx.Service;

import Game.DevEx.Interface.iChatGptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ChatGptService implements iChatGptService {

    private final RestTemplate restTemplate;

    @Value("${openai.api.url}")
    private String apiUrl;

    @Value("${openai.api.key}")
    private String apiKey;
    @Value("${openai.api.model}")
    private String model;
    public ChatGptService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getVanillaCompletition(String prompt, double temperature, String setUpPrompt){
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("Content-Type", "application/json");

        String requestBody = String.format(
                "{" +
                        "\"model\": \"%s\"," +
                        "\"messages\": [" +
                        "{\"role\": \"system\", \"content\": \"%s\"}," +
                        "{\"role\": \"user\", \"content\": \"%s\"}" +
                        "]," +
                        "\"temperature\": %f" +
                        "}",
                model, setUpPrompt, prompt, temperature
        );
        System.out.println(requestBody);

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, entity, String.class);

        return response.getBody();
    }
}
