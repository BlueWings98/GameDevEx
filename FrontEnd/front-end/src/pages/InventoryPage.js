import React, { useEffect } from 'react';
import initializeGame from '../config/initializeGame';

const InventoryPage = () =>{
    useEffect(() => {
        const game = initializeGame();
        game.scene.start('Inventory');
    }, []);
    return <div id = "phaser-container"/>
};
export default InventoryPage;