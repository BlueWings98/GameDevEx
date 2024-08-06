import Phaser from 'phaser'
import Survey from '../scenes/Survey'
import Rewards from '../scenes/Rewards'
import Report from '../scenes/Report'

let game;

const initializeGame = () => {
  if (!game) {
    const config = {
      type: Phaser.AUTO,
      parent: 'phaser-container',
      width: window.innerWidth,
      height: window.innerHeight,
      scene: [Rewards, Survey, Report],
    };
    game = new Phaser.Game(config);
  }
  return game;
};

export default initializeGame;