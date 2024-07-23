import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin'
import Phaser from 'phaser'
import SurveyPage from '../pages/Survey'

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-container',
    width: window.innerWidth,
    height: window.innerHeight,
    scene: SurveyPage,
	dom: {
        createContainer: true
    },
	plugins: {
		scene: [
			{
				key: 'rexUI',
				plugin: RexUIPlugin,
				mapping: 'rexUI'
			}
		]
    }
}

const gameConfig = new Phaser.Game(config) 
export default gameConfig;