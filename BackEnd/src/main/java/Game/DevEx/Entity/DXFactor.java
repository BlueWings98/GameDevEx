package Game.DevEx.Entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class DXFactor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dxfactorid")
    private int DxFactorID;
    @Column(name = "dxfactorname")
    private String DxFactorName;
    @Column(name = "dxfactordescription")
    private String DxFactorDescription;
    @Column(name = "factorcategory")
    private String FactorCategory;
    @Column(name = "characteristicid")
    private String CharacteristicID;

    /* DX Factors
    **Development and Release**
    * Codebase Health
    * Development Environment
    * Automated Testing
    * Frictionless Release

    **Product Management**
    * Clear goals, scope, requirements
    * Working iteratively (small WIPs)
    * Unreasonable deadlines
    * Having a say on roadmaps/priorities
    * Providing value to the business

    **Collaboration and culture**
    * Supportiveness
    * Knowledge sharing
    * Feeling connected
    * Code review process
    * Collaboration between departments
    * Psychological safety
    * Communication
    * Having aligned values
    * Getting recognition

    **Developer flow and fulfillment**
    * Autonomy
    * Challenging/stimulating work
    * Making progress without obstacles
    * Uninterrupted time
    * Work-life balance
    * Learning
    * Stability of job and team
    * Clear paths for career growth
     */
    /* Contextual Characteristics
    *
    * 1. Expectations
    * 2. Seniority
    * 3. Personal Interests
    * 4. Company goals
    * 5. Company maturity
    * 6. Frequency of problems
    * 7. Presence of problems
     */

}
