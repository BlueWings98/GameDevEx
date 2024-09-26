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
let TotoloID = 1;
let UserID = 1;
let ProjectID = 1;
let batteryIndicator;

let characterSkin = "Green";
let hunger = 1;

let batteryCharge = 100;

class Home extends Phaser.Scene {
    constructor() {
        super({ key: 'Home' });
    }
    init(data){
        ProjectID = data.projectID;
        UserID = data.userID;
        TotoloID = data.totoloID;
        characterSkin = data.characterSkin;
        
    }
    preload() {
        //Background
        this.load.image('barn', `${backgroundDir}CampoVainilla.png`);
        //Buttons
        this.load.image('Boton2', '../assets/sprites/buttons/Boton2.png');
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
                this.scene.launch('Survey', { userID: UserID, hunger: hunger, numberOfSurveys: 1, totoloID: TotoloID });
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
    
    openInventoryMenu() {
        const boxWidth = 400;
        const boxHeight = 200;
    
        // Replace the rectangle with the button image
        this.InventoryButton = this.add.image(width / 2, height / 1.2, 'Boton2'); // Use your button image
        this.InventoryButton.setDisplaySize(boxWidth, boxHeight); // Set the image size
        this.InventoryButton.setOrigin(0.5); // Center the image
    
        // Add text on top of the button
        this.InventoryText = this.add.text(width / 2, height / 1.2, 'Bag', {
            fill: '#FFD700',
            fontSize: '50px',
            fontStyle: 'bold'
        });
        this.InventoryText.setOrigin(0.5); // Center the text
    
        // Make the button interactive
        this.InventoryButton.setInteractive();
    
        // When the button is clicked, open the Inventory scene
        this.InventoryButton.on('pointerup', () => {
            this.scene.launch('Inventory', { userID: UserID, totoloID: TotoloID });
        });
    
        // Change the image size when hovering over the button
        this.InventoryButton.on('pointerover', () => {
            this.InventoryButton.setDisplaySize(boxWidth * 1.1, boxHeight * 1.1); // Increase size by 10%
        });
    
        // Restore the original size when the pointer leaves the button
        this.InventoryButton.on('pointerout', () => {
            this.InventoryButton.setDisplaySize(boxWidth, boxHeight); // Restore original size
        });
    }
    
    goToRewardsButton() {
        // Dimensions and position for the button
        const boxWidth = 400;
        const boxHeight = 200;
        const boxX = width - 200;
        const boxY = (height / 2) - (boxHeight / 2) + 100;
    
        // Load the button image
        this.rewardsBox = this.add.image(boxX, boxY, 'Boton2'); // Image instead of rectangle
        this.rewardsBox.setDisplaySize(boxWidth, boxHeight); // Set the image size
        this.rewardsBox.setOrigin(0.5); // Center the image origin
    
        // Add text on top of the button image
        this.returnButton = this.add.text(boxX, boxY, 'Rewards', {
            fill: '#FFD700',
            fontSize: '50px',
            fontStyle: 'bold'
        });
        this.returnButton.setOrigin(0.5); // Center the text
    
        // Make the button interactive
        this.rewardsBox.setInteractive();
    
        // Define the scale change for interaction
        this.rewardsBox.on('pointerdown', () => {
            this.rewardsBox.setScale(1.1); // Increase size on press
        });
    
        this.rewardsBox.on('pointerup', () => {
            this.rewardsBox.setDisplaySize(boxWidth, boxHeight); // Restore size on release
            this.scene.start('Rewards', { userID: UserID });
        });
    
        this.rewardsBox.on('pointerover', () => {
            this.rewardsBox.setDisplaySize(boxWidth * 1.1, boxHeight * 1.1); // Increase size on hover
        });
    
        this.rewardsBox.on('pointerout', () => {
            this.rewardsBox.setDisplaySize(boxWidth, boxHeight); // Restore size on exit
        });
    }
    
    goToHenButton() {
        // Dimensions and position for the button
        const boxWidth = 400;
        const boxHeight = 200;
        const boxX = 200;
        const boxY = (height / 2) - (boxHeight / 2) + 100;
    
        // Load the button image instead of the rectangle
        this.surveyBox = this.add.image(boxX, boxY, 'Boton2'); // Use your button image
        this.surveyBox.setDisplaySize(boxWidth, boxHeight); // Set the image size
        this.surveyBox.setOrigin(0.5); // Set origin to center
    
        // Add text on top of the image
        this.returnButton = this.add.text(boxX, boxY, 'Hen', {
            fill: '#FFD700',
            fontSize: '50px',
            fontStyle: 'bold'
        });
        this.returnButton.setOrigin(0.5); // Center the text
    
        // Make the button interactive
        this.surveyBox.setInteractive();
    
        // Define the colors for different states
        const normalColor = 0xD2691E;
        const pressedColor = 0xA0522D; // Slightly darker color
    
        // Change the image size when pressing the button
        this.surveyBox.on('pointerdown', () => {
            this.surveyBox.setDisplaySize(boxWidth * 1.1, boxHeight * 1.1); // Increase size by 10%
        });
    
        // Restore the original size and navigate to the 'Hen' scene when releasing the button
        this.surveyBox.on('pointerup', () => {
            this.surveyBox.setDisplaySize(boxWidth, boxHeight); // Restore size
            this.scene.start('Hen'); // Execute button action
        });
    
        // Increase the button size on hover using setDisplaySize
        this.surveyBox.on('pointerover', () => {
            this.surveyBox.setDisplaySize(boxWidth * 1.1, boxHeight * 1.1); // Increase size by 10%
        });
    
        // Restore the original button size when the pointer leaves the box
        this.surveyBox.on('pointerout', () => {
            this.surveyBox.setDisplaySize(boxWidth, boxHeight); // Restore original size
        });
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