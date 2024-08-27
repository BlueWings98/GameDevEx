package Game.DevEx.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
public class GameItem {

    /*
            GameItemId: "6",
            Name: "Minijuego Snake",
            Sprite: "MinijuegoSnake.png",
            Description: "Desbloquea el minijuego Snake.",
            Category: "Minijuego",
            Rarity: "Epico",
            IsUnique: true,
            Quantity: 1
     */
    @Id
    @Column(name = "gameitemid")
    private int GameItemId;
    @Column(name = "name")
    private String Name;
    @Column(name = "sprite")
    private String Sprite;
    @Column(name = "description")
    private String Description;
    @Column(name = "category")
    private String Category;
    @Column(name = "rarity")
    private String Rarity;
    @Column(name = "isunique")
    private boolean IsUnique;

}
