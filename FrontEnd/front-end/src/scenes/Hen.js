import Phaser from "phaser";

const width = 1690;
const height = 835;
const imageHeight = 1887;
const imageWidth = 1889;
const backendUrl = 'http://localhost:8080/';

let projectId = 0;

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
        const modularCategories = ["Acompanantes", "Cerca", "Fondo", "Gallinero", "Huevos", "Placa"];
        const spritesDir = '../assets/sprites/';
        const henDir = '../assets/background/Gallinero/';

        // Cargar spritesheet para las gallinas
        this.load.spritesheet("chickens", `${spritesDir}/chickens/Chickens.png`, { frameWidth: imageWidth, frameHeight: imageHeight });

        // Obtener los estados del proyecto (esto puede ser asíncrono en un caso real)
        getProjectStatuses(1);

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
        this.returnToSurveyButton();
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
    returnToSurveyButton() {
        // Dimensiones y posición de la caja
        const boxWidth = 200;
        const boxHeight = 100;
        const boxX =  width - boxWidth;
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
            this.scene.start('Report'); // Ejecuta la acción del botón
        });
    
        this.surveyBox.on('pointerout', () => {
            this.surveyBox.setFillStyle(normalColor);
        });
    }
}

function getProjectStatuses() {
    let response = httpRequest();
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
function calculateStatuses(){
    return {
        companionStatus: 0,
        fenceStatus: 1,
        backgroundStatus: 2,
        henStatus: 0,
        eggsStatus: 1,
        plateStatus: 2
    };
}

export default Hen;