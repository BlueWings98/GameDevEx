CREATE TABLE barrierresponse (
    barrierresponseid SERIAL PRIMARY KEY,
    barrierid INTEGER NOT NULL,
    responsevalue INTEGER NOT NULL,
    responsedate DATE NOT NULL);

ALTER TABLE barrierresponse
ADD CONSTRAINT fk_barriertoimprovementid
FOREIGN KEY (barriertoimprovementid) REFERENCES barriertoimprovement(barriertoimprovementid);