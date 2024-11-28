import Phaser from 'phaser'
import Survey from '../scenes/Survey'
import Rewards from '../scenes/Rewards'
import Report from '../scenes/Report'
import Hen from '../scenes/Hen'
import Home from '../scenes/Home'
import Inventory from '../scenes/Inventory'
import TiberonConfig from '../scenes/TiberonConfig'
import Login from '../scenes/Login'
import FullReport from '../scenes/FullReport'

let game;

const initializeGame = () => {
  if (!game) {
    const config = {
      type: Phaser.AUTO,
      parent: 'phaser-container',
      width: 1690,
      height: 835,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 100 },
          debug: false,
        }
      },
      scene: [Login, Home, Rewards, Survey, Report, Hen, Inventory, TiberonConfig, FullReport],
    };
    game = new Phaser.Game(config);
  }
  return game;
};

export default initializeGame;