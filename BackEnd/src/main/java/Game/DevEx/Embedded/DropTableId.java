package Game.DevEx.Embedded;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Embeddable
public class DropTableId implements Serializable {

    @Column(name = "droptableid")
    private int dropTableID;

    @Column(name = "gameitemid")
    private int GameItemId;

}
