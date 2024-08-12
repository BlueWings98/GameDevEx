package Game.DevEx.Service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;


@Service
public class SonarCloudService {

    @Value("${sonarcloud.api.url}")
    private String apiUrl;

    @Value("${sonarcloud.api.key}")
    private String apiKey;

    public JSONObject getSonarProjectIssues(String projectName) {
        String issueStatuses = "OPEN,CONFIRMED,ACCEPTED";
        boolean resolved = false;

        // Construct the URL with query parameters
        String url = String.format("%s/issues/search?projects=%s&issueStatuses=%s&resolved=%b",
                apiUrl, projectName, issueStatuses, resolved);

        // Set up the headers with Basic Auth
        HttpHeaders headers = new HttpHeaders();
        String auth = apiKey + ":"; // Token followed by an empty password
        byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes(StandardCharsets.US_ASCII));
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);

        // No request body needed for GET requests with query parameters
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // Send the GET request
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            return new JSONObject(response.getBody());
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            // Handle HTTP-specific errors
            System.err.println("HTTP Status Code: " + e.getStatusCode());
            System.err.println("HTTP Response Body: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            // Handle general errors
            System.err.println("An error occurred: " + e.getMessage());
        }

        return null; // Return null or handle as necessary
    }
}
