package Game.DevEx.Service;

import Game.DevEx.DTOs.PullsDto;
import Game.DevEx.Embedded.DropTableId;
import Game.DevEx.Entity.DropTable;
import Game.DevEx.Entity.GameItem;
import Game.DevEx.Entity.RewardsLog;
import Game.DevEx.Entity.Users;
import Game.DevEx.Repository.DropTableRepository;
import Game.DevEx.Repository.GameItemRepository;
import Game.DevEx.Repository.RewardsLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PullService {

    private final DropTableRepository dropTableRepository;
    private final InventoryService inventoryService;
    private final GameItemRepository gameItemRepository;
    private final RewardsLogRepository rewardsLogRepository;
    @Autowired
    public PullService(DropTableRepository dropTableRepository, InventoryService inventoryService,
                       GameItemRepository gameItemRepository, RewardsLogRepository rewardsLogRepository) {
        this.dropTableRepository = dropTableRepository;
        this.inventoryService = inventoryService;
        this.gameItemRepository = gameItemRepository;
        this.rewardsLogRepository = rewardsLogRepository;

    }

    public List<GameItem> pull(PullsDto pullsDto) {
        List<GameItem> rewards = new ArrayList<>();
        int userId = Integer.parseInt(pullsDto.getUserID());
        int numberOfPulls = Integer.parseInt(pullsDto.getNumberOfPulls());
        System.out.println("Pulling " + numberOfPulls + " times for user " + userId);
        if(inventoryService.hasCoins(userId, numberOfPulls)) {
            for (int i = 0; i < numberOfPulls; i++) {
                inventoryService.useItem(userId, 8, 1); // Use 1 coin
                GameItem gameItem = getRandomGameItem(pullsDto.getDropTableId(), userId);
                if (gameItem != null) {
                    int pityCounter = 0;
                    if(gameItem.getGameItemId() != 7) {
                        pityCounter = calculatePityByUserId(userId);
                    }
                    if(pityCounter >= 90){
                        pityCounter = 0;
                        gameItem = gameItemRepository.findById(7).orElse(null);
                    }
                    inventoryService.addItem(userId, gameItem.getGameItemId(), 1);

                    System.out.println("Pulled: " + gameItem);
                    rewards.add(gameItem);
                    rewardsLogRepository.save(new RewardsLog(userId, gameItem.getGameItemId(), pityCounter));
                } else {
                    throw new NullPointerException("Game item was not found");
                }
            }
        } else {
            throw new IllegalArgumentException("User does not have enough coins");
        }
        return rewards;
    }

    public int calculatePityByUserId(int userId) {
        // The max number of pulls before a guaranteed legendary is 90
        final int MAX_PULLS_BEFORE_LEGENDARY = 90;
        final int LEGENDARY_ITEM_ID = 7;

        // Query the rewards log for this user's pulls, ordered by date
        List<RewardsLog> pulls = rewardsLogRepository.findAllByUserIdOrderByRewardDateDesc(userId);

        // Initialize the counter for non-legendary pulls
        int nonLegendaryPulls = 0;

        // Iterate through the pulls
        for (RewardsLog pull : pulls) {
            if (pull.getGameItemID() == LEGENDARY_ITEM_ID) {
                // If we find a legendary pull, reset the counter to 0
                break;
            } else {
                // Count non-legendary pulls
                nonLegendaryPulls++;
            }
        }

        // If the user has made 89 non-legendary pulls, the next one will be a legendary
        if (nonLegendaryPulls >= MAX_PULLS_BEFORE_LEGENDARY) {
            return 0; // Guarantee a legendary on the next pull
        }

        return nonLegendaryPulls; // Return the number of pulls since the last legendary
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
