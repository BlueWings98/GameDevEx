package Game.DevEx.Controller;

import Game.DevEx.DTOs.PromptRequestDto;
import Game.DevEx.Service.ChatGptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
public class ChatGptController {
    @Autowired
    private ChatGptService chatGptService;

    @GetMapping("/chatgpt")
    public Mono<String> getCompletion(@RequestBody PromptRequestDto promptRequestDto) {
        return Mono.just(chatGptService.getVanillaCompletition(promptRequestDto.getPrompt(), 0.8, ""));
    }
    @GetMapping("/chatgpt/init")
    public Mono<String> getInitPrompt() {
        return Mono.just(chatGptService.getVanillaCompletition("", 0.8, "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly."));
    }
}
