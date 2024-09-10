import Phaser from 'phaser';
const backgroundDir = '../assets/background/';
const spritesDir = '../assets/sprites/';
const backendUrl = 'http://localhost:8080/';
const width = 1690;
const height = 835;
const imageHeight = 1887;
const imageWidth = 1889;
let textObject1;
let textObject2;
let textObject3;
const textPerPage = 50; // Maximum number of characters per page
let projectName = "Provexpress SAS";
let projectId = 0;
let projectKey = "";
let totalPages = 0;
let tiberonJsonResponse = {};
let totoloJsonResponse = {};

class Report extends Phaser.Scene {
    constructor() {
        super({ key: 'Report' });
    }
    init(data){
        this.projectId = data.projectID;
        projectName = data.projectName;
        projectKey = data.projectKey;
    }
    preload() {
        this.load.image('barn', `${backgroundDir}CampoVainlla.png`);
        this.load.spritesheet("chickens", `${spritesDir}chickens/Chickens.png`, { frameWidth: imageWidth, frameHeight: imageHeight });
    }
    create() {
        this.barn = this.add.image(width / 2, height / 2, 'barn');
        this.barn.displayWidth = width;
        this.barn.displayHeight = height;
        this.generateVisualReport();
        this.returnToHenButton();
        this.goToTiberonConfigButton();
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

        getReportsByHttp(this.projectId, projectKey).then(() => {
            const tiberonReport = `Code Smells Totales: ${307}
                Problemas altos o críticos: ${2}
                Minutos humanos de deuda tecnica: ${1899}
                Consecuencia mas probable: ${"brain-overload"}
                Valoración: ${tiberonJsonResponse.TiberonScore.toFixed(2)}%`;
            const selfReport = `Desarrollo y lanzamiento: ${totoloJsonResponse.developmentAndRelease.toFixed(2)}%
                Administración del producto: ${totoloJsonResponse.productManagement.toFixed(2)}%
                Colaboración y cultura: ${totoloJsonResponse.collaborationAndCulture.toFixed(2)}%
                Flujo del desarrollo y Realización: ${totoloJsonResponse.developerFlowAndFulfillment.toFixed(2)}%
                Valoración: ${totoloJsonResponse.finalScore.toFixed(2)}%`;
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
            this.updateCharacterState(tiberonJsonResponse.TiberonScore.toFixed(2), totoloJsonResponse.finalScore.toFixed(2))
        });
        // Crear un objeto de texto en la pantalla
        console.log("Project Name: ", projectName);
        textObject3 = this.add.text(this.chickens.x- 200, this.chickens.y- 330, projectName, {
            font: '50px Arial',
            fill: 'Black',
            wordWrap: { width: width - 20, useAdvancedWrap: true }
        });

    }

    generateVisualReport() {
        this.chickens = this.add.sprite(width / 2, height / 2, 'chickens');
        this.chickens.displayWidth = imageWidth/3;
        this.chickens.displayHeight = imageHeight/3;
    }
    updateCharacterState(tiberonScore, totoloScore) {
        // Project health is the average of the two scores
        let projectHealth = (parseFloat(tiberonScore) + parseFloat(totoloScore)) / 2;
        console.log("Project Health: ", projectHealth);
    
        // Calculate projectHealth as an integer between 0 and 4
        let healthIndex = Math.floor(projectHealth / 20);
        console.log("Project Health after the /20: ", healthIndex);
    
        // Invert the health index (0 -> 4, 1 -> 3, 2 stays the same, 3 -> 1, 4 -> 0)
        let invertedStatus = 4 - healthIndex;
    
        // Ensure the value is within the valid range (0 to 4)
        let chickenStatus = Phaser.Math.Clamp(invertedStatus, 0, 4);
    
        // Set the frame of the sprite based on the inverted status
        this.chickens.setFrame(chickenStatus);
        console.log("Project Health: ", projectHealth, "Inverted Chicken Status: ", chickenStatus, "Tiberon Score: ", tiberonScore, "Totolo Score: ", totoloScore);
    }
    
    goToTiberonConfigButton() {
        // Dimensiones y posición de la caja
        const boxWidth = 200;
        const boxHeight = 100;
        const boxX =  width - boxWidth;
        const boxY = (height / 2) - (boxHeight / 2) - 200;
    
        // Crear la caja amarilla
        this.tiberonBox = this.add.rectangle(boxX, boxY, boxWidth, boxHeight, 0xD2691E);
        this.tiberonBox.setOrigin(0.5); // Establecer el origen en el centro
    
        // Crear el texto sobre la caja
        this.tiberonButton = this.add.text(boxX, boxY, 'Config', {
            fill: '#FFD700',
            fontSize: '50px',
            fontStyle: 'bold'
        });
        this.tiberonButton.setOrigin(0.5); // Centrar el texto
    
        // Hacer la caja interactiva
        this.tiberonBox.setInteractive();
    
        // Definir los colores para los estados
        const normalColor = 0xD2691E;
        const pressedColor = 0xA0522D; // Color ligeramente más oscuro
    
        // Cambiar el color al presionar el botón
        this.tiberonBox.on('pointerdown', () => {
            this.tiberonBox.setFillStyle(pressedColor);
        });
    
        // Restaurar el color original al soltar el botón o mover el cursor fuera de la caja
        this.tiberonBox.on('pointerup', () => {
            this.tiberonBox.setFillStyle(normalColor);
            this.scene.start('TiberonConfig'); // Ejecuta la acción del botón
        });
    
        this.tiberonBox.on('pointerout', () => {
            this.tiberonBox.setFillStyle(normalColor);
        });
    }
    returnToHenButton() {
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
async function getReportsByHttp(projectID, projectKey){
    console.log("Project ID: ", projectID, "Project Key: ", projectKey);
    try {
        const tiberonResponse = await fetch(`${backendUrl}sonarcloud/score?projectName=${projectKey}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!tiberonResponse.ok) {
            throw new Error(`HTTP error! Status: ${tiberonResponse.status}`);
        }
        const totoloResponse = await fetch(`${backendUrl}project/subjective-evaluation?projectID=${projectID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!totoloResponse.ok) {
            throw new Error(`HTTP error! Status: ${totoloResponse.status}`);
        }

        tiberonJsonResponse = await tiberonResponse.json();
        console.log("Tiberon Response: ", tiberonJsonResponse);
        totoloJsonResponse = await totoloResponse.json();
        console.log("Totolo Response: ", totoloJsonResponse);
        console.log("Subjective Final Score: ", totoloJsonResponse.finalScore, "Tiberon Final Score: ", tiberonJsonResponse.TiberonScore);



        // Add the items to the inventory or handle the response as needed
    } catch (error) {
        console.error('Error fetching inventory:', error);
    }
}
export default Report;