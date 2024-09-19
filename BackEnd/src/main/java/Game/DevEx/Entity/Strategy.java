package Game.DevEx.Entity;

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
@Table(name = "strategy")
public class Strategy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "strategyid")
    private int strategyID;
    @Column(name = "name")
    private String name;
    @Column(name = "description")
    private String description;
    @Column(name = "isteamstrategy")
    private Boolean isTeamStrategy;
}
