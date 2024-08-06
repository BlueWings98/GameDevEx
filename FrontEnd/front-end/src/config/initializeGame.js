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
      width: 1690,
      height: 835,
      scene: [Rewards, Survey, Report],
    };
    game = new Phaser.Game(config);
  }
  return game;
};

export default initializeGame;