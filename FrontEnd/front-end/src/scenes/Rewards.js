import Phaser from "phaser";

const backgroundDir = '../assets/background/';
const itemsDir = '../assets/sprites/items/';
const pullsDir = '../assets/sprites/pulls/';
const backendUrl = 'http://localhost:8080/';
const width = 1690;
const height = 835;

var inventory = [];
var coinCounter = 0;

class Rewards extends Phaser.Scene {
    constructor() {
        super({key :'Rewards'});
    }
    preload() {
        this.load.image('saucer', `${backgroundDir}Casino.png`);
        this.load.image('coins', `${itemsDir}Coin.png`);
        this.load.image('pull1', `${pullsDir}Pull1.png`);
        //this.load.image('pull10', `${pullsDir}Pull10.png`);

        //Preload the rewards
        const rewards = getEveryPossibleRewardLocal();
        rewards.forEach((reward, index) => {
            this.load.image('reward' + index, `${itemsDir}${reward.sprite}`);
            console.log("Reward loaded: ", reward, " ", `${itemsDir}${reward.sprite}`);
        });
    }
    create() {
        this.saucer = this.add.image(width / 2, height / 2, 'saucer');
        this.saucer.displayWidth = width;
        this.saucer.displayHeight = height;
        this.coins = this.add.image(100, 100, 'coins');
        this.coins.displayWidth = 200;
        this.coins.displayHeight = 200;
        getCoins(1);
        this.coinsText = this.add.text(170, 80,"X " + coinCounter, {
            fill: '#FFD700',
            fontSize: '70px',
            fontStyle: 'bold'
        });
        this.createPullsButton();
        this.returnToHomeButton();
    }
    createPullsButton() {
        // Cargar las imágenes de los botones
        this.pull1Button = this.add.image(width / 2 - 130, height-170, 'pull1').setInteractive();
        //this.pull10Button = this.add.image(width / 2 + 130, height-170, 'pull10').setInteractive();
    
        // Escalar las imágenes si es necesario
        this.pull1Button.setScale(0.2); // Ajusta la escala según sea necesario
        //this.pull10Button.setScale(0.2); // Ajusta la escala según sea necesario
    
        // Hacer los botones interactivos y definir las acciones
        this.pull1Button.on('pointerdown', () => {
            this.pull1Button.setTint(0xFF8C00); // Cambia el color cuando se presiona
        });
    
        this.pull1Button.on('pointerup', () => {
            this.pull1Button.clearTint(); // Restaura el color original
            if(coinCounter >= 1){
                this.generateReward(1);
                this.coinsText.setText("X " + coinCounter);
                this.pull1Button.disableInteractive();
            } else {
                alert("Not enough coins to pull.");
            }
             // Ejecuta la acción del botón para 1 pull
        });
    
        this.pull1Button.on('pointerout', () => {
            this.pull1Button.clearTint(); // Restaura el color si el cursor se mueve fuera
        });
    
        /*this.pull10Button.on('pointerdown', () => {
            this.pull10Button.setTint(0xFF8C00); // Cambia el color cuando se presiona
        });
    
        this.pull10Button.on('pointerup', () => {
            this.pull10Button.clearTint(); // Restaura el color original
            if(coinCounter >= 10){
                this.generateReward(11); // Ejecuta la acción del botón para 10+1 pulls
                this.coinsText.setText("X " + coinCounter);
            } else {
                alert("Not enough coins to pull.");
            }
        });
    
        this.pull10Button.on('pointerout', () => {
            this.pull10Button.clearTint(); // Restaura el color si el cursor se mueve fuera
        });*/
    }
    


    returnToHomeButton() {
        // Dimensiones y posición de la caja
        const boxWidth = 200;
        const boxHeight = 100;
        const boxX = 200;
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

    async generateReward(coinsToPull) {
        let userID = 1;
        const dropTableId = 1;
        const reward = pullByHttpRequest(userID, dropTableId ,coinsToPull);
        let result = await reward;
        console.log("result: ", result);
        getCoins(1); //Update the coin counter.
        
        for (let i = 0; i < result.length; i++) {
            const imageKey = 'reward' + result[i].gameItemId; // Usa un id único o el índice cargado
    
            console.log("Image key: " +imageKey);
            // Añadir la imagen precargada a la escena
            this.displayedReward = this.add.image(width / 2, height / 2, imageKey);
            this.displayedReward.displayWidth = 300;
            this.displayedReward.displayHeight = 300;
            console.log(this.displayedReward);
    
            // Añadir textos
            this.rewardText1 = this.add.text(width / 2, height / 2 - 100, result[i].name, {
                fill: '#FFFFFF',
                fontSize: '50px',
                fontStyle: 'bold'
            }).setOrigin(0.5);
    
            this.rewardText2 = this.add.text(width / 2, height / 2 - 50, result[i].rarity, {
                fill: '#FFD700',
                fontSize: '50px',
                fontStyle: 'bold'
            }).setOrigin(0.5);
    
            this.rewardText3 = this.add.text(width / 2, height / 2, result[i].description, {
                fill: '#FFD700',
                fontSize: '50px',
                fontStyle: 'bold'
            }).setOrigin(0.5);
    
            // Configurar el botón interactivo
            this.displayedReward.setInteractive();
            this.displayedReward.on('pointerdown', () => {
                this.displayedReward.destroy();
                this.rewardText1.destroy();
                this.rewardText2.destroy();
                this.rewardText3.destroy();
                this.pull1Button.setInteractive();
                //this.pull10Button.setInteractive();
            });
    
            inventory.push(result[i]);
            console.log("Reward added to inventory: ", result[i]);
        }
    
        console.log("Current inventory: ", inventory);
    }
    
}
async function getCoins(userID){
    try {
        const response = await fetch(`${backendUrl}inventory?userID=${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Error getting the user inventory.');
        }
        const items = await response.json();
        coinCounter = items["8"];
        console.log("Coins: ", items["8"]);
    } catch (error) {
        throw new Error('Error getting the coins.');
    }
}
function getEveryPossibleRewardLocal(){
    return [
        {
            "gameItemId": 0,
            "name": "Oran",
            "isUnique": false,
            "sprite": "Oran.png",
            "description": "Dulce, especial para jalea.",
            "category": "Comida",
            "rarity": "Común"
        },
        {
            "gameItemId": 1,
            "name": "Zidra",
            "isUnique": false,
            "sprite": "Zidra.png",
            "description": "Ácida, va bien con el arroz.",
            "category": "Comida",
            "rarity": "Común"
        },
        {
            "gameItemId": 2,
            "name": "Ziruela",
            "isUnique": false,
            "sprite": "Ziruela.png",
            "description": "Deliciosa fruta verde con semillas jugosas.",
            "category": "Comida",
            "rarity": "Común"
        },
        {
            "gameItemId": 3,
            "name": "Skin Azul",
            "isUnique": true,
            "sprite": "SkinAzul.png",
            "description": "Una skin azul para tu personaje.",
            "category": "Skin",
            "rarity": "Raro"
        },
        {
            "gameItemId": 4,
            "name": "Skin Rosada",
            "isUnique": true,
            "sprite": "SkinRosada.png",
            "description": "Una skin rosada para tu personaje.",
            "category": "Skin",
            "rarity": "Raro"
        },
        {
            "gameItemId": 5,
            "name": "Skin Verde",
            "isUnique": true,
            "sprite": "SkinVerde.png",
            "description": "Una skin verde para tu personaje.",
            "category": "Skin",
            "rarity": "Raro"
        },
        {
            "gameItemId": 6,
            "name": "Minijuego Snake",
            "isUnique": true,
            "sprite": "MinijuegoSnake.png",
            "description": "Desbloquea el minijuego Snake.",
            "category": "Minijuego",
            "rarity": "Epico"
        },
        {
            "gameItemId": 7,
            "name": "Gallo de Diamante",
            "isUnique": true,
            "sprite": "GalloDiamante.png",
            "description": "El premio mas gordo de todos. Lo lograste.",
            "category": "Jackpot",
            "rarity": "Legendario"
        },
        {
            "gameItemId": 8,
            "name": "Coin",
            "isUnique": false,
            "sprite": "Coin.png",
            "description": "Monedas, se convierten en otras recompenzas.",
            "category": "Dinero",
            "rarity": "Común"
        }
    ]
}
async function pullByHttpRequest(userID, dropTableId, numberOfPulls) {
    const rewardsArray = [];
    try {
        const response = await fetch(`${backendUrl}pull`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: userID,
                dropTableId: dropTableId,
                numberOfPulls: numberOfPulls
            })
        });

        if (!response.ok) {
            throw new Error('Error getting the rewards.');
        }

        const rewards = await response.json();
        console.log("Rewards in pull by http: ", rewards);
        rewardsArray.push(...rewards);
    } catch (error) {
        console.error('Request failed', error);
    }

    // Return the array with the retrieved rewards
    return rewardsArray;
}

export default Rewards;