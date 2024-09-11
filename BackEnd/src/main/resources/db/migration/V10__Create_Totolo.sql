-- Create table for Totolo
CREATE TABLE totolo (
    totoloid SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    skin VARCHAR(255) NOT NULL,
    hunger INT NOT NULL,
    battery INT NOT NULL,
    lastlogin DATE
);

-- Insert default entry
INSERT INTO totolo (name, skin, hunger, battery, lastlogin)
VALUES ('Totolo', 'Base', 0, 100, CURRENT_DATE);

-- Insert TotoloId into the users table
ALTER TABLE users
ADD COLUMN totoloid INT,
ADD CONSTRAINT fk_totolo
FOREIGN KEY (totoloid) REFERENCES totolo(totoloid);

UPDATE users
SET totoloid = 1;