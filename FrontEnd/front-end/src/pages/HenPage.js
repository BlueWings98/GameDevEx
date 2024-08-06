import React, { useEffect } from 'react';
import initializeGame from '../config/initializeGame';

const HenPage = () =>{
    useEffect(() => {
        const game = initializeGame();
        game.scene.start('Hen');
    }, []);
    return <div id = "phaser-container"/>
};
export default HenPage;