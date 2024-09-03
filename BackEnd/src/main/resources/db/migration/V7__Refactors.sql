-- Add a new column to store the foreign key
ALTER TABLE users
ADD COLUMN projectid INT;

-- Add the foreign key constraint to the users table
ALTER TABLE users
ADD CONSTRAINT fk_project
FOREIGN KEY (projectid) REFERENCES project(projectid);

-- Update the existing users and assign them to project number 1
UPDATE users
SET projectid = 1
WHERE userid = 1;

-- Add the new GPTResponse column to the Survey table
ALTER TABLE survey
ADD COLUMN gptresponse varchar(2000);

-- Update the existing surveys and assign them a GPTResponse
UPDATE survey
SET gptresponse = 'Como comparas tus valores personales con los de la empresa?'
WHERE surveyid = 1;

-- Adding two more projecs to the project table
INSERT INTO project (projectid, projectkey, projectname, projectdescription)
VALUES (2, 'DevExOrg_RestClient.Net', 'RestClient.Net', 'RestClient.Net is a powerful .NET REST API client that features task-based async, strong types, and dependency injection support for all platforms.'),
(3, 'DevExOrg_phaser', 'Phaser', 'Phaser is a fast, free, and fun open-source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers.');
