package Game.DevEx.Service;

import Game.DevEx.Entity.Totolo;
import Game.DevEx.Entity.Users;
import Game.DevEx.Repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsersService {
    private final UsersRepository usersRepository;
    private final TotoloService totoloService;

    @Autowired
    public UsersService(UsersRepository usersRepository, TotoloService totoloService) {
        this.usersRepository = usersRepository;
        this.totoloService = totoloService;
    }
    public Users getUserById(int userId) {
        return usersRepository.findById(userId).orElseThrow();
    }

    public Users createUser(String userName, String email, int projectID) {
        Totolo defaultTotolo = totoloService.createDefaultTotolo();
        int totoloId = defaultTotolo.getTotoloID();
        String placeholderPassword = "password";
        Users user = new Users(userName, email, totoloId, projectID, placeholderPassword);
        return usersRepository.save(user);
    }
    public Users updateUser(Users user) {
        return usersRepository.save(user);
    }
    public boolean isUserNameAvailable(String UserName) {
        return usersRepository.findByUserName(UserName) == null;
    }

    public Users getUserByUserName(String userName) {
        return usersRepository.findByUserName(userName);
    }
}
