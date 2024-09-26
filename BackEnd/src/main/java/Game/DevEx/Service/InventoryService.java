package Game.DevEx.Service;

import Game.DevEx.Entity.GameItem;
import Game.DevEx.Entity.PlayerInventory;
import Game.DevEx.Embedded.PlayerInventoryId;
import Game.DevEx.Entity.Users;
import Game.DevEx.Repository.GameItemRepository;
import Game.DevEx.Repository.PlayerInventoryRepository;
import Game.DevEx.Repository.UsersRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class InventoryService {

    private final PlayerInventoryRepository playerInventoryRepository;
    private final GameItemService gameItemService;
    private final UsersRepository usersRepository;
    private final GameItemRepository gameItemRepository;

    @Autowired
    public InventoryService(PlayerInventoryRepository playerInventoryRepository, GameItemService gameItemService,
                            UsersRepository usersRepository, GameItemRepository gameItemRepository) {
        this.playerInventoryRepository = playerInventoryRepository;
        this.gameItemService = gameItemService;
        this.usersRepository = usersRepository;
        this.gameItemRepository = gameItemRepository;
    }
    public boolean useItem(int userId, int gameItemId, int quantity) {
        // Ensure quantity is valid
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0.");
        }

        // Check if the item is unique
        boolean isUnique = gameItemService.isItemUnique(gameItemId);

        // If the item is unique, skip subtracting from inventory and return true
        if (isUnique) {
            return true;
        }

        // Fetch the PlayerInventory entry for the given user and item
        PlayerInventory gameObjectEntry = playerInventoryRepository.findById(new PlayerInventoryId(userId, gameItemId)).orElse(null);

        // Validate that the item exists in the inventory
        if (gameObjectEntry == null) {
            throw new IllegalArgumentException("Item not found in inventory.");
        }

        // Check if the player has enough quantity of the item
        if (gameObjectEntry.getQuantity() < quantity) {
            throw new IllegalArgumentException("Not enough quantity of the item in inventory.");
        }

        // Subtract the quantity from the inventory
        gameObjectEntry.setQuantity(gameObjectEntry.getQuantity() - quantity);

        // Save the updated inventory entry
        playerInventoryRepository.save(gameObjectEntry);

        return true;
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
    public boolean hasCoins(int userId, int quantity) {
        // Check if the user has enough coins
        return playerInventoryRepository.existsById(new PlayerInventoryId(userId, 8)) && playerInventoryRepository.findById(new PlayerInventoryId(userId, 8)).orElse(null).getQuantity() >= quantity;
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

            // Retrieve the Users and GameItem from the database
            Users user = usersRepository.findById(userId).orElseThrow(() ->
                    new RuntimeException("User not found with ID: " + userId));
            GameItem gameItem = gameItemRepository.findById(gameItemId).orElseThrow(() ->
                    new RuntimeException("GameItem not found with ID: " + gameItemId));

            // Set the Users and GameItem in the PlayerInventory object
            gameObjectEntry.setUsers(user);
            gameObjectEntry.setGameItem(gameItem);
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
