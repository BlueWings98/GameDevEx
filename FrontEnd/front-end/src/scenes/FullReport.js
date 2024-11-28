import Phaser from "phaser";

const width = 1690;
const height = 835;
const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080/';
const backgroundDir = '../assets/background/';

let textObject2;
let projectID = 0;
let displayedText = "Este reporte es grande y se puede demorar en cargar, por favor espere un momento.";

class FullReport extends Phaser.Scene {
    constructor() {
        super({ key: 'FullReport' });
    }

    init(data){
        projectID = data.projectID;
        console.log("data: ", data);
    }

    preload() {
        this.load.image('background', `${backgroundDir}CasillaDeTexto.png`);
    }

    create() {
        this.background = this.add.image(width / 2, height / 2, 'background');
        this.background.displayWidth = width;
        this.background.displayHeight = height;
        this.createUnWritableTextBox(120, 120, width-200, height);
        this.createReturnX(1600, 50);

        // Fetch the full report after showing the initial text
        this.loadFullReport();
    }

    createUnWritableTextBox(x, y, width, height) {
        // Show the initial text
        textObject2 = this.add.text(x, y + 20, displayedText, {
            font: '21px Arial',
            fill: 'Black',
            wordWrap: { width: width, useAdvancedWrap: true }
        });
    }

    // Fetch the full report and update the text once it's received
    async loadFullReport() {
        const report = await getFullReportByHttp(projectID);
        if (report) {
            // Update the text object with the report content
            textObject2.setText(report);
        } else {
            // If something went wrong, show an error message
            textObject2.setText("Hubo un error al cargar el reporte.");
        }
    }

    // I need an X that when it is clicked it returns to the previous scene
    createReturnX(x, y) {
        const returnX = this.add.text(x, y, 'X', {
            font: '70px Arial',
            fill: 'Red',
        });
        returnX.setInteractive();
        returnX.on('pointerdown', () => {
            this.scene.start('Hen', { projectID: projectID });
        });
        returnX.on('pointerover', () => {
            returnX.setStyle({ fill: 'Orange' });
        });
        returnX.on('pointerout', () => {
            returnX.setStyle({ fill: 'Red' });
        });
    }
}

async function getFullReportByHttp(projectID) {
    try {
        const response = await fetch(`${backendUrl}report?ProjectId=${projectID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();
        console.log("Full report before cleanup: ", data.response);

        // Remove all '#' and '*' characters from the response
        let cleanedResponse = data.response.replace(/[#*]/g, '');
        console.log("Full report after cleanup: ", cleanedResponse);

        return cleanedResponse;
    } catch (error) {
        console.error('Error fetching full report:', error);
        return null;
    }
}

export default FullReport;
