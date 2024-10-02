package Game.DevEx.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class Users {
    /*
    UserID SERIAL PRIMARY KEY,
    UserName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Password VARCHAR(100) NOT NULL
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userid")
    private int UserID;
    @Column(name = "username")
    private String userName;
    @Column(name = "email")
    private String Email;
    @Column(name = "password")
    private String Password;
    @Column(name = "projectid")
    private int projectID;
    @Column(name = "totoloid")
    private int TotoloID;

    public Users(String userName, String email, int totoloId, int projectID, String password) {
        this.userName = userName;
        this.TotoloID = totoloId;
        this.projectID = projectID;
        this.Email = email;
        this.Password = password;
    }
}
