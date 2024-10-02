import Phaser from "phaser";

const width = 1690;
const height = 835;
const imageHeight = 1887;
const imageWidth = 1889;
const startingX = 580;
const startingY = 410;
const spacingX = 220; // Horizontal spacing between images
const spacingY = 220; // Vertical spacing between rows
const backendUrl = 'http://localhost:8080/';
const spritesDir = '../assets/sprites/';
const modularCategories = ["Acompanantes", "Cerca", "Fondo", "Gallinero", "Huevos", "Placa"];
const henDir = '../assets/background/Gallinero/';

let totalUsers = 0;
let totalSurveys = 0;

let statuses = {
    acompanantesStatus: 2,
    cercaStatus: 2,
    fondoStatus: 2,
    gallineroStatus: 2,
    huevosStatus: 2,
    placaStatus: 2
};

class Hen extends Phaser.Scene {
    constructor() {
        super({ key: 'Hen' });
    }

    preload() {

        // Cargar spritesheet para las gallinas
        this.load.spritesheet("chickens", `${spritesDir}chickens/Chickens.png`, { frameWidth: imageWidth, frameHeight: imageHeight });

        // Obtener los estados del proyecto (esto puede ser asíncrono en un caso real)
        getProjectStatuses();

        this.load.image('FlechaDerecha', `${spritesDir}buttons/FlechaDerecha.png`);

        // Pre-cargar las imágenes para las categorías modulares basadas en su estado
        this.preloadScene(modularCategories, henDir);
    }

    create() {

        // Crear y configurar las imágenes
        this.createImage('Fondo', width, height);
        this.createImage('Cerca', width, height);
        this.createImage('Gallinero', width, height);
        this.createImage('Acompanantes', width, height);
        this.createImage('Placa', width, height);
        this.createImage('Huevos', width, height);
        this.createProjectChikens();
        this.createCompanyName();
        this.returnToHomeButton();
        this.getTotals();
    }
    getTotals(){
        const users = getTotalUsersByHttp();
        const x = 35;
        const y = 50;
        users.then(users => {
            totalUsers = users;
            this.add.text(x, y, `Total Users: ${totalUsers}`, {
                fill: '#000000',
                fontSize: '30px Arial',
                fontStyle: 'bold'
            });
        });
        const surveys = getTotalSurveysByHttp();
        surveys.then(surveys => {
            totalSurveys = surveys;
            this.add.text(x, y+x, `Total Surveys: ${totalSurveys}`, {
                fill: '#000000',
                fontSize: '30px Arial',
                fontStyle: 'bold'
            });
        });

    }

    createProjectChikens() {
        const projects = getProjectsByHttp();
        projects.then(projects => {
            console.log("Projects: ", projects);

            projects.forEach((project, index) => {
                const column = index % 3; // Column number (0, 1, or 2)
                const row = Math.floor(index / 3); // Row number (0 or 1)

                const itemX = startingX + (column * spacingX);
                const itemY = startingY + (row * spacingY);

                // Crear la imagen del proyecto (gallina)
                const chicken = this.add.sprite(itemX, itemY, 'chickens');
                chicken.setScale(0.09);
                let projectHealth = project.projectStatus;
                projectHealth = Phaser.Math.Clamp(projectHealth, 0, 4);
                chicken.setFrame(projectHealth);

                // Mostrar el nombre del proyecto debajo de la imagen
                this.add.text(itemX - 60, itemY + 75, project.projectName, {
                    fill: '#000000',
                    fontSize: '20px',
                    fontStyle: 'bold'
                });
                // Make the chicken image interactive
                chicken.setInteractive();
                chicken.on('pointerdown', () => {
                    // Switch to the ReportScene and pass the projectID
                    this.scene.start('Report', { projectID: project.projectID, projectName: project.projectName , projectKey: project.projectKey});
                });
                chicken.on('pointerover', () => {
                    // Scale the chicken image when the cursor is over it
                    chicken.setScale(0.1);
                });
                chicken.on('pointerout', () => {
                    // Restore the original scale when the cursor is no longer over the image
                    chicken.setScale(0.09);
            });
            });
        });
    }
    createCompanyName() {
        this.add.text(570, 280, 'DevEx Corp', {
            fill: '#000000',
            fontSize: '40px',
            fontStyle: 'bold'
        });
    }

    preloadScene(modularCategories, henDir) {
        const statusIterator = getStatusIterator();
        modularCategories.forEach((categoryName) => {
            // Accedemos al valor correspondiente en el objeto statuses
            let status = statusIterator.next().value;
            let statusPath;

            switch (status) {
                case 0:
                    statusPath = 'Bueno.png';
                    break;
                case 1:
                    statusPath = 'Neutro.png';
                    break;
                case 2:
                    statusPath = 'Negativo.png';
                    break;
                default:
                    statusPath = 'Neutro.png';
                    break;
            }

            console.log(`${categoryName}`, `${henDir}${categoryName}/${statusPath}`);
            this.load.image(`${categoryName}`, `${henDir}${categoryName}/${statusPath}`);
        });
    }

    createImage(category, width, height) {
        let image = this.add.image(width / 2, height / 2, category);
        image.displayWidth = width;
        image.displayHeight = height;
    }
    returnToHomeButton() {
        // Dimensions and position of the button
        const boxWidth = 400;
        const boxHeight = 200;
        const boxX = width - boxWidth+150;
        const boxY = (height / 2) - (boxHeight / 2)+100;
    
        // Replace the rectangle with the 'FlechaDerecha' button image
        this.surveyBox = this.add.image(boxX, boxY, 'FlechaDerecha'); // Use the new image for the button
        this.surveyBox.setDisplaySize(boxWidth, boxHeight); // Set the image size
        this.surveyBox.setOrigin(0.5); // Set origin to center
    
        // Add text on top of the button (if needed)
        this.returnButton = this.add.text(boxX, boxY, 'Return', {
            fill: '#FFD700',
            fontSize: '50px',
            fontStyle: 'bold'
        });
        this.returnButton.setOrigin(0.5); // Center the text
    
        // Make the button interactive
        this.surveyBox.setInteractive();
    
        // Define colors for different states (only relevant if you want to add color effects on text)
        const normalColor = 0xD2691E;
        const pressedColor = 0xA0522D; // Slightly darker color
    
        // Handle button press (click)
        this.surveyBox.on('pointerdown', () => {
            this.surveyBox.setDisplaySize(boxWidth * 0.95, boxHeight * 0.95); // Slightly shrink on press
        });
    
        // Restore the size and navigate to the 'Home' scene when releasing the button
        this.surveyBox.on('pointerup', () => {
            this.surveyBox.setDisplaySize(boxWidth, boxHeight); // Restore original size
            this.scene.start('Home'); // Execute the button action
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

function getProjectStatuses() {
    let response = calculateStatuses();
    statuses.acompanantesStatus = response.companionStatus;
    statuses.cercaStatus = response.fenceStatus;
    statuses.fondoStatus = response.backgroundStatus;
    statuses.gallineroStatus = response.henStatus;
    statuses.huevosStatus = response.eggsStatus;
    statuses.placaStatus = response.plateStatus;
}
function* getStatusIterator() {
    for (let X of Object.values(statuses)) {
        yield X;
    }
}
//GET http://localhost:8080/users/total
async function getTotalUsersByHttp() {
    let totalUsers = 0;
    try {
        const response = await fetch(`${backendUrl}users/total`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        totalUsers = await response.json();

    } catch (error) {
        console.error('Error fetching inventory:', error);
    }

    return totalUsers.total;
}
//GET http://localhost:8080/survey/count
async function getTotalSurveysByHttp() {
    let totalSurveys = 0;
    try {
        const response = await fetch(`${backendUrl}survey/count`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        totalSurveys = await response.json();

    } catch (error) {
        console.error('Error fetching inventory:', error);
    }

    return totalSurveys.count;
}

async function getProjectsByHttp() {
    // Definir el arreglo de características basado en los datos SQL proporcionados
    let projects = [];
    try {
        // Send HTTP GET request with userID in the query string
        const response = await fetch(`${backendUrl}project/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        projects = await response.json();

        console.log("Projects: ", projects);
        // Add the items to the inventory
    } catch (error) {
        console.error('Error fetching inventory:', error);
    }

    return projects;

}
function calculateStatuses() {
    return {
        companionStatus: 0,
        fenceStatus: 0,
        backgroundStatus: 0,
        henStatus: 0,
        eggsStatus: 0,
        plateStatus: 0
    };
}

export default Hen;