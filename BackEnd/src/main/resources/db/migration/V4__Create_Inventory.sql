-- Create the GameItem table
CREATE TABLE GameItem (
    gameitemid INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    sprite VARCHAR(255),
    description TEXT,
    category VARCHAR(50),
    rarity VARCHAR(50),
    isunique BOOLEAN NOT NULL,
    PRIMARY KEY (gameitemid)
);

-- Insert values into GameItem table
INSERT INTO GameItem (gameitemid, name, sprite, description, category, rarity, isunique) VALUES
(0, 'Oran', 'Oran.png', 'Dulce, especial para jalea.', 'Comida', 'Común', FALSE),
(1, 'Zidra', 'Zidra.png', 'Ácida, va bien con el arroz.', 'Comida', 'Común', FALSE),
(2, 'Ziruela', 'Ziruela.png', 'Deliciosa fruta verde con semillas jugosas.', 'Comida', 'Común', FALSE),
(3, 'Skin Azul', 'SkinAzul.png', 'Una skin azul para tu personaje.', 'Skin', 'Raro', TRUE),
(4, 'Skin Rosada', 'SkinRosada.png', 'Una skin rosada para tu personaje.', 'Skin', 'Raro', TRUE),
(5, 'Skin Verde', 'SkinVerde.png', 'Una skin verde para tu personaje.', 'Skin', 'Raro', TRUE),
(6, 'Minijuego Snake', 'MinijuegoSnake.png', 'Desbloquea el minijuego Snake.', 'Minijuego', 'Epico', TRUE),
(7, 'Gallo de Diamante', 'GalloDiamante.png', 'El premio mas gordo de todos. Lo lograste.', 'Jackpot', 'Legendario', TRUE);

CREATE TABLE PlayerInventory (
    userid INT NOT NULL,
    gameitemid INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (userid, gameitemid),
    CONSTRAINT fk_user
        FOREIGN KEY (userid)
        REFERENCES Users(userid)
        ON DELETE CASCADE,
    CONSTRAINT fk_gameitem
        FOREIGN KEY (gameitemid)
        REFERENCES GameItem(gameitemid)
        ON DELETE CASCADE
);

-- Insert one of every item into Buster's inventory
INSERT INTO PlayerInventory (userid, gameitemid, quantity) VALUES
(1, 0, 1),
(1, 1, 1),
(1, 2, 1),
(1, 3, 1),
(1, 4, 1),
(1, 5, 1),
(1, 6, 1),
(1, 7, 1);
