import React, { useEffect } from "react";
import Phaser from "phaser";

const GameComponent = ({config}) => {
    useEffect(() => {
        const game = new Phaser.Game(config);
        return () => game.destroy(true);
    }, [config]);
    return (
        <div>
            <div id="phaser-container"></div>
        </div>
    )
}
export default GameComponent;