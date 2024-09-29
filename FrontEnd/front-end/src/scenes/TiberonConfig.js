import Phaser from "phaser";

const spritesDir = '../assets/sprites/';
const backgroundDir = '../assets/background/';
const backendUrl = 'http://localhost:8080/';
const width = 1690;
const height = 835;
class TiberonConfig extends Phaser.Scene {
    constructor() {
        super({ key: 'TiberonConfig' });
    }
    preload() {
        this.load.image('background', `${backgroundDir}CasillaDeTexto.png`);
        this.load.image('tiberon', `${spritesDir}tiberon/Tiberon.png`);
    }
    create() {
        this.background = this.add.image(width / 2, height / 2, 'background');
        this.background.displayWidth = width;
        this.background.displayHeight = height;
        this.tiberon = this.add.image(1500, 620, 'tiberon');
        this.tiberon.setScale(0.2);
        this.returnToReportsButton();
        this.displayCharacteristics(getCharaceristicsByHttp());
    }
    displayCharacteristics(characteristicsPromise) {
        const startX = 250;
        const startY = 100;
        const spacingY = 150;
        const spacingX = 400; // Espaciado entre columnas
        const maxPerColumn = 5;

        characteristicsPromise.then(characteristics => {
            console.log("Characteristics in the display: ", characteristics);

            characteristics.metrics.forEach((characteristic, index) => {
                const column = Math.floor(index / maxPerColumn); // Determina en qué columna estamos
                const row = index % maxPerColumn; // Determina en qué fila de la columna estamos

                const itemX = startX + (column * spacingX);
                const itemY = startY + (row * spacingY);

                // Mostrar el nombre de la característica
                this.add.text(itemX, itemY, characteristic.name, {
                    fill: '#000000',
                    fontSize: '25px',
                    fontStyle: 'bold'
                });


                // Mostrar el peso de la característica
                this.add.text(itemX, itemY + 30, `Peso: ${characteristic.weight}`, {
                    fill: '#000000',
                    fontSize: '25px',
                    fontStyle: 'bold'
                });
                // Mostrar si esta activada o no
                this.add.text(itemX, itemY + 60, "Activada", {
                    fill: '#00913f',
                    fontSize: '25px',
                    fontStyle: 'bold'
                });
            });
        }).catch(error => {
            console.error("Error displaying characteristics: ", error);
        });
    }



    returnToReportsButton() {
        // Dimensiones y posición de la caja
        const boxWidth = 200;
        const boxHeight = 100;
        const boxX = 150;
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
        this.surveyBox.on('pointerover', () => {
            this.surveyBox.setScale(1.1);
        });
        this.surveyBox.on('pointerout', () => {
            this.surveyBox.setScale(1.0);
        });
    }

}
async function getCharaceristicsByHttp() {
    // Definir el arreglo de características basado en los datos SQL proporcionados
    let characteristics = [];
    try {
        // Send HTTP GET request with userID in the query string
        const response = await fetch(`${backendUrl}sonarcloud/metrics/report`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        characteristics = await response.json();

        console.log("Metrics: ", characteristics);
        // Add the items to the inventory
    } catch (error) {
        console.error('Error fetching inventory:', error);
    }

    return characteristics;
}
// Función para actualizar el JSON
function updateJson(characteristicsData) {
    const jsonData = JSON.stringify(characteristicsData, null, 2);
    console.log(jsonData);
    // Aquí podrías hacer algo con el JSON, como enviarlo a un servidor o guardarlo localmente
}
export default TiberonConfig;