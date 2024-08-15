import Phaser from 'phaser'
import Survey from '../scenes/Survey'
import Rewards from '../scenes/Rewards'
import Report from '../scenes/Report'
import Hen from '../scenes/Hen'
import Home from '../scenes/Home'

let game;

const initializeGame = () => {
  if (!game) {
    const config = {
      type: Phaser.AUTO,
      parent: 'phaser-container',
      width: 1690,
      height: 835,
      scene: [Home, Rewards, Survey, Report, Hen],
    };
    game = new Phaser.Game(config);
  }
  return game;
};

export default initializeGame;