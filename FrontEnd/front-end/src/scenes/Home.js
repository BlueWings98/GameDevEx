import Phaser from 'phaser';
import Survey from './Survey';
const spritesDir = '../assets/sprites/morpeko/SpriteSheets/';
const backgroundDir = '../assets/background/';
const backendUrl = 'http://localhost:8080/';
const width = 1690;
const height = 835;
const imageHeight = 1390;
const imageWidth = 1417;
const textPerPage = 50; // Maximum number of characters per page
const surveyBatteryCost = 25;
const TotoloID = 1;
const userID = 1;
let batteryIndicator;

let characterSkin = "Green";
let hunger = 1;

let batteryCharge = 100;

class Home extends Phaser.Scene {
    constructor() {
        super({ key: 'Home' });
    }
    preload() {
        //Background
        this.load.image('barn', `${backgroundDir}CampoVainilla.png`);
        //Character sprites
        this.load.spritesheet("Alegre", `${spritesDir}/${characterSkin}/A.png`, { frameWidth: imageWidth, frameHeight: imageHeight });
        this.load.spritesheet("Triste", `${spritesDir}/${characterSkin}/T.png`, { frameWidth: imageWidth, frameHeight: imageHeight });
        this.load.spritesheet("Enojado", `${spritesDir}/${characterSkin}/E.png`, { frameWidth: imageWidth, frameHeight: imageHeight });
        this.load.spritesheet("Neutral", `${spritesDir}/${characterSkin}/N.png`, { frameWidth: imageWidth, frameHeight: imageHeight });
        //Battery indicator
        this.load.spritesheet('battery', '../assets/sprites/battery/Batteries.png', { frameWidth: imageWidth, frameHeight: imageHeight });


    }
    create(){
        this.barn = this.add.image(width / 2, height / 2, 'barn');
        this.barn.displayWidth = width;
        this.barn.displayHeight = height;
        this.createAndAddAnimations();
        this.goToRewardsButton();
        this.goToHenButton();
        this.openSurveyMenu();
        this.openInventoryMenu();
        this.createBatteryIndicator();
    }
    createAndAddAnimations() {
        const floorHeight = 500;
        const fps = 0.2;

        // Create animations
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

        // Get a Totolo from the server
        rechargeByHttp(TotoloID).then(Totolo => {
        // Add sprites and play corresponding animation based on characterMood
        switch (Totolo.Hunger) {
            case 0:
                this.Enojado = this.add.sprite(width/1.5, height - floorHeight - 50, "Enojado");
                this.Enojado.setScale(0.3);
                this.Enojado.play("AnimEnojado");
                break;
            case 1:
                this.Triste = this.add.sprite(width/1.5, height - floorHeight - 50, "Triste");
                this.Triste.setScale(0.3);
                this.Triste.play("AnimTriste");
                break;
            case 3:
                this.Alegre = this.add.sprite(width/1.5, height - floorHeight - 50, "Alegre");
                this.Alegre.setScale(0.3);
                this.Alegre.play("AnimAlegre");
                break;
            default:
                this.Neutral = this.add.sprite(width/1.5, height - floorHeight - 50, "Neutral");
                this.Neutral.setScale(0.3);
                this.Neutral.play("AnimNeutral");
                break;
        }
        hunger = Totolo.Hunger;
        batteryCharge = Totolo.Battery;
        this.updateBatteryIndicator();
        characterSkin = Totolo.Skin;

    });
    }
    openSurveyMenu() {
        const boxWidth = 200;
        const boxHeight = 100;

        this.SurveyButton = this.add.rectangle(width / 2, height / 1.5, boxWidth, boxHeight, 0x109010);
        this.SurveyButton.setOrigin(0.5);

        this.SurveyText = this.add.text(width / 2, height / 1.5, 'Go to Survey', {
            fill: '#FFD700',
            fontSize: '50px',
            fontStyle: 'bold'
        });
        this.SurveyText.setOrigin(0.5);

        this.SurveyButton.setInteractive();

        const normalColor = 0x109010;
        const pressedColor = 0x0a5c0a;

        this.SurveyButton.on('pointerdown', () => {
            this.SurveyButton.setFillStyle(pressedColor);
        });

        this.SurveyButton.on('pointerup', () => {
            this.SurveyButton.setFillStyle(normalColor);
            if(batteryCharge >= surveyBatteryCost){
                batteryCharge -= surveyBatteryCost;
                this.scene.launch('Survey', { userID: userID, hunger: hunger, numberOfSurveys: 1, totoloID : TotoloID });
            } else {
                alert('Not enough battery charge to access the survey');
            }
            
        });
    }
    openInventoryMenu(){
        const boxWidth = 200;
        const boxHeight = 100;

        this.InventoryButton = this.add.rectangle(width / 2, height / 1.2, boxWidth, boxHeight, 0xCD7F32);
        this.InventoryButton.setOrigin(0.5);

        this.InventoryText = this.add.text(width / 2, height / 1.2, 'Bag', {
            fill: '#FFD700',
            fontSize: '50px',
            fontStyle: 'bold'
        });
        this.InventoryText.setOrigin(0.5);

        this.InventoryButton.setInteractive();

        const normalColor = 0xCD7F32;
        const pressedColor = 0xE1C16E;

        this.InventoryButton.on('pointerdown', () => {
            this.InventoryButton.setFillStyle(pressedColor);
        });

        this.InventoryButton.on('pointerup', () => {
            this.InventoryButton.setFillStyle(normalColor);
            this.scene.launch('Inventory', { userID: userID, totoloID: TotoloID });
        });

    }
    goToRewardsButton() {
        // Dimensiones y posición de la caja
        const boxWidth = 200;
        const boxHeight = 100;
        const boxX = width - 200;
        const boxY = (height / 2) - (boxHeight / 2);

        // Crear la caja amarilla
        this.surveyBox = this.add.rectangle(boxX, boxY, boxWidth, boxHeight, 0xD2691E);
        this.surveyBox.setOrigin(0.5); // Establecer el origen en el centro

        // Crear el texto sobre la caja
        this.returnButton = this.add.text(boxX, boxY, 'Rewards', {
            fill: '#FFD700',
            fontSize: '50px',
            fontStyle: 'bold'
        });
        this.returnButton.setOrigin(0.5); // Centrar el texto

        // Hacer la caja interactiva
        this.surveyBox.setInteractive();

        // Definir los colores para los estados
        const normalColor = 0xD2691E;
        const pressedColor = 0xA0522D; // Color ligeramente más oscuro

        // Cambiar el color al presionar el botón
        this.surveyBox.on('pointerdown', () => {
            this.surveyBox.setFillStyle(pressedColor);
        });

        // Restaurar el color original al soltar el botón o mover el cursor fuera de la caja
        this.surveyBox.on('pointerup', () => {
            this.surveyBox.setFillStyle(normalColor);
            //this.scene.add
            this.scene.start('Rewards'); // Ejecuta la acción del botón
        });

        this.surveyBox.on('pointerout', () => {
            this.surveyBox.setFillStyle(normalColor);
        });
    }
    goToHenButton() {
        // Dimensiones y posición de la caja
        const boxWidth = 200;
        const boxHeight = 100;
        const boxX = 200;
        const boxY = (height / 2) - (boxHeight / 2);

        // Crear la caja amarilla
        this.surveyBox = this.add.rectangle(boxX, boxY, boxWidth, boxHeight, 0xD2691E);
        this.surveyBox.setOrigin(0.5); // Establecer el origen en el centro

        // Crear el texto sobre la caja
        this.returnButton = this.add.text(boxX, boxY, 'Hen', {
            fill: '#FFD700',
            fontSize: '50px',
            fontStyle: 'bold'
        });
        this.returnButton.setOrigin(0.5); // Centrar el texto

        // Hacer la caja interactiva
        this.surveyBox.setInteractive();

        // Definir los colores para los estados
        const normalColor = 0xD2691E;
        const pressedColor = 0xA0522D; // Color ligeramente más oscuro

        // Cambiar el color al presionar el botón
        this.surveyBox.on('pointerdown', () => {
            this.surveyBox.setFillStyle(pressedColor);
        });

        // Restaurar el color original al soltar el botón o mover el cursor fuera de la caja
        this.surveyBox.on('pointerup', () => {
            this.surveyBox.setFillStyle(normalColor);
            this.scene.start('Hen'); // Ejecuta la acción del botón
        });

        this.surveyBox.on('pointerout', () => {
            this.surveyBox.setFillStyle(normalColor);
        });
    }
    getCharacterSkin(){
        return "Green";
    }
    createBatteryIndicator() {
        this.battery = this.add.sprite(150, 150, 'battery');
        this.battery.displayHeight = 400;
        this.battery.displayWidth = 400;
        batteryIndicator = this.add.text(95, 140,  `%${batteryCharge}`, {
            font: '50px Arial',
            fill: 'Green'
        });
        batteryIndicator.setInteractive();
        batteryIndicator.on('pointerdown', () => {
            batteryCharge =+ 1;
        });
        this.updateBatteryIndicator(batteryIndicator);

    }
    updateBatteryIndicator() {
        // Clamp the battery charge between 0 and 100
        let batterySprite = Phaser.Math.Clamp(batteryCharge, 0, 100);
        
        // Calculate the corresponding frame (0 to 4)
        batterySprite = Phaser.Math.FloorTo(batterySprite / 25);
        
        // Invert the frame order
        const totalFrames = 5; // Assuming there are 5 frames (0 to 4)
        const invertedFrame = totalFrames - 1 - batterySprite;
        
        // Set the frame to the battery sprite
        this.battery.setFrame(invertedFrame);
        batteryIndicator.setText(`%${batteryCharge}`);
    }
}
async function getTotoloByHttp(TotoloID){
    let response;
    try {
        response = await fetch(`${backendUrl}totolo?TotoloID=${TotoloID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

    } catch (error) {
        console.error('Error fetching inventory:', error);
    }
    return await response.json();
}
async function rechargeByHttp(TotoloID){
    let response;
    try {
        response = await fetch(`${backendUrl}totolo/recharge?TotoloID=${TotoloID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

    } catch (error) {
        console.error('Error fetching inventory:', error);
    }
    return await response.json();
}
export default Home;