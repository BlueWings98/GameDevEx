package Game.DevEx.Service;

import Game.DevEx.Entity.Metric;
import Game.DevEx.Repository.MetricRepository;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
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
import java.util.Map;


@Service
public class SonarCloudService {

    @Value("${sonarcloud.api.url}")
    private String apiUrl;

    @Value("${sonarcloud.api.key}")
    private String apiKey;
    @Value("${sonarcloud.api.pageSize}")
    private String pageSize;

    private MetricRepository metricRepository;

    @Autowired
    public SonarCloudService(MetricRepository metricRepository) {
        this.metricRepository = metricRepository;
    }

    public JSONObject getSonarProjectIssues(String projectName) {
        String issueStatuses = "OPEN,CONFIRMED,ACCEPTED";
        boolean resolved = false;

        // Construct the URL with query parameters
        String url = String.format("%s/issues/search?projects=%s&issueStatuses=%s&resolved=%b&ps=%s",
                apiUrl, projectName, issueStatuses, resolved, pageSize);

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
    public JSONObject getSonarProjectMetrics(String projectName){
        Iterable<Metric> iterable = this.metricRepository.findAll();
        StringBuilder sonarMetricsQueryString = new StringBuilder();
        for (Metric metric : iterable) {
            sonarMetricsQueryString.append(metric.getMetricKey()).append(",");
        }
        String url = String.format("%s/measures/component?component=%s&metricKeys=%s&additionalFields=%s", apiUrl, projectName, sonarMetricsQueryString, "metrics");
        HttpHeaders headers = new HttpHeaders();
        String auth = apiKey + ":"; // Token followed by an empty password
        byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes(StandardCharsets.US_ASCII));
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);
        HttpEntity<String> entity = new HttpEntity<>(headers);
        try {
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            return new JSONObject(response.getBody());
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            System.err.println("HTTP Status Code: " + e.getStatusCode());
            System.err.println("HTTP Response Body: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            System.err.println("An error occurred: " + e.getMessage());
        }
        return null;
    }
    public double getSonarProjectScore(String projectName) {
        JSONObject sonarProjectMetrics = getSonarProjectMetrics(projectName);
        Iterable<Metric> iterable = this.metricRepository.findAll();
        int totalWeight = 0;
        int totalScore = 0;

        for (Metric metric : iterable) {
            String metricKey = metric.getMetricKey();
            int weight = metric.getWeight();
            String type = metric.getType();
            String bestValue = metric.getBestValue();
            String worstValue = metric.getWorstValue();

            JSONArray measuresArray = sonarProjectMetrics.getJSONObject("component").getJSONArray("measures");
            JSONObject metricJson = null;

            for (int i = 0; i < measuresArray.length(); i++) {
                JSONObject measure = measuresArray.getJSONObject(i);
                if (measure.getString("metric").equals(metricKey)) {
                    metricJson = measure;
                    break;
                }
            }
            System.out.println(metricJson.toString());

            if (metricJson != null) {
                String value = metricJson.getString("value");
                double multiplier = calculateMultiplier(value, bestValue, worstValue, type);
                System.out.println("Metric: " + metricKey + " Value: " + value + " Multiplier: " + multiplier);
                totalWeight += weight;
                totalScore += (int) (multiplier * weight);
            }
        }
        System.out.println("Total Weight: " + totalWeight + " Total Score: " + totalScore);

        return (double) totalScore / totalWeight;
    }

    private double calculateMultiplier(String value, String bestValue, String worstValue, String type) {
        switch (type) {
            case "RATING":
                double rating = Double.parseDouble(value);
                double bestRating = Double.parseDouble(bestValue);
                double worstRating = Double.parseDouble(worstValue);
                return (worstRating - rating) / (worstRating - bestRating);
            case "WORK_DUR":
                if(Integer.parseInt(value)>=Integer.parseInt(worstValue)){
                    return 0.0;
                } else {
                    return 1.0;
                }
            case "INT":
                if(Integer.parseInt(value)>=Integer.parseInt(worstValue)){
                    return 0.0;
                } else {
                    return 1.0;
                }
            case "PERCENT":
                double percent = Double.parseDouble(value);
                double bestPercent = Double.parseDouble(bestValue);
                double worstPercent = Double.parseDouble(worstValue);
                return bestPercent - percent / (bestPercent - worstPercent);
            default:
                return 0;
        }
    }

    public JSONObject analyzeSonarProject(String projectName){
        JSONObject sonarProjectIssues = getSonarProjectIssues(projectName);

        // Extract and print "effortTotal" and "debtTotal"
        int effortTotal = sonarProjectIssues.getInt("effortTotal");
        int debtTotal = sonarProjectIssues.getInt("debtTotal");
        System.out.println("effortTotal: " + effortTotal);
        System.out.println("debtTotal: " + debtTotal);

        // Initialize maps to count occurrences
        Map<String, Integer> severityCount = new HashMap<>();
        Map<String, Integer> cleanCodeAttributeCategoryCount = new HashMap<>();
        Map<String, Integer> softwareQualityCount = new HashMap<>();
        Map<String, Integer> tagCount = new HashMap<>();

        // Get the issues array
        JSONArray issues = sonarProjectIssues.getJSONArray("issues");

        // Iterate over each issue
        for (int i = 0; i < issues.length(); i++) {
            JSONObject issue = issues.getJSONObject(i);

            // Count severity occurrences
            String severity = issue.getString("severity");
            severityCount.put(severity, severityCount.getOrDefault(severity, 0) + 1);

            // Count cleanCodeAttributeCategory occurrences
            String cleanCodeAttributeCategory = issue.getString("cleanCodeAttributeCategory");
            cleanCodeAttributeCategoryCount.put(cleanCodeAttributeCategory, cleanCodeAttributeCategoryCount.getOrDefault(cleanCodeAttributeCategory, 0) + 1);

            // Count softwareQuality occurrences in impacts
            JSONArray impacts = issue.getJSONArray("impacts");
            for (int j = 0; j < impacts.length(); j++) {
                JSONObject impact = impacts.getJSONObject(j);
                String softwareQuality = impact.getString("softwareQuality");
                softwareQualityCount.put(softwareQuality, softwareQualityCount.getOrDefault(softwareQuality, 0) + 1);
            }

            // Count tag occurrences
            JSONArray tags = issue.getJSONArray("tags");
            for (int k = 0; k < tags.length(); k++) {
                String tag = tags.getString(k);
                tagCount.put(tag, tagCount.getOrDefault(tag, 0) + 1);
            }
        }

        // Print the counts with names
        System.out.println("Severity counts:");
        printCountMap(severityCount);

        System.out.println("Clean Code Attribute Category counts:");
        printCountMap(cleanCodeAttributeCategoryCount);

        System.out.println("Software Quality counts:");
        printCountMap(softwareQualityCount);

        System.out.println("Tag counts:");
        printCountMap(tagCount);

        // Create and return a JSON object with the maps' contents
        JSONObject resultJson = new JSONObject();
        resultJson.put("effortTotal", effortTotal);
        resultJson.put("debtTotal", debtTotal);
        resultJson.put("severityCounts", new JSONObject(severityCount));
        resultJson.put("cleanCodeAttributeCategoryCounts", new JSONObject(cleanCodeAttributeCategoryCount));
        resultJson.put("softwareQualityCounts", new JSONObject(softwareQualityCount));
        resultJson.put("tagCounts", new JSONObject(tagCount));

        return resultJson;
    }
    // Helper method to print the map in the desired format
    private void printCountMap(Map<String, Integer> countMap) {
        for (Map.Entry<String, Integer> entry : countMap.entrySet()) {
            System.out.println(entry.getKey() + " " + entry.getValue());
        }
    }
}
