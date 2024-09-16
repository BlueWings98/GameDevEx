package Game.DevEx.Controller;

import Game.DevEx.Entity.Users;
import Game.DevEx.Service.UsersService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UsersController {
    @Autowired
    private UsersService usersService;

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
}
