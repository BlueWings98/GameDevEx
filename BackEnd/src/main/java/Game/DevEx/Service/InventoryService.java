package Game.DevEx.Service;

import Game.DevEx.Entity.PlayerInventory;
import Game.DevEx.Embedded.PlayerInventoryId;
import Game.DevEx.Repository.PlayerInventoryRepository;
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
    public boolean useItem (int userId, int gameItemId, int quantity) {
        // Get the desired object
        PlayerInventory gameObjectEntry = playerInventoryRepository.findById(new PlayerInventoryId(userId, gameItemId)).orElse(null);

        // Check if the object exists and if the quantity is enough. It should never be negative.
        if (gameObjectEntry != null && gameObjectEntry.getQuantity() >= quantity && quantity >= 0) {
            // Update the quantity
            gameObjectEntry.setQuantity(gameObjectEntry.getQuantity() - quantity);
            playerInventoryRepository.save(gameObjectEntry);
            return true;
        } else {
            return false;
        }
    }
    public boolean addItem(int userId, int gameItemId, int quantity) {
        // Ensure the quantity is positive
        if (quantity < 0) {
            return false;
        }

        // Create the ID for the PlayerInventory
        PlayerInventoryId id = new PlayerInventoryId(userId, gameItemId);

        // Retrieve the existing entry, if it exists
        PlayerInventory gameObjectEntry = playerInventoryRepository.findById(id).orElse(null);

        if (gameObjectEntry != null) {
            // Update the quantity of the existing entry
            gameObjectEntry.setQuantity(gameObjectEntry.getQuantity() + quantity);
        } else {
            // Create a new entry if it does not exist
            gameObjectEntry = new PlayerInventory();
            gameObjectEntry.setId(id);
            gameObjectEntry.setQuantity(quantity);
        }

        // Save the updated or newly created entry
        playerInventoryRepository.save(gameObjectEntry);

        return true;
    }
    public boolean hasItem(int userId, int gameItemId) {
        // Check if the item exists in the inventory
        return playerInventoryRepository.existsById(new PlayerInventoryId(userId, gameItemId));
    }

}
