package Game.DevEx.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class BarrierResponse {
    //    barrierresponseid SERIAL PRIMARY KEY,
    //    barrierid INTEGER NOT NULL,
    //    responsevalue INTEGER NOT NULL,
    //    responsedate DATE NOT NULL);
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "barrierresponseid")
    private int barrierResponseId;
    @Column(name = "barrierid")
    private int barrierId;
    @Column(name = "responsevalue")
    private int responseValue;
    @Column(name = "responsedate")
    private LocalDate responseDate;

    public BarrierResponse(int barrierId, int responseValue, LocalDate responseDate) {
        this.barrierId = barrierId;
        this.responseValue = responseValue;
        this.responseDate = responseDate;
    }
}
