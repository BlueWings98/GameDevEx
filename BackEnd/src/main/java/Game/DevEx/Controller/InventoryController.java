package Game.DevEx.Controller;

import Game.DevEx.DTOs.UseItemRequestDto;
import Game.DevEx.Service.InventoryService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.Console;

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
    @PutMapping("/use-item")
    public ResponseEntity<String> useItem(@RequestBody UseItemRequestDto request) {
        boolean success = inventoryService.useItem(request.getUserID(), request.getItemID(), request.getQuantity());
        if (success) {
            return ResponseEntity.ok("Item used successfully.");
        } else {
            return ResponseEntity.badRequest().body("Failed to update item quantity.");
        }
    }
    @PutMapping("/add-item")
    public ResponseEntity<String> addItem(@RequestBody UseItemRequestDto request) {
        System.out.println(" " + request.getUserID() + " " +  request.getItemID() + " "  +request.getQuantity());
        boolean success = inventoryService.addItem(request.getUserID(), request.getItemID(), request.getQuantity());
        if (success) {
            return ResponseEntity.ok("Item added successfully.");
        } else {
            return ResponseEntity.badRequest().body("Failed to update item quantity.");
        }
    }
}
