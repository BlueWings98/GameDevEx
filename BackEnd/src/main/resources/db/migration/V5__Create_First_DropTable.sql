-- Create the DropTable
CREATE TABLE droptable (
    droptableid INT,
    gameitemid INT,
    rarity VARCHAR(50),
    droprate DOUBLE PRECISION,
    PRIMARY KEY (droptableid, gameitemid),
    CONSTRAINT fk_gameitem
        FOREIGN KEY (gameitemid)
        REFERENCES GameItem(gameitemid)
        ON DELETE CASCADE
);

-- Insert data into DropTable
INSERT INTO droptable (droptableid, gameitemid,  rarity, droprate) VALUES
(1, 0, 'Común', 0.295),  -- Oran
(1, 1, 'Común', 0.295),  -- Zidra
(1, 2, 'Común', 0.295),  -- Ziruela
(1, 3, 'Raro', 0.07),    -- Skin Azul
(1, 4, 'Raro', 0.07),    -- Skin Rosada
(1, 5, 'Raro', 0.07),    -- Skin Verde
(1, 6, 'Epico', 0.03),   -- Minijuego Snake
(1, 7, 'Legendario', 0.01); -- Gallo de Diamante