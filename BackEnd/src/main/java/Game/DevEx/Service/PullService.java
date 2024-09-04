package Game.DevEx.Service;

import Game.DevEx.DTOs.PullsDto;
import Game.DevEx.Embedded.DropTableId;
import Game.DevEx.Entity.DropTable;
import Game.DevEx.Entity.GameItem;
import Game.DevEx.Repository.DropTableRepository;
import Game.DevEx.Repository.GameItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PullService {

    private final DropTableRepository dropTableRepository;
    private final InventoryService inventoryService;
    private final GameItemRepository gameItemRepository;

    @Autowired
    public PullService(DropTableRepository dropTableRepository, InventoryService inventoryService, GameItemRepository gameItemRepository) {
        this.dropTableRepository = dropTableRepository;
        this.inventoryService = inventoryService;
        this.gameItemRepository = gameItemRepository;
    }

    public List<GameItem> pull(PullsDto pullsDto) {
        List<GameItem> rewards = new ArrayList<>();
        int userId = Integer.parseInt(pullsDto.getUserID());
        int numberOfPulls = Integer.parseInt(pullsDto.getNumberOfPulls());
        System.out.println("Pulling " + numberOfPulls + " times for user " + userId);
        for (int i = 0; i < numberOfPulls; i++) {
            GameItem gameItem = getRandomGameItem(pullsDto.getDropTableId(), userId);
            System.out.println("Pulled: " + gameItem);
            if(gameItem != null){
                rewards.add(gameItem);
                inventoryService.addItem(userId, gameItem.getGameItemId(), 1);
            } else{
                throw new NullPointerException("Game item was not found");
            }

        }
        return rewards;
    }

    private GameItem getRandomGameItem(String dropTableId, int userId) {
        List<DropTable> dropTables = dropTableRepository.findByDropTableID(Integer.parseInt(dropTableId));
        double random = Math.random();

        double cumulativeProbability = 0.0;
        for (DropTable dropTable : dropTables) {
            cumulativeProbability += dropTable.getDropRate();
            if (random <= cumulativeProbability) {
                GameItem gameItem = gameItemRepository.findById(dropTable.getId().getGameItemId()).orElse(null);

                if (gameItem != null && gameItem.isIsUnique()) {
                    // Check if the user already has the unique item
                    while (inventoryService.hasItem(userId, gameItem.getGameItemId())) {
                        return getRandomGameItem(dropTableId, userId); // Re-roll if unique and already owned
                    }
                }

                return gameItem;
            }
        }
        return null; // In case no item was chosen, though unlikely if drop rates are set correctly
    }
}
