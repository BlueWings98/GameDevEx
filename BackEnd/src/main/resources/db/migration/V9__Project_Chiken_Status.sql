-- Add a new column called projectStatus to the PROJECT table
-- This will reflect the status of the project and the displayed chicken.
ALTER TABLE PROJECT
ADD COLUMN ProjectStatus INT;
-- Fill the projectStatus column with the default value of 2
UPDATE PROJECT
SET ProjectStatus = 2;