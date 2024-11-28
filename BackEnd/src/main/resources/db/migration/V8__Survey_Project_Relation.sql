-- Add a column ProjectID to the SURVEY table and create a foreign key constraint to the PROJECT table
ALTER TABLE SURVEY
ADD COLUMN ProjectID INT,
ADD CONSTRAINT fk_project
FOREIGN KEY (ProjectID) REFERENCES PROJECT(ProjectID);
-- Fill the ProjectID column with the value 1
UPDATE SURVEY
SET ProjectID = 1;
