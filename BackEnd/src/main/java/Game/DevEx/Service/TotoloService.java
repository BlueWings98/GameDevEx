package Game.DevEx.Service;

import Game.DevEx.Entity.Totolo;
import Game.DevEx.Repository.TotoloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;

@Service
public class TotoloService {

    private static final int BATTERY_RECHARGE_RATE = 25; // 25% recharge
    private static final int HOURS_TO_RECHARGE = 8;      // Recharge every 8 hours
    private static final int MAX_BATTERY = 100;          // Max battery value
    private static final int SURVEY_COST = 25;            // Cost to pull

    private final TotoloRepository totoloRepository;
    private final InventoryService inventoryService;

    @Autowired
    public TotoloService(TotoloRepository totoloRepository , InventoryService inventoryService) {
        this.totoloRepository = totoloRepository;
        this.inventoryService = inventoryService;
    }

    public Totolo getTotolo(int TotoloID) {
        return this.totoloRepository.findById(TotoloID).orElseThrow();
    }
    public boolean dischargeBatteryBySurvey(int TotoloID, int numberOfSurveys) {
        Totolo totolo = this.totoloRepository.findById(TotoloID).orElseThrow();
        if(totolo.getBattery() >= SURVEY_COST * numberOfSurveys){
            totolo.setBattery(totolo.getBattery() - (SURVEY_COST * numberOfSurveys));
            totoloRepository.save(totolo);
            return true;
        } else {
            return false;
        }
    }

    public Totolo rechargeBatteryAndUpdateHunger(int TotoloID) {

        Totolo totolo = this.totoloRepository.findById(TotoloID).orElseThrow();

        LocalDate lastLogin = totolo.getLastLogin();
        LocalDate currentLogin = LocalDate.now();

        // Calculate days passed since last login
        long daysElapsed = Duration.between(lastLogin.atStartOfDay(), currentLogin.atStartOfDay()).toDays();

        // Update hunger: subtract 1 for each day that has passed
        int newHunger = totolo.getHunger() - (int) daysElapsed;
        newHunger = Math.max(newHunger, 0); // Ensure hunger doesn't go below 0 (highest hunger)

        // Battery recharge logic remains the same
        Duration duration = Duration.between(lastLogin.atStartOfDay(), currentLogin.atStartOfDay());
        long hoursElapsed = duration.toHours();
        long rechargePeriods = hoursElapsed / HOURS_TO_RECHARGE;

        int newBattery = totolo.getBattery() + (int) (rechargePeriods * BATTERY_RECHARGE_RATE);
        newBattery = Math.min(newBattery, MAX_BATTERY); // Ensure battery doesn't exceed 100%

        // Update Totolo entity
        totolo.setBattery(newBattery);
        totolo.setHunger(newHunger);
        totolo.setLastLogin(currentLogin);

        // Save updated entity
        totoloRepository.save(totolo);

        return totolo;
    }

    public String changeSkin(int TotoloID, String newSkin) {
        Totolo totolo = this.totoloRepository.findById(TotoloID).orElseThrow();
        totolo.setSkin(newSkin);
        totoloRepository.save(totolo);
        return "Skin changed to " + newSkin;
    }
    public String maxBattery(int TotoloID) {
        Totolo totolo = this.totoloRepository.findById(TotoloID).orElseThrow();
        totolo.setBattery(MAX_BATTERY);
        totoloRepository.save(totolo);
        return "Battery recharged to 100%";
    }
    public String changeName(int TotoloID, String newName) {
        Totolo totolo = this.totoloRepository.findById(TotoloID).orElseThrow();
        totolo.setName(newName);
        totoloRepository.save(totolo);
        return "Name changed to " + newName;
    }
    public String feedTotolo(int TotoloID, int foodItemID, int userID){
        // Check if the user has the item
        if(inventoryService.useItem(userID, foodItemID, 1)){
            Totolo totolo = this.totoloRepository.findById(TotoloID).orElseThrow();
            int temp = totolo.getHunger() + 1;
            totolo.setHunger(Math.min(temp, 3));
            totoloRepository.save(totolo);
            return "Totolo was fed";
        } else {
            return "You don't have the required item to feed Totolo";
        }

    }
}

