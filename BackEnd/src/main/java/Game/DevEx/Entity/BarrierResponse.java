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
@Table(name = "barrierresponse")
public class BarrierResponse {
    //    barrierresponseid SERIAL PRIMARY KEY,
    //    barrierid INTEGER NOT NULL,
    //    responsevalue INTEGER NOT NULL,
    //    responsedate DATE NOT NULL);
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "barrierresponseid")
    private int barrierResponseId;
    @Column(name = "barriertoimprovementid")
    private int barriertoimprovementiId;
    @Column(name = "responsevalue")
    private int responseValue;
    @Column(name = "responsedate")
    private LocalDate responseDate;

    public BarrierResponse(int barrierResponseId, int responseValue, LocalDate responseDate) {
        this.barriertoimprovementiId = barrierResponseId;
        this.responseValue = responseValue;
        this.responseDate = responseDate;
    }
}
