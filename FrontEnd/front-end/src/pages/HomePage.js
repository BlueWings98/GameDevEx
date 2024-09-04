import React, { useEffect } from 'react';
import initializeGame from '../config/initializeGame';

const HomePage = () =>{
    useEffect(() => {
        const game = initializeGame();
        game.scene.start('Home');
    }, []);
    return <div id = "phaser-container"/>
};
export default HomePage;