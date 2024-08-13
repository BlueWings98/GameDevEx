package Game.DevEx.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder

public class Metric {
    @Id
    @Column(name = "metrickey")
    private String metricKey;
    @Column(name = "name")
    private String name;
    @Column(name = "description")
    private String description;
    @Column(name = "metricdate")
    private LocalDate metricDate;
    @Column(name = "type")
    private String type;
    @Column(name = "bestvalue")
    private String bestValue;
    @Column(name = "worstvalue")
    private String worstValue;
    @Column(name = "weight")
    private int weight;

}
