package Game.DevEx.Interface;

public interface iChatGptService {
    public String getVanillaCompletition(String prompt, double temperature, String setUpPrompt);

    String getSuperCompletition(String prompt, double temperature, String setUpPrompt);
}
