import React, { useEffect } from "react";
import initializeGame from "../config/initializeGame";

const LoginPage = () => {
    useEffect(() => {
        const game = initializeGame();
        game.scene.start("Login");
    }, []);

    return <div id="phaser-container" />;
};

export default LoginPage;