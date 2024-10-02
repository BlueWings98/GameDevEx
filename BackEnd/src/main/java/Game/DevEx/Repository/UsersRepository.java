package Game.DevEx.Repository;

import Game.DevEx.Entity.Users;
import org.springframework.data.repository.CrudRepository;


public interface UsersRepository extends CrudRepository<Users, Integer> {
    Users findByUserName(String UserName);

    long countByProjectID(int projectID);
}
