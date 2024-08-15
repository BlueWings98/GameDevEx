import Phaser from "phaser";

const spritesDir = '../assets/sprites/morpeko/SpriteSheets/';
const backgroundDir = '../assets/background/';
const width = 1690;
const height = 835;
const imageHeight = 1390;
const imageWidth = 1417;
const textPerPage = 50; // Maximum number of characters per page
let textObject1;
let textObject2;
let writtenText = "This is a long text that will be displayed inside the orange textbox. It needs pagination if it doesn't fit entirely within the box.";
let displayedUserText = "";
let displayedGeneratedText = "";
let generatedText = "";
let currentPage = 0;
let totalPages = 0;

class Survey extends Phaser.Scene {
    constructor() {
        super({ key: 'Survey' });
    }
    preload() {
        this.load.image('barn', `${backgroundDir}CampoVainilla.png`);
        this.load.spritesheet("Alegre", `${spritesDir}A.png`, { frameWidth: imageWidth, frameHeight: imageHeight });
        this.load.spritesheet("Triste", `${spritesDir}T.png`, { frameWidth: imageWidth, frameHeight: imageHeight });
        this.load.spritesheet("Enojado", `${spritesDir}E.png`, { frameWidth: imageWidth, frameHeight: imageHeight });
        this.load.spritesheet("Neutral", `${spritesDir}N.png`, { frameWidth: imageWidth, frameHeight: imageHeight });
    }


    create() {
        this.barn = this.add.image(width / 2, height / 2, 'barn');
        this.barn.displayWidth = width;
        this.barn.displayHeight = height;
        let characterMood = this.getCharacterMood();
        this.createAndAddAnimations(characterMood);
        this.createWritableTextBox(0, height - 400, width / 2, 400);
        this.createUnWritableTextBox(0, height - 400, width / 2, 400);
        this.goToRewardsButton();
        this.goToReportsButton();
    }
    getCharacterMood() {
        return 1;
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

    createWritableTextBox(x, y, width, height) {
        const textBox1 = this.add.graphics();
        textBox1.fillStyle(0xeabe63, 1); // Orange color
        textBox1.fillRect(x, y, width, height);
    
        textObject1 = this.add.text(x + 20, y + 20, displayedUserText, {
            font: '50px Arial',
            fill: 'Black',
            wordWrap: { width: width - 20, useAdvancedWrap: true }
        });
    
        this.input.keyboard.on('keydown', function (event) {
            if (event.key === 'Enter') {
                generatedText = sendHttpRequest(writtenText);
                writtenText = "";
            } else if (event.key === 'Backspace' && writtenText.length > 0) {
                writtenText = writtenText.slice(0, -1);
            } else if (event.key.length === 1) {
                writtenText += event.key;
            } else if (event.key === 'ArrowRight' && currentPage < totalPages - 1) {
                currentPage++;
            } else if (event.key === 'ArrowLeft' && currentPage > 0) {
                currentPage--;
            }
            updateText();
        });

    }
    createUnWritableTextBox(x, y, width, height) {
        const textBox2 = this.add.graphics();
        textBox2.fillStyle(0xeabe63, 1); // Orange color
        textBox2.fillRect(width, y, width, height);
    
        textObject2 = this.add.text(width + 20, y + 20, displayedGeneratedText, {
            font: '50px Arial',
            fill: 'Black',
            wordWrap: { width: width - 20, useAdvancedWrap: true }
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

}
function sendHttpRequest(text) {
    return "Esto es lo que devolveria el servidor";
}
function updateText() {
    // Divide el texto completo en líneas para el cuadro de texto escribible
    const linesWritable = writtenText.split('\n');
    const linesAvailableWritable = linesWritable.length;
    const linesToShowWritable = Math.min(4, linesAvailableWritable);

    displayedUserText = "";
    for (let i = 0; i < linesToShowWritable; i++) {
        displayedUserText += linesWritable[i] + '\n';
    }
    displayedUserText = displayedUserText.trim();
    textObject1.setText(displayedUserText);

    // Divide el texto completo en líneas para el cuadro de texto no escribible
    const linesUnWritable = generatedText.split('\n');
    console.log(linesUnWritable);
    const linesAvailableUnWritable = linesUnWritable.length;
    const linesToShowUnWritable = Math.min(4, linesAvailableUnWritable);
    console.log(linesToShowUnWritable);

    displayedGeneratedText = "";
    for (let i = 0; i < linesToShowUnWritable; i++) {
        displayedGeneratedText += linesUnWritable[i] + '\n';
    }
    displayedGeneratedText = displayedGeneratedText.trim();
    textObject2.setText(displayedGeneratedText);
}
export default Survey;