package Game.DevEx.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class RewardsLog {
    //CREATE TABLE rewards_log (
    //    transactionid SERIAL PRIMARY KEY,  -- Unique ID for the transaction
    //    userid INT NOT NULL,               -- Foreign key to Users table
    //    gameitemid INT NOT NULL,             -- Foreign key to Rewards table
    //    pulls_without_legendary INT NOT NULL, -- Number of pulls without legendary
    //    reward_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Date and time of the reward
    //    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE,
    //    FOREIGN KEY (gameitemid) REFERENCES gameitem(gameitemid) ON DELETE CASCADE
    //);
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name = "transactionid")
    private int transactionID;
    @Column(name = "userid")
    private int userID;
    @Column(name = "gameitemid")
    private int gameItemID;
    @Column(name = "pulls_without_legendary")
    private int pullsWithoutLegendary;
    @Column(name = "reward_date")
    private LocalDateTime rewardDate;

    public RewardsLog(int userID, int gameItemID, int pullsWithoutLegendary) {
        this.userID = userID;
        this.gameItemID = gameItemID;
        this.pullsWithoutLegendary = pullsWithoutLegendary;
        this.rewardDate = LocalDateTime.now();
    }

}
