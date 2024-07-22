import React from "react";
import Phaser from "phaser";
import GameComponent from "../components/GameComponent";

const spritesDir = '../assets/sprites/morpeko/';
const backgroundDir = '../assets/background/';

class Survey extends Phaser.Scene {
    preload() {
      
        this.load.image('barn', `${backgroundDir}barn.png`);
        this.load.image('A1base', `${spritesDir}A1/A1-base.png`);
        this.load.image('A2base', `${spritesDir}A2/A2-base.png`);
      }
    

    create() {
        const { width, height } = this.scale;
        this.barn = this.add.image(width / 2, height / 2, 'barn');
        this.barn.displayWidth = width;
        this.barn.displayHeight = height;
        this.A1base = this.add.image(width/2, height-180, 'A1base').setScale(0.2);
    }
    update(){
        //this.A1base.x += 1;
    }
}
    const SurveyPage = () => {
        const config = {
            type: Phaser.AUTO,
            parent: 'phaser-container',
            width: window.innerWidth,
            height: window.innerHeight,
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