import React, { useEffect } from 'react';
import initializeGame from '../config/initializeGame';
import Rewards from '../scenes/Rewards';

const RewardsPage = () =>{
    useEffect(() => {
        const game = initializeGame();
        game.scene.start('Rewards');
    }, []);
    return <div id = "phaser-container"/>
};
export default RewardsPage;