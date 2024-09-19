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
@Table(name = "barriertoimprovement")
public class BarrierToImprovement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "barriertoimprovementid")
    private int barrierToImprovementId;
    @Column(name = "name")
    private String name;
    @Column(name = "description")
    private String description;
}
