package Game.DevEx.Controller;

import Game.DevEx.Service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class InventoryController {
    @Autowired
    private InventoryService inventoryService;

    @GetMapping("/inventory")
    public String getUserInventory(@RequestBody String userID) {
        return inventoryService.getUserInventory(userID);
    }
}
