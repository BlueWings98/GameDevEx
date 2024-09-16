package Game.DevEx.Service;

import Game.DevEx.Entity.Users;
import Game.DevEx.Repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsersService {
    private final UsersRepository usersRepository;

    @Autowired
    public UsersService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }
    public Users getUserById(int userId) {
        return usersRepository.findById(userId).orElseThrow();
    }
}
