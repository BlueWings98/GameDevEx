package Game.DevEx.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Embeddable
public class PlayerInventoryId implements Serializable {

    @Column(name = "userid")
    private int userId;

    @Column(name = "gameitemid")
    private int gameItemId;
}

