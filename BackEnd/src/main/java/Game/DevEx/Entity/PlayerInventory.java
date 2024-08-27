package Game.DevEx.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class PlayerInventory {

    @EmbeddedId
    private PlayerInventoryId id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "userid", referencedColumnName = "userid")
    private Users users;

    @ManyToOne
    @MapsId("gameItemId")
    @JoinColumn(name = "gameitemid", referencedColumnName = "gameitemid")
    private GameItem gameItem;

    @Column(name = "quantity")
    private int quantity;
}
