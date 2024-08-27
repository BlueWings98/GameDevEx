package Game.DevEx.Controller;

import Game.DevEx.Service.InventoryService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class InventoryController {
    private final InventoryService inventoryService;

    @Autowired
    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }


    @GetMapping("/inventory")
    public String getUserInventory(@RequestBody String userID) {
        JSONObject response = new JSONObject(userID);
        userID = response.getString("userID");
        return inventoryService.getGameItemsAsJson(Integer.parseInt(userID)).toString();
    }
}
