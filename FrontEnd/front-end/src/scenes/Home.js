import Phaser from 'phaser';
import Survey from './Survey';
const spritesDir = '../assets/sprites/morpeko/SpriteSheets/';
const backgroundDir = '../assets/background/';
const width = 1690;
const height = 835;
const imageHeight = 1390;
const imageWidth = 1417;
const textPerPage = 50; // Maximum number of characters per page

class Home extends Phaser.Scene {
    constructor() {
        super({ key: 'Home' });
    }
    preload() {
        this.load.image('barn', `${backgroundDir}CampoVainilla.png`);
        this.load.spritesheet("Alegre", `${spritesDir}A.png`, { frameWidth: imageWidth, frameHeight: imageHeight });
        this.load.spritesheet("Triste", `${spritesDir}T.png`, { frameWidth: imageWidth, frameHeight: imageHeight });
        this.load.spritesheet("Enojado", `${spritesDir}E.png`, { frameWidth: imageWidth, frameHeight: imageHeight });
        this.load.spritesheet("Neutral", `${spritesDir}N.png`, { frameWidth: imageWidth, frameHeight: imageHeight });
    }
    create(){
        this.barn = this.add.image(width / 2, height / 2, 'barn');
        this.barn.displayWidth = width;
        this.barn.displayHeight = height;
        let characterMood = this.getCharacterMood();
        this.createAndAddAnimations(characterMood);
        this.goToRewardsButton();
        this.goToReportsButton();
        this.openSurveyMenu();
    }
    createAndAddAnimations(characterMood) {
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

        // Add sprites and play corresponding animation based on characterMood
        switch (characterMood) {
            case 0:
                this.Alegre = this.add.sprite(width/1.5, height - floorHeight - 50, "Alegre");
                this.Alegre.setScale(0.3);
                this.Alegre.play("AnimAlegre");
                break;
            case 2:
                this.Triste = this.add.sprite(width/1.5, height - floorHeight - 50, "Triste");
                this.Triste.setScale(0.3);
                this.Triste.play("AnimTriste");
                break;
            case 3:
                this.Enojado = this.add.sprite(width/1.5, height - floorHeight - 50, "Enojado");
                this.Enojado.setScale(0.3);
                this.Enojado.play("AnimEnojado");
                break;
            default:
                this.Neutral = this.add.sprite(width/1.5, height - floorHeight - 50, "Neutral");
                this.Neutral.setScale(0.3);
                this.Neutral.play("AnimNeutral");
                break;
        }
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
            this.scene.launch('Survey');
        });
    }
    openInventory(){
        const boxWidth = 200;
        const boxHeight = 100;

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
    goToReportsButton() {
        // Dimensiones y posición de la caja
        const boxWidth = 200;
        const boxHeight = 100;
        const boxX = 200;
        const boxY = (height / 2) - (boxHeight / 2);

        // Crear la caja amarilla
        this.surveyBox = this.add.rectangle(boxX, boxY, boxWidth, boxHeight, 0xD2691E);
        this.surveyBox.setOrigin(0.5); // Establecer el origen en el centro

        // Crear el texto sobre la caja
        this.returnButton = this.add.text(boxX, boxY, 'Reports', {
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
            this.scene.start('Report'); // Ejecuta la acción del botón
        });

        this.surveyBox.on('pointerout', () => {
            this.surveyBox.setFillStyle(normalColor);
        });
    }
    getCharacterMood() {
        return 1;
    }
}
function sendHttpRequest(text) {
    return "Esto es lo que devolveria el servidor";
}
export default Home;