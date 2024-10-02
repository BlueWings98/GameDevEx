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
let sonarJsonResponse = {};

let userCountByProject = {};
let surveyCountByProject = {};

class Report extends Phaser.Scene {
    constructor() {
        super({ key: 'Report' });
    }
    init(data) {
        this.projectId = data.projectID;
        projectName = data.projectName;
        projectKey = data.projectKey;
    }
    preload() {
        this.load.image('barn', `${backgroundDir}CampoVainlla.png`);
        this.load.image('FlechaIzquierda', `${spritesDir}buttons/FlechaIzquierda.png`);
        this.load.image('Boton2', `${spritesDir}buttons/Boton2.png`);
        this.load.spritesheet("chickens", `${spritesDir}chickens/Chickens.png`, { frameWidth: imageWidth, frameHeight: imageHeight });
    }
    create() {
        this.barn = this.add.image(width / 2, height / 2, 'barn');
        this.barn.displayWidth = width;
        this.barn.displayHeight = height;
        this.generateVisualReport();
        this.returnToHenButton();
        this.goToTiberonConfigButton();
        this.goToFullReportButton();
        this.createTextBox(0, height - 400, width / 2, 400);

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
        projectNameBox.fillRect(this.chickens.x - 230, this.chickens.y - 350, 440, 100);

        getReportsByHttp(this.projectId, projectKey).then(() => {
            // Calculamos las dos etiquetas más frecuentes
            const tagCounts = Object.entries(sonarJsonResponse.tagCounts);
            tagCounts.sort((a, b) => b[1] - a[1]); // Ordenamos por el valor descendente
            const topTags = tagCounts.slice(0, 2); // Tomamos las dos etiquetas con mayor valor

            // Calculamos la calidad más relevante
            const softwareQualityCounts = sonarJsonResponse.softwareQualityCounts;
            const topQuality = Object.keys(softwareQualityCounts).reduce((a, b) =>
                softwareQualityCounts[a] > softwareQualityCounts[b] ? a : b);
            const topQualityValue = softwareQualityCounts[topQuality];

            // Generamos el reporte
            const tiberonReport = 
                `Problemas Bloqueantes: ${sonarJsonResponse.severityCounts.BLOCKER || 0}
                Problemas Críticos: ${sonarJsonResponse.severityCounts.CRITICAL || 0}
                Problemas Mayores: ${sonarJsonResponse.severityCounts.MAJOR || 0}
                Minutos humanos de deuda técnica: ${sonarJsonResponse.debtTotal}
                Etiqueta más frecuente: ${topTags[0][0]} (${topTags[0][1]})
                Calidad más relevante: ${topQuality} (${topQualityValue})
                Valoración: ${tiberonJsonResponse.TiberonScore.toFixed(2)}%`;


            const selfReport = 
                `Usuarios Registrados: ${userCountByProject.total}
                Encuestas Realizadas: ${surveyCountByProject.count}
                Desarrollo y lanzamiento: ${totoloJsonResponse.developmentAndRelease.toFixed(2)}%
                Administración del producto: ${totoloJsonResponse.productManagement.toFixed(2)}%
                Colaboración y cultura: ${totoloJsonResponse.collaborationAndCulture.toFixed(2)}%
                Flujo del desarrollo y Realización: ${totoloJsonResponse.developerFlowAndFulfillment.toFixed(2)}%
                Valoración: ${totoloJsonResponse.finalScore.toFixed(2)}%`;
            textObject1 = this.add.text(x + 20, y + 20, tiberonReport, {
                font: '38px Arial',
                fill: 'Black',
                fontStyle: 'bold',
                wordWrap: { width: width - 20, useAdvancedWrap: true }
            });
            textObject2 = this.add.text(width + 20, y + 20, selfReport, {
                font: '38px Arial',
                fill: 'Black',
                fontStyle: 'bold',
                wordWrap: { width: width - 20, useAdvancedWrap: true }
            });
            this.updateCharacterState(tiberonJsonResponse.TiberonScore.toFixed(2), totoloJsonResponse.finalScore.toFixed(2))
        });
        // Crear un objeto de texto en la pantalla
        console.log("Project Name: ", projectName);
        textObject3 = this.add.text(this.chickens.x - 200, this.chickens.y - 330, projectName, {
            font: '50px Arial',
            fill: 'Black',
            wordWrap: { width: width - 20, useAdvancedWrap: true }
        });

    }

    generateVisualReport() {
        this.chickens = this.add.sprite(width / 2, height / 2, 'chickens');
        this.chickens.displayWidth = imageWidth / 3;
        this.chickens.displayHeight = imageHeight / 3;
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

        //Update the project status in the backend
        updateProjectStatusByHttp(this.projectId, chickenStatus).then(() => {
            console.log("Project status updated successfully");
        });
    }

    goToTiberonConfigButton() {
        // Dimensions and position of the button
        const boxWidth = 400;
        const boxHeight = 200;
        const boxX = width - boxWidth + 180;
        const boxY = (height / 2) - (boxHeight / 2) - 200;

        // Replace the rectangle with the 'Boton2' button image
        this.tiberonBox = this.add.image(boxX, boxY, 'Boton2'); // Use the new image for the button
        this.tiberonBox.setDisplaySize(boxWidth, boxHeight); // Set the image size
        this.tiberonBox.setOrigin(0.5); // Set origin to center

        // Add text on top of the button (if needed)
        this.tiberonButton = this.add.text(boxX, boxY, 'Config', {
            fill: '#FFD700',
            fontSize: '50px',
            fontStyle: 'bold'
        });
        this.tiberonButton.setOrigin(0.5); // Center the text

        // Make the button interactive
        this.tiberonBox.setInteractive();

        // Handle button press (click)
        this.tiberonBox.on('pointerdown', () => {
            this.tiberonBox.setDisplaySize(boxWidth * 0.95, boxHeight * 0.95); // Slightly shrink on press
        });

        // Restore the size and navigate to the 'TiberonConfig' scene when releasing the button
        this.tiberonBox.on('pointerup', () => {
            this.tiberonBox.setDisplaySize(boxWidth, boxHeight); // Restore original size
            this.scene.start('TiberonConfig'); // Execute the button action
        });

        // Increase the button size on hover
        this.tiberonBox.on('pointerover', () => {
            this.tiberonBox.setDisplaySize(boxWidth * 1.1, boxHeight * 1.1); // Increase size by 10%
        });

        // Restore the original size when the pointer leaves the button
        this.tiberonBox.on('pointerout', () => {
            this.tiberonBox.setDisplaySize(boxWidth, boxHeight); // Restore original size
        });
    }
    goToFullReportButton() {
        // Dimensions and position of the button
        const boxWidth = 400;
        const boxHeight = 200;
        const boxX = width - boxWidth + 180;
        const boxY = (height / 2) - (boxHeight / 2);

        // Replace the rectangle with the 'Boton2' button image
        this.fullBox = this.add.image(boxX, boxY, 'Boton2'); // Use the new image for the button
        this.fullBox.setDisplaySize(boxWidth, boxHeight); // Set the image size
        this.fullBox.setOrigin(0.5); // Set origin to center

        // Add text on top of the button (if needed)
        this.fullButton = this.add.text(boxX, boxY, 'Full\nReport', {
            fill: '#FFD700',
            fontSize: '50px',
            fontStyle: 'bold'
        });
        this.fullButton.setOrigin(0.5); // Center the text

        // Make the button interactive
        this.fullBox.setInteractive();

        // Handle button press (click)
        this.fullBox.on('pointerdown', () => {
            this.tiberonBox.setDisplaySize(boxWidth * 0.95, boxHeight * 0.95); // Slightly shrink on press
        });

        // Restore the size and navigate to the 'TiberonConfig' scene when releasing the button
        this.fullBox.on('pointerup', () => {
            this.fullBox.setDisplaySize(boxWidth, boxHeight); // Restore original size
            console.log("Project ID: ", this.projectId);
            this.scene.start('FullReport', { projectID: this.projectId }); // Execute the button action
        });

        // Increase the button size on hover
        this.fullBox.on('pointerover', () => {
            this.fullBox.setDisplaySize(boxWidth * 1.1, boxHeight * 1.1); // Increase size by 10%
        });

        // Restore the original size when the pointer leaves the button
        this.fullBox.on('pointerout', () => {
            this.fullBox.setDisplaySize(boxWidth, boxHeight); // Restore original size
        });
    }

    returnToHenButton() {
        // Dimensions and position of the button
        const boxWidth = 400;
        const boxHeight = 200;
        const boxX = 200;
        const boxY = (height / 2) - (boxHeight / 2);

        // Replace the rectangle with the 'FlechaIzquierda' button image
        this.surveyBox = this.add.image(boxX, boxY, 'FlechaIzquierda'); // Use the new image for the button
        this.surveyBox.setDisplaySize(boxWidth, boxHeight); // Set the image size
        this.surveyBox.setOrigin(0.5); // Set origin to center

        // Add text on top of the button (if needed)
        this.returnButton = this.add.text(boxX, boxY, 'Hen', {
            fill: '#FFD700',
            fontSize: '50px',
            fontStyle: 'bold'
        });
        this.returnButton.setOrigin(0.5); // Center the text

        // Make the button interactive
        this.surveyBox.setInteractive();

        // Handle button press (click)
        this.surveyBox.on('pointerdown', () => {
            this.surveyBox.setDisplaySize(boxWidth * 0.95, boxHeight * 0.95); // Slightly shrink on press
        });

        // Restore the size and navigate to the 'Hen' scene when releasing the button
        this.surveyBox.on('pointerup', () => {
            this.surveyBox.setDisplaySize(boxWidth, boxHeight); // Restore original size
            this.scene.start('Hen'); // Execute the button action
        });

        // Increase the button size on hover
        this.surveyBox.on('pointerover', () => {
            this.surveyBox.setDisplaySize(boxWidth * 1.1, boxHeight * 1.1); // Increase size by 10%
        });

        // Restore the original size when the pointer leaves the button
        this.surveyBox.on('pointerout', () => {
            this.surveyBox.setDisplaySize(boxWidth, boxHeight); // Restore original size
        });
    }

}
async function updateProjectStatusByHttp(projectID, projectStatus) {
    try {
        const response = await fetch(`${backendUrl}project/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectID: projectID,
                projectStatus: projectStatus
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

    } catch (error) {
        console.error('Error fetching inventory:', error);
    }

}
async function getReportsByHttp(projectID, projectKey) {
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
        //sonarcloud/analysis?projectKey=DevExOrg_torchchat
        const sonarResponse = await fetch(`${backendUrl}sonarcloud/analysis?projectKey=${projectKey}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!sonarResponse.ok) {
            throw new Error(`HTTP error! Status: ${sonarResponse.status}`);
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

        // Get User count by http
        const userCountResponse = await fetch(`${backendUrl}users/total/byprojectid?projectID=${projectID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // Get Survey count by http
        const surveyCountResponse = await fetch(`${backendUrl}survey/count/byprojectid?projectID=${projectID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        tiberonJsonResponse = await tiberonResponse.json();
        sonarJsonResponse = await sonarResponse.json();
        totoloJsonResponse = await totoloResponse.json();
        userCountByProject = await userCountResponse.json();
        surveyCountByProject = await surveyCountResponse.json();

        console.log("Users Count: ", userCountByProject.total);
        console.log("Survey Count: ", surveyCountByProject.count);

    } catch (error) {
        console.error('Error fetching inventory:', error);
    }
}
export default Report;