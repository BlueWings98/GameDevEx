package Game.DevEx.Service;

import org.springframework.stereotype.Service;

@Service
public class InventoryService {
    public String getUserInventory(String userID) {
        return "User inventory for user " + userID;
    }
}
