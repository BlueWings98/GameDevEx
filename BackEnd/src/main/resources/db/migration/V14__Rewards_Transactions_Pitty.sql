CREATE TABLE rewards_log (
    transactionid SERIAL PRIMARY KEY,  -- Unique ID for the transaction
    userid INT NOT NULL,               -- Foreign key to Users table
    gameitemid INT NOT NULL,             -- Foreign key to Rewards table
    pulls_without_legendary INT NOT NULL, -- Number of pulls without legendary
    reward_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Date and time of the reward
    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE,
    FOREIGN KEY (gameitemid) REFERENCES gameitem(gameitemid) ON DELETE CASCADE
);
