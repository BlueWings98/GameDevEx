
CREATE TABLE Project (
    ProjectID SERIAL PRIMARY KEY,
    ProjectKey VARCHAR(100) NOT NULL,
    ProjectName VARCHAR(100) NOT NULL,
    ProjectDescription TEXT
);

CREATE TABLE Metric (
    MetricID SERIAL PRIMARY KEY,
    MetricKey VARCHAR(255) NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Description TEXT,
    MetricDate DATE NOT NULL,
    Type VARCHAR(15) NOT NULL,
    BestValue VARCHAR(10) NOT NULL,
    WorstValue VARCHAR(10),
    Weight INT NOT NULL
);
INSERT INTO Project (ProjectKey, ProjectName, ProjectDescription) VALUES
('DevExOrg_torchchat', 'Torch Chat', 'torchchat is a small codebase showcasing the ability to run large language models (LLMs) seamlessly. With torchchat, you can run LLMs using Python, within your own (C/C++) application (desktop or server) and on iOS and Android.');

INSERT INTO Metric (MetricKey, Name, Description, MetricDate, Type, BestValue, WorstValue, Weight) VALUES
('reliability_rating', 'Reliability Rating', 'Reliability rating', '2024-08-13', 'RATING', '1.0', '5.0', 100),
('security_rating', 'Security Rating', 'Security rating', '2024-08-13', 'RATING', '1.0', '5.0', 100),
('sqale_debt_ratio', 'Technical Debt Ratio', 'Ratio of the actual technical debt compared to the estimated cost to develop the whole source code from scratch', '2024-08-13', 'PERCENT', '0.0', '100.0', 100),
('squale_rating', 'Maintainability Rating', 'A-to-E rating based on the technical debt ratio', '2024-08-13', 'RATING', '1.0', '5.0', 100),
('vulnerabilities', 'Vulnerabilities', 'Vulnerabilities', '2024-08-13', 'INT', '0', '1', 100),
('security_review_rating', 'Security Review Rating', 'Security Review Rating', '2024-08-13', 'RATING', '1.0', '5.0', 100),
('security_rating', 'Security Rating', 'Security Rating', '2024-08-13', 'RATING', '1.0', '5.0', 100),
('bugs', 'Bugs', 'Bugs', '2024-08-13', 'INT', '0', '1', 100),
('code_smells', 'Code Smells', 'Code Smells', '2024-08-13', 'INT', '0', '1', 100),
('reliability_remediation_effort', 'Reliability Remediation Effort', 'Reliability Remediation Effort', '2024-08-13', 'WORK_DUR', '0', '1', 40),
('effort_to_reach_maintainability_rating_a', 'Effort to Reach Maintainability Rating A', 'Effort to Reach Maintainability Rating A', '2024-08-13', 'WORK_DUR', '0', '1', 40);
