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
@Table(name = "totolo")
public class Totolo {
    //This is the virtual pet entity
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "totoloid")
    private int TotoloID;
    @Column(name = "name")
    private String Name;
    @Column(name = "skin")
    private String Skin;
    @Column(name = "hunger")
    private int Hunger;
    @Column(name = "battery")
    private int Battery;
    @Column(name = "lastlogin")
    private LocalDate LastLogin;

}
