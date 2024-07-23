import React from "react";
import Phaser from "phaser";
import GameComponent from "../components/GameComponent";

const spritesDir = '../assets/sprites/morpeko/SpriteSheets/';
const backgroundDir = '../assets/background/';
const width= window.innerWidth;
const height= window.innerHeight;
const imageHeight = 1390;
const imageWidth = 1417;

class Survey extends Phaser.Scene {
    preload() {
        this.load.image('barn', `${backgroundDir}CampoCasilla.png`);
        this.load.spritesheet("Alegre", `${spritesDir}A.png`, { frameWidth: imageWidth, frameHeight: imageHeight });
        this.load.spritesheet("Triste", `${spritesDir}T.png`, { frameWidth: imageWidth, frameHeight: imageHeight });
        this.load.spritesheet("Enojado", `${spritesDir}E.png`, { frameWidth: imageWidth, frameHeight: imageHeight });
        this.load.spritesheet("Neutral", `${spritesDir}N.png`, { frameWidth: imageWidth, frameHeight: imageHeight });
      }
    

    create() {
        this.barn = this.add.image(width / 2, height / 2, 'barn');
        this.barn.displayWidth = width;
        this.barn.displayHeight = height;
        this.addSprites();
        this.createAnimations();
    }
    update(){
        //this.A1base.x += 1;
    }
    createAnimations(){
        const fps = 0.5;
        let test = this.anims.generateFrameNumbers("Alegre");
        console.log(test);
        this.anims.create({
            key: "AnimAlegre",
            frames: this.anims.generateFrameNumbers("Alegre"),
            frameRate: fps,
            repeat: -1
        });
        this.anims.create({
            key: "AnimTriste",
            frames: this.anims.generateFrameNumbers("Triste"),
            frameRate: fps,
            repeat: -1
        });
        this.anims.create({
            key: "AnimEnojado",
            frames: this.anims.generateFrameNumbers("Enojado"),
            frameRate: fps,
            repeat: -1
        });
        this.anims.create({
            key: "AnimNeutral",
            frames: this.anims.generateFrameNumbers("Neutral"),
            frameRate: fps,
            repeat: -1
        });

        this.Alegre.play("AnimAlegre");
        this.Triste.play("AnimTriste");
        this.Enojado.play("AnimEnojado");
        this.Neutral.play("AnimNeutral");
    }
    addSprites(){
        const floorHeight = 500;

        this.Alegre = this.add.sprite(width-600, height-floorHeight-50, "Alegre");
        this.Alegre.setScale(0.3);
        this.Triste = this.add.sprite(width-1000, height-floorHeight-50, "Triste");
        this.Triste.setScale(0.3);
        this.Enojado = this.add.sprite(width-1700, height-floorHeight-50, "Enojado");
        this.Enojado.setScale(0.3);
        this.Neutral = this.add.sprite(width-2100, height-floorHeight-50, "Neutral");
        this.Neutral.setScale(0.3);
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