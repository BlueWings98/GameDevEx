package Game.DevEx.Service;

import Game.DevEx.DTOs.AverageDxFactorDto;
import Game.DevEx.Entity.DXFactor;
import Game.DevEx.Repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    private final SurveyRepository surveyRepository;
    private final DXFactorRepository dxFactorRepository;
    private final BarrierResponseRepository barrierResponseRepository;
    private final StrategyRepository strategyRepository;
    private final ProjectRepository projectRepository;

    public ReportService(SurveyRepository surveyRepository, DXFactorRepository dxFactorRepository, BarrierResponseRepository barrierResponseRepository, StrategyRepository strategyRepository, ProjectRepository projectRepository) {
        this.surveyRepository = surveyRepository;
        this.dxFactorRepository = dxFactorRepository;
        this.barrierResponseRepository = barrierResponseRepository;
        this.strategyRepository = strategyRepository;
        this.projectRepository = projectRepository;
    }

    public String mostImportantDXFactorByProject(int ProjectId) {
        List<AverageDxFactorDto> dxFactorValues = surveyRepository.findAverageDxfactorValuesByProjectID(ProjectId);
        //Get the DXFactor with the highest average value
        DXFactor mostCommonDXFactor = dxFactorRepository.findById(dxFactorValues.get(0).getDxFactorId()).get();
        return "The most important DX Factor for project " + ProjectId + " is " + mostCommonDXFactor.getDxFactorName() + " with an average value of " + dxFactorValues.get(0).getAverageDxFactorValue();

    }
    public String mostImportantDXFactorByAllProjects() {
        List<AverageDxFactorDto> dxFactorValues = surveyRepository.findAverageDxfactorValuesForAllProjects();
        //Get the DXFactor with the highest average value
        DXFactor mostCommonDXFactor = dxFactorRepository.findById(dxFactorValues.get(0).getDxFactorId()).get();
        return "The most important DX Factor for all projects is " + mostCommonDXFactor.getDxFactorName() + " with an average value of " + dxFactorValues.get(0).getAverageDxFactorValue();
    }
}
