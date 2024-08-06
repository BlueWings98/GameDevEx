import React, { useEffect } from 'react';
import initializeGame from '../config/initializeGame';

const ReportPage = () =>{
    useEffect(() => {
        const game = initializeGame();
        game.scene.start('Report');
    }, []);
    return <div id = "phaser-container"/>
};
export default ReportPage;