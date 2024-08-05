import Phaser from "phaser";

const spritesDir = '../assets/sprites/morpeko/SpriteSheets/';
const backgroundDir = '../assets/background/';
const width = window.innerWidth;
const height = window.innerHeight;
const imageHeight = 1390;
const imageWidth = 1417;
const textPerPage = 50; // Maximum number of characters per page
var textObject;
var fullText = "This is a long text that will be displayed inside the orange textbox. It needs pagination if it doesn't fit entirely within the box.";
var displayedText = "";
var currentPage = 0;
var totalPages = 0;

class Survey extends Phaser.Scene {
    constructor() {
        super({ key: 'Survey' });
    }
    preload() {
        this.load.image('barn', `${backgroundDir}CampoCasilla.png`);
        this.load.spritesheet("Alegre", `${spritesDir}A.png`, { frameWidth: imageWidth, frameHeight: imageHeight });
        this.load.spritesheet("Triste", `${spritesDir}T.png`, { frameWidth: imageWidth, frameHeight: imageHeight });
        this.load.spritesheet("Enojado", `${spritesDir}E.png`, { frameWidth: imageWidth, frameHeight: imageHeight });
        this.load.spritesheet("Neutral", `${spritesDir}N.png`, { frameWidth: imageWidth, frameHeight: imageHeight });
    }


    create() {
        let characterMood = 1;
        this.barn = this.add.image(width / 2, height / 2, 'barn');
        this.barn.displayWidth = width;
        this.barn.displayHeight = height;
        characterMood = this.getCharacterMood();
        this.createAndAddAnimations(characterMood);
        this.createTextBox(0, 300, 1650, 400);
        this.goToRewardsButton();
    }
    update() {
        //this.A1base.x += 1;
    }
    getCharacterMood() {
        return 2;
    }
    createAndAddAnimations(characterMood) {
        const floorHeight = 500;
        const fps = 0.5;

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
                this.Alegre = this.add.sprite(width - 600, height - floorHeight - 50, "Alegre");
                this.Alegre.setScale(0.3);
                this.Alegre.play("AnimAlegre");
                break;
            case 2:
                this.Triste = this.add.sprite(width - 1000, height - floorHeight - 50, "Triste");
                this.Triste.setScale(0.3);
                this.Triste.play("AnimTriste");
                break;
            case 3:
                this.Enojado = this.add.sprite(width - 1700, height - floorHeight - 50, "Enojado");
                this.Enojado.setScale(0.3);
                this.Enojado.play("AnimEnojado");
                break;
            default:
                this.Neutral = this.add.sprite(width - 2100, height - floorHeight - 50, "Neutral");
                this.Neutral.setScale(0.3);
                this.Neutral.play("AnimNeutral");
                break;
        }
    }

    createTextBox(x, y, width, height) {
        const graphics = this.add.graphics();
        graphics.fillStyle(0xeabe63, 1); // Orange color
        graphics.fillRect(x, y, width, height);
        // Crear un objeto de texto en la pantalla
        textObject = this.add.text(x + 20, y + 20, 'testString', {
            font: '50px Arial',
            fill: 'Black',
            wordWrap: { width: width - 20, useAdvancedWrap: true }
        });
        // Calculate total pages based on text length
        totalPages = Math.ceil(fullText.length / textPerPage);
        console.log(totalPages);
        // Configurar el teclado para recibir entrada de texto
        this.input.keyboard.on('keydown', function (event) {
            // Si presionan la tecla "Backspace"
            if (event.key === 'Enter') {
                sendHttpRequest(fullText);
            } else if (event.key === 'Backspace' && fullText.length > 0) {
                fullText = fullText.slice(0, -1);
            } else if (event.key.length === 1) {
                // Añadir el carácter a la cadena
                fullText += event.key;
            } else if (event.key === 'ArrowRight' && currentPage < totalPages - 1) {
                currentPage++;
            } else if (event.key === 'ArrowLeft' && currentPage > 0) {
                currentPage--;
            }
            // Actualizar el texto en pantalla
            textObject.setText(displayedText);
            updateText();
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

}
function sendHttpRequest(text) {
    fullText = "Esto es lo que devolveria el servidor";
}
function updateText() {
    // Divide el texto completo en líneas
    const lines = fullText.split('\n');

    // Calcula el número de líneas disponibles y el número máximo de líneas a mostrar
    const linesAvailable = lines.length;
    const linesToShow = Math.min(4, linesAvailable);

    // Construye el texto a mostrar, uniendo las líneas necesarias con saltos de línea
    let displayedText = '';
    for (let i = 0; i < linesToShow; i++) {
        displayedText += lines[i] + '\n';
    }

    // Elimina el último salto de línea si existe
    displayedText = displayedText.trim();

    // Establece el texto en el objeto de texto
    textObject.setText(displayedText);
}
export default Survey;