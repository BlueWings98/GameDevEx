import Phaser from 'phaser'
import Survey from '../scenes/Survey'
import Rewards from '../scenes/Rewards'

let game;

const initializeGame = () => {
  if (!game) {
    const config = {
      type: Phaser.AUTO,
      parent: 'phaser-container',
      width: window.innerWidth,
      height: window.innerHeight,
      scene: [Rewards, Survey],
    };
    game = new Phaser.Game(config);
  }
  return game;
};

export default initializeGame;