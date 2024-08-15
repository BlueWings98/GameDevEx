import Phaser from 'phaser';
const backgroundDir = '../assets/background/';
const spritesDir = '../assets/sprites/';
const width = 1690;
const height = 835;
const imageHeight = 1887;
const imageWidth = 1889;
let textObject1;
let textObject2;
let textObject3;
let projectHealth = 2;
const textPerPage = 50; // Maximum number of characters per page
let companyName = "Provexpress SAS";
let desarrolloLanzamiento = 80;
let administracionProducto = 80;
let colaboracionCultura = 80;
let flujoDesarrolloRealizacion = 80;
let codeSmells = 308;
let problemasCriticos = 3;
let minutosDeudaTecnica = 1890;
let consecuenciaMasProbable = "brain-overload";
let valoracion = 50;
const tiberonReport = `Code Smells Totales: ${codeSmells}
Problemas altos o críticos: ${problemasCriticos}
Minutos humanos de deuda tecnica: ${minutosDeudaTecnica}
Consecuencia mas probable: ${consecuenciaMasProbable}
Valoración: ${valoracion}%`;
const selfReport = `Desarrollo y lanzamiento: ${desarrolloLanzamiento}%
Administración del producto: ${administracionProducto}%
Colaboración y cultura: ${colaboracionCultura}%
Flujo del desarrollo y Realización: ${flujoDesarrolloRealizacion}%`;
let totalPages = 0;

class Report extends Phaser.Scene {
    constructor() {
        super({ key: 'Report' });
    }
    preload() {
        this.load.image('barn', `${backgroundDir}CampoVainlla.png`);
        this.load.spritesheet("chickens", `${spritesDir}/chickens/Chickens.png`, { frameWidth: imageWidth, frameHeight: imageHeight });
    }
    create() {
        this.barn = this.add.image(width / 2, height / 2, 'barn');
        this.barn.displayWidth = width;
        this.barn.displayHeight = height;
        this.generateVisualReport();
        this.returnToHomeButton();
        this.goToHenButton();
        this.createTextBox(0, height-400, width / 2, 400);
    }
    createTextBox(x, y, width, height) {
        const textBox1 = this.add.graphics();
        const textBox2 = this.add.graphics();
        const projectNameBox = this.add.graphics();
        textBox1.fillStyle(0xeabe63, 1); // Orange color
        textBox2.fillStyle(0xeabe63, 1); // Orange color
        projectNameBox.fillStyle(0xab6516, 1); // Brown color
        textBox1.fillRect(x, y, width, height);
        textBox2.fillRect(width, y, width, height);
        projectNameBox.fillRect(this.chickens.x- 230, this.chickens.y- 350, 440, 100);
        // Crear un objeto de texto en la pantalla
        textObject1 = this.add.text(x + 20, y + 20, tiberonReport, {
            font: '50px Arial',
            fill: 'Black',
            wordWrap: { width: width - 20, useAdvancedWrap: true }
        });
        textObject2 = this.add.text(width + 20, y + 20, selfReport, {
            font: '50px Arial',
            fill: 'Black',
            wordWrap: { width: width - 20, useAdvancedWrap: true }
        });
        textObject3 = this.add.text(this.chickens.x- 200, this.chickens.y- 330, companyName, {
            font: '50px Arial',
            fill: 'Black',
            wordWrap: { width: width - 20, useAdvancedWrap: true }
        });
        // Calculate total pages based on text length
        totalPages = Math.ceil(tiberonReport.length / textPerPage);

    }

    generateVisualReport() {
        this.chickens = this.add.sprite(width / 2, height / 2, 'chickens');
        this.chickens.displayWidth = imageWidth/3;
        this.chickens.displayHeight = imageHeight/3;
        this.updateCharacterState();
    }
    updateCharacterState() {
        // Asegurarse de que el valor esté en el rango adecuado
        projectHealth = Phaser.Math.Clamp(projectHealth, 0, 4);

        // Cambiar el frame del sprite basado en projectHealth
        this.chickens.setFrame(projectHealth);
    }
    returnToHomeButton() {
        // Dimensiones y posición de la caja
        const boxWidth = 200;
        const boxHeight = 100;
        const boxX =  width - boxWidth;
        const boxY = (height / 2) - (boxHeight / 2);
    
        // Crear la caja amarilla
        this.homeBox = this.add.rectangle(boxX, boxY, boxWidth, boxHeight, 0xD2691E);
        this.homeBox.setOrigin(0.5); // Establecer el origen en el centro
    
        // Crear el texto sobre la caja
        this.returnButton = this.add.text(boxX, boxY, 'Return', {
            fill: '#FFD700',
            fontSize: '50px',
            fontStyle: 'bold'
        });
        this.returnButton.setOrigin(0.5); // Centrar el texto
    
        // Hacer la caja interactiva
        this.homeBox.setInteractive();
    
        // Definir los colores para los estados
        const normalColor = 0xD2691E;
        const pressedColor = 0xA0522D; // Color ligeramente más oscuro
    
        // Cambiar el color al presionar el botón
        this.homeBox.on('pointerdown', () => {
            this.homeBox.setFillStyle(pressedColor);
        });
    
        // Restaurar el color original al soltar el botón o mover el cursor fuera de la caja
        this.homeBox.on('pointerup', () => {
            this.homeBox.setFillStyle(normalColor);
            this.scene.start('Home'); // Ejecuta la acción del botón
        });
    
        this.homeBox.on('pointerout', () => {
            this.homeBox.setFillStyle(normalColor);
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
}
function sendHttpRequest(text) {
    //tiberonReport = "Esto es lo que devolveria el servidor";
}
export default Report;