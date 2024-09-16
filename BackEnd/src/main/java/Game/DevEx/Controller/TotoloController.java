package Game.DevEx.Controller;

import Game.DevEx.Entity.Totolo;
import Game.DevEx.Service.TotoloService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/totolo")
public class TotoloController {
    @Autowired
    private TotoloService totoloService;

    @GetMapping
    public String getTotolo(@RequestParam int TotoloID) {
        JSONObject jsonObject = new JSONObject();
        Totolo result = totoloService.getTotolo(TotoloID);
        jsonObject.put("TotoloID", result.getTotoloID());
        jsonObject.put("Name", result.getName());
        jsonObject.put("Skin", result.getSkin());
        jsonObject.put("Hunger", result.getHunger());
        jsonObject.put("Battery", result.getBattery());
        jsonObject.put("LastLogin", result.getLastLogin().toString());
        return jsonObject.toString();
    }
    @PostMapping("/recharge")
    public String rechargeBatteryAndUpdateHunger(@RequestParam int TotoloID) {
        JSONObject jsonObject = new JSONObject();
        Totolo response = totoloService.rechargeBatteryAndUpdateHunger(TotoloID);
        jsonObject.put("Battery", response.getBattery());
        jsonObject.put("Hunger", response.getHunger());
        jsonObject.put("Skin", response.getSkin());
        return jsonObject.toString();
    }
    @PostMapping("/skin")
    public String changeSkin(@RequestParam int TotoloID, @RequestParam String newSkin) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("response", totoloService.changeSkin(TotoloID, newSkin));
        return jsonObject.toString();
    }
    @PostMapping("/maxbattery")
    public String setMaxBattery(@RequestParam int TotoloID){
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("response", totoloService.maxBattery(TotoloID));
        return jsonObject.toString();
    }
    @PostMapping("/name")
    public String changeName(@RequestParam int TotoloID, @RequestParam String newName){
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("response", totoloService.changeName(TotoloID, newName));
        return jsonObject.toString();
    }
    @PostMapping("/feed")
    public String feedTotolo(@RequestParam int TotoloID, @RequestParam int foodItemID, @RequestParam int userID){
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("response", totoloService.feedTotolo(TotoloID, foodItemID, userID));
        return jsonObject.toString();
    }
}
