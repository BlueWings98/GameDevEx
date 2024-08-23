import Phaser from "phaser";

const spritesDir = '../assets/sprites/';
const backgroundDir = '../assets/background/';
const width = 1690;
const height = 835;
const imageHeight = 1887;
const imageWidth = 1889;
class TiberonConfig extends Phaser.Scene {
    constructor() {
        super({ key: 'TiberonConfig' });
    }
    preload() {
        this.load.image('background', `${backgroundDir}CampoVainilla.png`);
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
    displayCharacteristics(characteristics) {
        const startX = 250;
        const startY = 100;
        const spacingY = 150;
        const spacingX = 400; // Espaciado entre columnas
        const maxPerColumn = 5;
    
        characteristics.forEach((characteristic, index) => {
            const column = Math.floor(index / maxPerColumn); // Determina en qué columna estamos
            const row = index % maxPerColumn; // Determina en qué fila de la columna estamos
    
            const itemX = startX + (column * spacingX);
            const itemY = startY + (row * spacingY);
    
            // Mostrar el nombre de la característica
            const itemName = this.add.text(itemX, itemY, characteristic[1], {
                fill: '#FFFFFF',
                fontSize: '25px',
                fontStyle: 'bold'
            });
    
            // Mostrar si está activada o desactivada
            const isActive = true; // Puedes cambiarlo según tu lógica
            const statusText = isActive ? "Activado" : "Desactivado";
            const statusColor = isActive ? '#00FF00' : '#FF0000'; // Verde si activado, rojo si desactivado
    
            const itemStatus = this.add.text(itemX, itemY + 30, statusText, {
                fill: statusColor,
                fontSize: '25px',
                fontStyle: 'bold'
            });
    
            // Mostrar el peso de la característica
            const itemWeight = this.add.text(itemX, itemY + 60, `Peso: ${characteristic[6]}`, {
                fill: '#000000',
                fontSize: '25px',
                fontStyle: 'bold'
            });
    
            // Puedes guardar estos elementos para luego acceder a ellos si es necesario
            characteristic.domElements = {
                itemName,
                itemStatus,
                itemWeight
            };
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

        this.surveyBox.on('pointerout', () => {
            this.surveyBox.setFillStyle(normalColor);
        });
    }

}
function getCharaceristicsByHttp() {
    // Definir el arreglo de características basado en los datos SQL proporcionados
    const characteristics = [
        ['reliability_rating', 'Reliability Rating', 'Reliability rating', '2024-08-13', 'RATING', '1.0', '5.0', 100],
        ['security_rating', 'Security Rating', 'Security rating', '2024-08-13', 'RATING', '1.0', '5.0', 100],
        ['sqale_debt_ratio', 'Technical Debt Ratio', 'Ratio of the actual technical debt compared to the estimated cost to develop the whole source code from scratch', '2024-08-13', 'PERCENT', '0.0', '100.0', 100],
        ['sqale_rating', 'Maintainability Rating', 'A-to-E rating based on the technical debt ratio', '2024-08-13', 'RATING', '1.0', '5.0', 100],
        ['vulnerabilities', 'Vulnerabilities', 'Vulnerabilities', '2024-08-13', 'INT', '0', '1', 100],
        ['security_review_rating', 'Security Review Rating', 'Security Review Rating', '2024-08-13', 'RATING', '1.0', '5.0', 100],
        ['security_rating', 'Security Rating', 'Security Rating', '2024-08-13', 'RATING', '1.0', '5.0', 100],
        ['bugs', 'Bugs', 'Bugs', '2024-08-13', 'INT', '0', '1', 100],
        ['code_smells', 'Code Smells', 'Code Smells', '2024-08-13', 'INT', '0', '1', 100],
        ['reliability_remediation_effort', 'Reliability Remediation Effort', 'Reliability Remediation Effort', '2024-08-13', 'WORK_DUR', '0', '1', 40],
        ['effort_to_reach_maintainability_rating_a', 'Effort to Reach Maintainability Rating A', 'Effort to Reach Maintainability Rating A', '2024-08-13', 'WORK_DUR', '0', '1', 40]
    ];

    return characteristics;
}
// Función para actualizar el JSON
function updateJson(characteristicsData) {
    const jsonData = JSON.stringify(characteristicsData, null, 2);
    console.log(jsonData);
    // Aquí podrías hacer algo con el JSON, como enviarlo a un servidor o guardarlo localmente
}
export default TiberonConfig;