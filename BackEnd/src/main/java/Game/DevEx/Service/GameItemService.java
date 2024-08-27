package Game.DevEx.Service;

import Game.DevEx.Entity.GameItem;
import Game.DevEx.Repository.GameItemRepository;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.Array;
import java.util.HashMap;
import java.util.Map;

@Service
public class GameItemService {

    private final GameItemRepository gameItemRepository;

    @Autowired
    public GameItemService(GameItemRepository gameItemRepository) {
        this.gameItemRepository = gameItemRepository;
    }

    public String getAllGameItems() {
        Iterable<GameItem> gameItems = gameItemRepository.findAll();
        JSONArray jsonArray = new JSONArray();

        for (GameItem gameItem : gameItems) {
            JSONObject jsonItem = new JSONObject();
            jsonItem.put("gameItemId", gameItem.getGameItemId());
            jsonItem.put("name", gameItem.getName());
            jsonItem.put("isUnique", gameItem.isIsUnique());
            jsonItem.put("sprite", gameItem.getSprite());
            jsonItem.put("description", gameItem.getDescription());
            jsonItem.put("category", gameItem.getCategory());
            jsonItem.put("rarity", gameItem.getRarity());
            jsonArray.put(jsonItem);
        }

        return jsonArray.toString();
    }
    public GameItem getGameItemById(int gameItemId) {
        return gameItemRepository.findById(gameItemId).orElse(null);
    }
}
