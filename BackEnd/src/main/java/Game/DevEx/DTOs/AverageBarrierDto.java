package Game.DevEx.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AverageBarrierDto {
    private int barrierToImprovementId;
    private double averageBarrierValue;
}
