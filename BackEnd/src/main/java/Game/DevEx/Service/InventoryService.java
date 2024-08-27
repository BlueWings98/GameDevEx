package Game.DevEx.Service;

import Game.DevEx.Repository.PlayerInventoryRepository;
import io.swagger.v3.core.util.Json;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class InventoryService {

    private final PlayerInventoryRepository playerInventoryRepository;

    @Autowired
    public InventoryService(PlayerInventoryRepository playerInventoryRepository) {
        this.playerInventoryRepository = playerInventoryRepository;
    }

    public JSONObject getGameItemsAsJson(int userId) {
        List<Object[]> items = playerInventoryRepository.findGameItemIdsAndQuantitiesByUserId(userId);
        Map<Integer, Integer> result = new HashMap<>();

        for (Object[] item : items) {
            int gameItemId = (int) item[0];
            int quantity = (int) item[1];
            result.put(gameItemId, quantity);
        }

        try {
            // Convert the map to a JSONObject
            return new JSONObject(result);
        } catch (Exception e) {
            e.printStackTrace();
            return new JSONObject();
        }
    }
}
