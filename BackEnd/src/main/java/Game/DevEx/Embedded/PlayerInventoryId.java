package Game.DevEx.Embedded;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@Getter
@Setter
@Embeddable
public class PlayerInventoryId implements Serializable {

    @Column(name = "userid")
    private int userId;

    @Column(name = "gameitemid")
    private int gameItemId;
}

