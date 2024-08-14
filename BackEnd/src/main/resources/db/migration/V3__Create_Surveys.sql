CREATE TABLE USERS (
    UserID SERIAL PRIMARY KEY,
    UserName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Password VARCHAR(100) NOT NULL
);

CREATE TABLE SURVEY (
    SurveyID SERIAL PRIMARY KEY,
    UserID INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES USERS(UserID),
    UserResponse TEXT,
    DXFactorName VARCHAR(100) NOT NULL,
    DxFactorID INT NOT NULL,
    FOREIGN KEY (DxFactorID) REFERENCES DXFactor(DxFactorID),
    DXFactorValue INT NOT NULL,
    SurveyDate DATE NOT NULL
);

INSERT INTO USERS (UserName, Email, Password) VALUES
('Buster', 'buster@hotmail.com', '1234');