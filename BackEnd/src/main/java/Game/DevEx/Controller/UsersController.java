package Game.DevEx.Controller;

import Game.DevEx.Entity.Totolo;
import Game.DevEx.Entity.Users;
import Game.DevEx.Service.TotoloService;
import Game.DevEx.Service.UsersService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.Console;

@RestController
@RequestMapping("/users")
public class UsersController {
    @Autowired
    private UsersService usersService;
    @Autowired
    private TotoloService totoloService;

    @GetMapping
    public String getUserById(@RequestParam int userId) {
        JSONObject jsonObject = new JSONObject();
        Users result = usersService.getUserById(userId);
        jsonObject.put("UserID", result.getUserID());
        jsonObject.put("TotoloID", result.getTotoloID());
        jsonObject.put("Username", result.getUserName());
        jsonObject.put("Password", result.getPassword());
        jsonObject.put("Email", result.getEmail());
        jsonObject.put("ProjectID", result.getProjectID());

        return jsonObject.toString();
    }
    @GetMapping("/available")
    public String isUserNameAvailable(@RequestParam String userName) {
        JSONObject jsonObject = new JSONObject();
        boolean result = usersService.isUserNameAvailable(userName);
        jsonObject.put("isUserNameAvailable", result);

        return jsonObject.toString();
    }
    @PutMapping
    public String updateUser(@RequestBody Users user) {
        JSONObject jsonObject = new JSONObject();
        if(usersService.isUserNameAvailable(user.getUserName())) {
            jsonObject.put("error", "That user already exists.");
            return jsonObject.toString();
        }
        Users result = usersService.updateUser(user);
        jsonObject.put("UserID", result.getUserID());
        jsonObject.put("TotoloID", result.getTotoloID());
        jsonObject.put("Username", result.getUserName());
        jsonObject.put("Password", result.getPassword());
        jsonObject.put("Email", result.getEmail());
        jsonObject.put("ProjectID", result.getProjectID());

        return jsonObject.toString();
    }
    @PostMapping
    public String createUser(@RequestBody Users user) {
        JSONObject jsonObject = new JSONObject();
        System.out.println(user.getUserName() + " " + user.getEmail() + " " + user.getProjectID());
        Users result = usersService.createUser(user.getUserName(), user.getEmail(),user.getProjectID());
        jsonObject.put("UserID", result.getUserID());
        jsonObject.put("TotoloID", result.getTotoloID());
        jsonObject.put("Username", result.getUserName());
        jsonObject.put("Password", result.getPassword());
        jsonObject.put("Email", result.getEmail());
        jsonObject.put("ProjectID", result.getProjectID());
        jsonObject.put("CharacterSkin", totoloService.getTotolo(result.getTotoloID()).getSkin());

        return jsonObject.toString();
    }
    @PostMapping("/login")
    public String login(@RequestBody String userName) {
        JSONObject jsonObject = new JSONObject();
        JSONObject response = new JSONObject(userName);
        userName = response.getString("userName");
        System.out.println(userName);
        if(usersService.isUserNameAvailable(userName)) {
            jsonObject.put("error", "That user does not exist.");
            return jsonObject.toString();
        }
        Users result = usersService.getUserByUserName(userName);
        Totolo totolo = totoloService.getTotolo(result.getTotoloID());
        jsonObject.put("UserID", result.getUserID());
        jsonObject.put("TotoloID", result.getTotoloID());
        jsonObject.put("ProjectID", result.getProjectID());
        jsonObject.put("CharacterSkin", totolo.getSkin());

        return jsonObject.toString();
    }
}
