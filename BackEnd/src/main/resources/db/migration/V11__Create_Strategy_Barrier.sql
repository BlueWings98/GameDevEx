CREATE TABLE barriertoimprovement (
    barriertoimprovementid SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE strategy (
    strategyid SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    isteamstrategy BOOLEAN
);

INSERT INTO barriertoimprovement (name, description)
VALUES
    ('Low prioritization', 'The improvement of DX factors is not a priority within the organization.'),
    ('Inability to quantify problems', 'It is difficult to measure or quantify the problems affecting developer experience.'),
    ('Lack of visibility/awareness', 'There is a lack of awareness or visibility regarding the issues impacting developer experience.'),
    ('Lack of buy-in', 'Stakeholders are not convinced or do not fully support the initiatives to improve developer experience.'),
    ('Lack of ownership', 'No clear individual or group is responsible for addressing DX problems.'),
    ('Undefined expectations', 'The expectations regarding developer performance or outcomes are not clearly defined.'),
    ('Lack of incentives', 'There are no incentives for developers to improve their workflow or resolve issues.'),
    ('Unclear process', 'The process to address developer experience problems is unclear.'),
    ('No viable solutions', 'No effective solutions are currently available to address the problems.'),
    ('Organizational politics', 'Political struggles or conflicts within the organization hinder the improvement of DX factors.');

INSERT INTO strategy (name, description, isteamstrategy)
VALUES
    ('Job crafting', 'Personalize your work to fit personal interests and strengths.', false),
    ('Taking risks', 'Be willing to take risks to improve DX factors.', false),
    ('Speaking up', 'Communicate problems and suggest improvements.', false),
    ('Local improvement', 'Focus on making small, local improvements in your own environment.', false),
    ('Workarounds', 'Find and use workarounds for unresolved problems.', false),
    ('Mimicking success', 'Adopt successful practices from other teams or projects.', false),
    ('Being pragmatic', 'Take practical and realistic approaches to solve problems.', false),
    ('Building bridges', 'Foster communication and collaboration between different teams or departments.', true),
    ('Creating transparency', 'Make processes and issues more visible to the entire organization.', true),
    ('Convincing others', 'Encourage others to support improvements in developer experience.', true),
    ('Making incremental changes', 'Focus on small, gradual improvements over time.', true),
    ('Metrics and measurements', 'Use data and metrics to track and justify improvements.', true),
    ('Having a driver', 'Ensure that someone is responsible for driving change.', true),
    ('Involving experts', 'Bring in experts to help with improvements.', true);
