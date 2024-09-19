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
        this.openInventoryMenu();
        this.createBatteryIndicator();
    }
    createAndAddAnimations() {
        const floorHeight = 500;
        const fps = 0.2;
    
        // Create animations
        this.createCharacterAnimations(fps);
    
        // Get a Totolo from the server
        rechargeByHttp(TotoloID).then(Totolo => {
            this.Emocion = this.addCharacterByMood(Totolo.Hunger, floorHeight);
            hunger = Totolo.Hunger;
            batteryCharge = Totolo.Battery;
            characterSkin = Totolo.Skin;
    
            // Update UI elements
            this.updateBatteryIndicator();
            
            // Add interaction listeners to the sprite
            this.addInteractionListeners(this.Emocion);
        });
    }
    
    // Create animations for different emotions
    createCharacterAnimations(fps) {
        const emotions = ["Alegre", "Triste", "Enojado", "Neutral"];
        
        emotions.forEach(emotion => {
            this.anims.create({
                key: `Anim${emotion}`,
                frames: this.anims.generateFrameNumbers(emotion),
                frameRate: fps,
                repeat: -1
            });
        });
    }
    
    // Add character sprite based on their mood
    addCharacterByMood(hunger, floorHeight) {
        const moodMap = {
            0: { key: "Enojado", anim: "AnimEnojado" },
            1: { key: "Triste", anim: "AnimTriste" },
            3: { key: "Alegre", anim: "AnimAlegre" },
            default: { key: "Neutral", anim: "AnimNeutral" }
        };
    
        const mood = moodMap[hunger] || moodMap.default;
        const sprite = this.add.sprite(width / 1.5, height - floorHeight - 50, mood.key);
        sprite.setScale(0.3);
        sprite.play(mood.anim);
        
        return sprite;
    }
    
    // Add interaction listeners to the emotion sprite
    addInteractionListeners(sprite) {
        sprite.setInteractive();
        sprite.on('pointerup', () => {
            if (batteryCharge >= surveyBatteryCost) {
                batteryCharge -= surveyBatteryCost;
                this.scene.launch('Survey', { userID: userID, hunger: hunger, numberOfSurveys: 1, totoloID: TotoloID });
            } else {
                alert('No tengo suficiente energía hoy, ¿te parece si lo intentamos mañana?');
            }
        });
    
        sprite.on('pointerover', () => {
            sprite.setScale(0.32);
        });
    
        sprite.on('pointerout', () => {
            sprite.setScale(0.3);
        });
        console.log(sprite);
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

        this.InventoryButton.on('pointerup', () => {
            this.scene.launch('Inventory', { userID: userID, totoloID: TotoloID });
        });
        this.InventoryButton.on('pointerover', () => {
            this.InventoryButton.setFillStyle(pressedColor);
        });
        this.InventoryButton.on('pointerout', () => {
            this.InventoryButton.setFillStyle(normalColor);
        });

    }
    goToRewardsButton() {
        // Dimensiones y posición de la caja
        const boxWidth = 200;
        const boxHeight = 100;
        const boxX = width - 200;
        const boxY = (height / 2) - (boxHeight / 2);

        // Crear la caja amarilla
        this.rewardsBox = this.add.rectangle(boxX, boxY, boxWidth, boxHeight, 0xD2691E);
        this.rewardsBox.setOrigin(0.5); // Establecer el origen en el centro

        // Crear el texto sobre la caja
        this.returnButton = this.add.text(boxX, boxY, 'Rewards', {
            fill: '#FFD700',
            fontSize: '50px',
            fontStyle: 'bold'
        });
        this.returnButton.setOrigin(0.5); // Centrar el texto

        // Hacer la caja interactiva
        this.rewardsBox.setInteractive();

        // Definir los colores para los estados
        const normalColor = 0xD2691E;
        const pressedColor = 0xA0522D; // Color ligeramente más oscuro

        // Cambiar el color al presionar el botón
        this.rewardsBox.on('pointerdown', () => {
            this.rewardsBox.setFillStyle(pressedColor);
        });

        // Restaurar el color original al soltar el botón o mover el cursor fuera de la caja
        this.rewardsBox.on('pointerup', () => {
            this.rewardsBox.setFillStyle(normalColor);
            //this.scene.add
            this.scene.start('Rewards'); // Ejecuta la acción del botón
        });
        this.rewardsBox.on('pointerover', () => {
            this.rewardsBox.setScale(1.1);
        });

        this.rewardsBox.on('pointerout', () => {
            this.rewardsBox.setScale(1);
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

        this.surveyBox.on('pointerover', () => {
            this.surveyBox.setScale(1.1);
        });

        this.surveyBox.on('pointerout', () => {
            this.surveyBox.setScale(1);
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
            alert("Esta es la bateria de tu Totolo. Hacer actividades con el Totolo consume bateria, esta se recarga sola.");
        });
        batteryIndicator.on('pointerover', () => {
            batteryIndicator.setColor('Red');
        });
        batteryIndicator.on('pointerout', () => {
            batteryIndicator.setColor('Green');
        });
        this.battery.setInteractive();
        this.battery.on('pointerover', () => {
            this.battery.displayHeight = 420;
            this.battery.displayWidth = 420;
        });
        this.battery.on('pointerout', () => {
            this.battery.displayHeight = 400;
            this.battery.displayWidth = 400;
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