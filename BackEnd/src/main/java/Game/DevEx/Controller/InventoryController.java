package Game.DevEx.Controller;

import Game.DevEx.DTOs.UseItemRequestDto;
import Game.DevEx.Service.InventoryService;
import Game.DevEx.Service.ItemUsageService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
public class InventoryController {
    private final InventoryService inventoryService;
    private final ItemUsageService itemUsageService;

    @Autowired
    public InventoryController(InventoryService inventoryService, ItemUsageService itemUsageService) {
        this.inventoryService = inventoryService;
        this.itemUsageService = itemUsageService;
    }


    @GetMapping("/inventory")
    public String getUserInventory(@RequestParam("userID") String userID) {
        return inventoryService.getGameItemsAsJson(Integer.parseInt(userID)).toString();
    }
    @PutMapping("/use-item")
    public String useItem(@RequestBody UseItemRequestDto request) {
        String response = itemUsageService.useItem(request.getUserID(), request.getItemID(), request.getQuantity(), request.getTotoloID());
        return new JSONObject().put("response", response).toString();
    }
    @PutMapping("/add-item")
    public String addItem(@RequestBody UseItemRequestDto request) {
        boolean success = inventoryService.addItem(request.getUserID(), request.getItemID(), request.getQuantity());
        if (success) {
            return new JSONObject().put("response", "Item added successfully.").toString();
        } else {
            return new JSONObject().put("response", "Invalid request.").toString();
        }
    }
}
