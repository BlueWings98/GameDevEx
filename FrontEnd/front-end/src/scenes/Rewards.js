import Phaser from "phaser";

const backgroundDir = '../assets/background/';
const itemsDir = '../assets/sprites/items/';
const pullsDir = '../assets/sprites/pulls/';
const width = 1690;
const height = 835;
const rewards = [
    {
        GameItemId: "0",
        Name: "Oran",
        Sprite: "Oran.png",
        Description: "Dulce, especial para jalea.",
        Category: "Comida",
        Rarity: "Común",
        IsUnique: false
    },
    {
        GameItemId: "1",
        Name: "Zidra",
        Sprite: "Zidra.png",
        Description: "Ácida, va bien con el arroz.",
        Category: "Comida",
        Rarity: "Común",
        IsUnique: false
    },
    {
        GameItemId: "2",
        Name: "Ziruela",
        Sprite: "Ziruela.png",
        Description: "Deliciosa fruta verde con semillas jugosas.",
        Category: "Comida",
        Rarity: "Común",
        IsUnique: false
    },
    {
        GameItemId: "3",
        Name: "Skin Azul",
        Sprite: "SkinAzul.png",
        Description: "Una skin azul para tu personaje.",
        Category: "Skin",
        Rarity: "Raro",
        IsUnique: true
    },
    {
        GameItemId: "4",
        Name: "Skin Rosada",
        Sprite: "SkinRosada.png",
        Description: "Una skin rosada para tu personaje.",
        Category: "Skin",
        Rarity: "Raro",
        IsUnique: true
    },
    {
        GameItemId: "5",
        Name: "Skin Verde",
        Sprite: "SkinVerde.png",
        Description: "Una skin verde para tu personaje.",
        Category: "Skin",
        Rarity: "Raro",
        IsUnique: true
    },
    {
        GameItemId: "6",
        Name: "Minijuego Snake",
        Sprite: "MinijuegoSnake.png",
        Description: "Desbloquea el minijuego Snake.",
        Category: "Minijuego",
        Rarity: "Epico",
        IsUnique: true
    },
    {
        GameItemId: "7",
        Name: "Gallo de Diamante",
        Sprite: "GalloDiamante.png",
        Description: "El premio mas gordo de todos. Lo lograste.",
        Category: "Jackpot",
        Rarity: "Legendario",
        IsUnique: true
    }
];
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
        this.load.image('pull10', `${pullsDir}Pull10.png`);

        //Preload the rewards
        rewards.forEach((reward, index) => {
            this.load.image('reward' + index, `${itemsDir}${reward.Sprite}`);
            console.log("Reward loaded: ", reward, " ", `${itemsDir}${reward.Sprite}`);
        });
    }
    create() {
        this.saucer = this.add.image(width / 2, height / 2, 'saucer');
        this.saucer.displayWidth = width;
        this.saucer.displayHeight = height;
        this.coins = this.add.image(100, 100, 'coins');
        this.coins.displayWidth = 200;
        this.coins.displayHeight = 200;
        getCoins();
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

    generateReward(coinsToPull) {
        const reward = sendHttpRequest(coinsToPull);
        
        for (let i = 0; i < reward.length; i++) {
            const imageKey = 'reward' + reward[i].GameItemId; // Usa un id único o el índice cargado
    
            console.log("Image key: " +imageKey);
            // Añadir la imagen precargada a la escena
            this.displayedReward = this.add.image(width / 2, height / 2, imageKey);
            this.displayedReward.displayWidth = 300;
            this.displayedReward.displayHeight = 300;
            console.log(this.displayedReward);
    
            // Añadir textos
            this.rewardText1 = this.add.text(width / 2, height / 2 - 100, reward[i].Name, {
                fill: '#FFFFFF',
                fontSize: '50px',
                fontStyle: 'bold'
            }).setOrigin(0.5);
    
            this.rewardText2 = this.add.text(width / 2, height / 2 - 50, reward[i].Rareza, {
                fill: '#FFD700',
                fontSize: '50px',
                fontStyle: 'bold'
            }).setOrigin(0.5);
    
            this.rewardText3 = this.add.text(width / 2, height / 2, reward[i].Description, {
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
    
            inventory.push(reward[i]);
            console.log("Reward added to inventory: ", reward[i]);
        }
    
        console.log("Current inventory: ", inventory);
    }
    
}
function getCoins(){
    coinCounter = 10;
}
function sendHttpRequest(coinsToPull) {
    const rewardsArray = [];

    for (let i = 0; i < coinsToPull; i++) {
        const randomIndex = Math.floor(Math.random() * rewards.length);
        rewardsArray.push(rewards[randomIndex]);
    }
    coinCounter -= coinsToPull;
    if(coinsToPull >= 10){
        coinCounter += 1;
    }

    // Devolvemos un array con la cantidad especificada de recompensas aleatorias
    return rewardsArray;
}
export default Rewards;