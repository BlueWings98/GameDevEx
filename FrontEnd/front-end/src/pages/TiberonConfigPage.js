import React, { useEffect } from 'react';
import initializeGame from '../config/initializeGame';
const TiberonConfigPage = () => {
    useEffect(() => {
        const game = initializeGame();
        game.scene.start('TiberonConfig');
    }, []);

    return <div id="phaser-container" />;
};

export default TiberonConfigPage;