package Game.DevEx.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ItemUsageService {

    private final InventoryService inventoryService;
    private final TotoloService totoloService;

    @Autowired
    public ItemUsageService(InventoryService inventoryService, TotoloService totoloService) {
        this.inventoryService = inventoryService;
        this.totoloService = totoloService;
    }

    public String useItem(int userId, int gameItemId, int quantity, int totoloID) {
        // First, use the item in the inventory service
        boolean success = inventoryService.useItem(userId, gameItemId, quantity);

        if (success) {
            // Then apply the item effect using TotoloService
            return applyItemEffect(gameItemId, totoloID);
        }
        return "Insufficient item quantity or invalid item.";
    }

    private String applyItemEffect(int gameItemId, int totoloID) {
        return switch (gameItemId) {
            case 0, 1, 2 -> totoloService.feedTotolo(totoloID);
            case 3 -> totoloService.changeSkin(totoloID, "Blue");
            case 4 -> totoloService.changeSkin(totoloID, "Pink");
            case 5 -> totoloService.changeSkin(totoloID, "Green");
            case 6 -> "Cargando el minijuego de la serpiente...";
            case 7 -> "¡Has ganado el premio mayor!";
            case 8 -> "Ganas monedas al hacer encuestas, apuestalas en el casino.";
            default -> "Este objeto no tiene efecto.";
        };
    }
}