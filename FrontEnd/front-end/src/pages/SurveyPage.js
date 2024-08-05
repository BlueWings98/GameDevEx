import React, { useEffect } from 'react';
import initializeGame from '../config/initializeGame';
import Survey from '../scenes/Survey';
const SurveyPage = () => {
    useEffect(() => {
        const game = initializeGame();
        game.scene.start('Survey');
    }, []);

    return <div id="phaser-container" />;
};

export default SurveyPage;