import Phaser from "phaser";

const backgroundDir = '../assets/background/';
const width = window.innerWidth;
const height = window.innerHeight;
const rewards = [
    {
        GameItemId: "1",
        Sprite: "Oran.png",
        Description: "Dulce, especial para jalea.",
        Categoria: "Comida",
        Rareza: "Común",
        IsUnique: false
    },
    {
        GameItemId: "2",
        Sprite: "Zidra.png",
        Description: "Ácida, va bien con el arroz.",
        Categoria: "Comida",
        Rareza: "Común",
        IsUnique: false
    },
    {
        GameItemId: "3",
        Sprite: "Ziruela.png",
        Description: "Deliciosa fruta verde con semillas jugosas.",
        Categoria: "Comida",
        Rareza: "Común",
        IsUnique: false
    }
];
var inventory = [];

class Rewards extends Phaser.Scene {
    constructor() {
        super({key :'Rewards'});
    }
    preload() {
        this.load.image('saucer', `${backgroundDir}GoldSaucer.png`);
    }
    create() {
        this.saucer = this.add.image(width / 2, height / 2, 'saucer');
        this.saucer.displayWidth = width;
        this.saucer.displayHeight = height;
        this.createPullsButton();
        this.returnToSurveyButton();
    }
    createPullsButton() {
        // Dimensiones y posición de la caja
        const boxWidth = 200;
        const boxHeight = 100;
        const boxX = (width / 2) - (boxWidth / 2);
        const boxY = (height / 2) - (boxHeight / 2);

        // Crear la caja naranja
        this.pullsBox = this.add.rectangle(boxX, boxY, boxWidth, boxHeight, 0xFFA500);
        this.pullsBox.setOrigin(0); // Establecer el origen en la esquina superior izquierda

        // Crear el texto sobre la caja
        this.pullsButton = this.add.text(boxX + boxWidth / 2, boxY + boxHeight / 2, 'Pull', {
            fill: '#FFD700',
            fontSize: '50px',
            fontStyle: 'bold'
        });
        this.pullsButton.setOrigin(0.5); // Centrar el texto

        // Hacer la caja interactiva
        this.pullsBox.setInteractive();

        // Definir los colores para los estados
        const normalColor = 0xFFA500;
        const pressedColor = 0xFF8C00; // Color ligeramente más oscuro

        // Cambiar el color al presionar el botón
        this.pullsBox.on('pointerdown', () => {
            this.pullsBox.setFillStyle(pressedColor);
        });

        // Restaurar el color original al soltar el botón o mover el cursor fuera de la caja
        this.pullsBox.on('pointerup', () => {
            this.pullsBox.setFillStyle(normalColor);
            generateReward(); // Ejecuta la acción del botón
        });

        this.pullsBox.on('pointerout', () => {
            this.pullsBox.setFillStyle(normalColor);
        });
    }


    returnToSurveyButton() {
        // Dimensiones y posición de la caja
        const boxWidth = 200;
        const boxHeight = 100;
        const boxX = 200;
        const boxY = (height / 2) - (boxHeight / 2);
    
        // Crear la caja amarilla
        this.surveyBox = this.add.rectangle(boxX, boxY, boxWidth, boxHeight, 0xD2691E);
        this.surveyBox.setOrigin(0.5); // Establecer el origen en el centro
    
        // Crear el texto sobre la caja
        this.returnButton = this.add.text(boxX, boxY, 'Return', {
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
            this.scene.start('Survey'); // Ejecuta la acción del botón
        });
    
        this.surveyBox.on('pointerout', () => {
            this.surveyBox.setFillStyle(normalColor);
        });
    }
    
}
function generateReward() {
    const reward = sendHttpRequest();
    inventory.push(reward);
    console.log("Reward added to inventory: ", reward);
    console.log("Current inventory: ", inventory);
}
function sendHttpRequest() {
    const randomIndex = Math.floor(Math.random() * rewards.length);

    // Devolvemos la recompensa seleccionada aleatoriamente
    return rewards[randomIndex];
}
export default Rewards;