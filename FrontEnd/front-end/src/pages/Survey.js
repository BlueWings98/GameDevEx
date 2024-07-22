import React from "react";
import Phaser from "phaser";
import GameComponent from "../components/GameComponent";

const spritesDir = '../assets/sprites/morpeko/';

class Survey extends Phaser.Scene {
    preload() {
      
        this.load.image('sky', `https://labs.phaser.io/assets/skies/space3.png`);
        this.load.image('A1base', `${spritesDir}A1/A1-base.png`);
        this.load.image('A2base', `${spritesDir}A2/A2-base.png`);
      }
    

    create() {
        this.add.image(400, 300, 'sky');
        this.A1base = this.add.image(200, 200, 'A1base').setScale(0.2);
    }
    update(){
        //this.A1base.x += 1;
    }
}
    const SurveyPage = () => {
        const config = {
            type: Phaser.AUTO,
            parent: 'phaser-container',
            width: 800,
            height: 600,
            scene: Survey,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 1000 }
                }
            }
        };
    
        return (
            <div>
                <GameComponent config={config} />
            </div>
            
        )
    };
export default SurveyPage;