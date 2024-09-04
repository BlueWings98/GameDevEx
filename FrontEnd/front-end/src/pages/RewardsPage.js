import React, { useEffect } from 'react';
import initializeGame from '../config/initializeGame';

const RewardsPage = () =>{
    useEffect(() => {
        const game = initializeGame();
        game.scene.start('Rewards');
    }, []);
    return <div id = "phaser-container"/>
};
export default RewardsPage;