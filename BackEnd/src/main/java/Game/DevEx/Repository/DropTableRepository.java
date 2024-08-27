package Game.DevEx.Repository;

import Game.DevEx.Embedded.DropTableId;
import Game.DevEx.Entity.DropTable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DropTableRepository extends CrudRepository<DropTable, DropTableId> {

    // Query to find all entries where dropTableID equals the given number
    @Query("SELECT d FROM DropTable d WHERE d.id.dropTableID = :dropTableID")
    List<DropTable> findByDropTableID(@Param("dropTableID") int dropTableID);
}
