package Game.DevEx.Entity;

import Game.DevEx.Embedded.DropTableId;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "droptable")
public class DropTable {

    @EmbeddedId
    private DropTableId id;

    @Column(name = "rarity")
    private String rarity;

    @Column(name = "droprate")
    private double dropRate;

}
