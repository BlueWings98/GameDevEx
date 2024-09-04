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
public class Survey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "surveyid")
    private int SurveyID;
    @Column(name = "userid")
    private int UserID;
    @Column(name = "userresponse")
    private String UserResponse;
    @Column(name = "gptresponse")
    private String GPTResponse;
    @Column(name = "dxfactorname")
    private String DXFactorName;
    @Column(name = "dxfactorid")
    private int DXFactorID;
    @Column(name = "dxfactorvalue")
    private int DXFactorValue;
    @Column(name = "surveydate")
    private LocalDate SurveyDate;

    public Survey(String dxFactorName, int DXFactorID, int UserID ,String userResponse, int measuredEmotion, String gptResponse) {
        this.UserID = UserID;
        this.UserResponse = userResponse;
        this.DXFactorID = DXFactorID;
        this.DXFactorName = dxFactorName;
        this.DXFactorValue = measuredEmotion;
        this.SurveyDate = LocalDate.now();
        this.GPTResponse = gptResponse;
    }
}
