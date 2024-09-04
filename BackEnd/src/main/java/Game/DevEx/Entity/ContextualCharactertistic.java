package Game.DevEx.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class ContextualCharactertistic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int CharactertisticID;
    private String CharactertisticName;
    private String CharactertisticDescription;


}
