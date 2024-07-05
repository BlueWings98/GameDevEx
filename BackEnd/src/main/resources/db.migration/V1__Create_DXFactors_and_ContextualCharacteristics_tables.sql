-- V1__Create_DXFactors_and_ContextualCharacteristics_tables.sql

-- Create ContextualCharacteristics table
CREATE TABLE ContextualCharacteristic (
    CharacteristicID SERIAL PRIMARY KEY,
    CharacteristicName VARCHAR(255) NOT NULL
    CharacteristicDescription TEXT
);

-- Create DXFactors table
CREATE TABLE DXFactors (
    DxFactorID SERIAL PRIMARY KEY,
    DxFactorName VARCHAR(255) NOT NULL,
    DxFactorDescription TEXT,
    FactorCategory VARCHAR(255),
    CharacteristicID INT,
    FOREIGN KEY (CharacteristicID) REFERENCES ContextualCharacteristic(CharacteristicID)
);

-- Insert ContextualCharacteristics data
INSERT INTO ContextualCharacteristic (CharacteristicName) VALUES
('Expectations', 'Expectations of the team and organization on the developer.'),
('Seniority', 'Seniority of the team members.'),
('Personal Interests', 'Personal interests of the team members.'),
('Company goals', 'Goals of the company.'),
('Company maturity', 'Maturity of the company.'),
('Frequency of problems', 'Frequency of problems encountered.'),
('Presence of problems', 'Presence of problems in the codebase.');

-- Insert DXFactors data
INSERT INTO DXFactors (DxFactorName, DxFactorDescription, FactorCategory, CharacteristicID) VALUES
('Codebase Health', 'Indicates the quality of the code that is been written and how easy it is to write new code or give it support.', 'Development and Release', 7),
('Development Environment', 'The tools and setup used for development work.', 'Development and Release', 6),
('Automated Testing', 'The extent to which testing is automated to ensure code quality.', 'Development and Release', 7),
('Frictionless Release', 'Ease and smoothness of the release process.', 'Development and Release', 6),
('Clear goals, scope, requirements', 'Well-defined project goals, scope, and requirements.', 'Product Management', 4),
('Working iteratively (small WIPs)', 'Using iterative development with small work-in-progress limits.', 'Product Management', 4),
('Unreasonable deadlines', 'Deadlines that are difficult or impossible to meet.', 'Product Management', 1),
('Having a say on roadmaps/priorities', 'Ability for team members to influence project priorities and roadmaps.', 'Product Management', 5),
('Providing value to the business', 'Ensuring the work done is valuable to the business.', 'Product Management', 4),
('Supportiveness', 'The level of support provided by the team and organization.', 'Collaboration and culture', 2),
('Knowledge sharing', 'The extent to which knowledge is shared within the team.', 'Collaboration and culture', 2),
('Feeling connected', 'Feeling of being connected with the team and organization.', 'Collaboration and culture', 3),
('Code review process', 'The effectiveness and efficiency of the code review process.', 'Collaboration and culture', 6),
('Collaboration between departments', 'The level of collaboration between different departments.', 'Collaboration and culture', 6),
('Psychological safety', 'Feeling safe to take risks and be vulnerable in the team.', 'Collaboration and culture', 1),
('Communication', 'The effectiveness of communication within the team and organization.', 'Collaboration and culture', 6),
('Having aligned values', 'Alignment of personal and organizational values.', 'Collaboration and culture', 3),
('Getting recognition', 'Receiving recognition for the work done.', 'Collaboration and culture', 2),
('Autonomy', 'The level of autonomy in the work.', 'Developer flow and fulfillment', 3),
('Challenging/stimulating work', 'The extent to which work is challenging and stimulating.', 'Developer flow and fulfillment', 3),
('Making progress without obstacles', 'Ability to make progress without encountering obstacles.', 'Developer flow and fulfillment', 7),
('Uninterrupted time', 'The amount of uninterrupted time available for focused work.', 'Developer flow and fulfillment', 6),
('Work-life balance', 'The balance between work and personal life.', 'Developer flow and fulfillment', 1),
('Learning', 'Opportunities for learning and professional growth.', 'Developer flow and fulfillment', 2),
('Stability of job and team', 'The stability of the job and team.', 'Developer flow and fulfillment', 5),
('Clear paths for career growth', 'Well-defined career growth paths.', 'Developer flow and fulfillment', 4);
