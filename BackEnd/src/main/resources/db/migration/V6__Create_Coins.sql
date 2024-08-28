-- Creating the money for the gacha.
INSERT INTO GameItem (gameitemid, name, sprite, description, category, rarity, isunique) VALUES
(8, 'Coin', 'Coin.png', 'Monedas, se convierten en otras recompenzas.', 'Dinero', 'Común', FALSE);

-- Inserting initial 10 coins into the inventory of the user.
INSERT INTO PlayerInventory (userid, gameitemid, quantity) VALUES
(1, 8, 10);