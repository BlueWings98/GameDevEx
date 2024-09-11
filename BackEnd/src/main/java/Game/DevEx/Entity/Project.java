package Game.DevEx.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "project")
public class Project {
    @Id
    @Column(name = "projectid")
    private int ProjectId;
    @Column(name = "projectkey")
    private String ProjectKey;
    @Column(name = "projectname")
    private String ProjectName;
    @Column(name = "projectdescription")
    private String ProjectDescription;
    @Column(name = "projectstatus")
    private int ProjectStatus;

}
