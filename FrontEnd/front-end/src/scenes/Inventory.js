import Phaser, { Game } from "phaser";
import InventoryEntity from "../Entity/InventoryEntity";

const width = 1690;
const height = 835;
const itemsDir = '../assets/sprites/items/';
const backgroundDir = '../assets/background/';
const backendUrl = 'http://localhost:8080/';

const rewards = [];

class Inventory extends Phaser.Scene {
    constructor() {
        super({ key: 'Inventory' });
    }
    preload() {
        this.preloadEveryReward();
        this.load.image('background', `${backgroundDir}Barn.png`);

    }
    preloadEveryReward() {
        try {
            let everyPossibleReward = getEveryPossibleRewardLocal();
            everyPossibleReward.forEach((reward, index) => {
                this.load.image('reward' + index, `${itemsDir}${reward.sprite}`);
                console.log("Reward loaded: ", reward, " ", `${itemsDir}${reward.sprite}`);
            });
        } catch (error) {
            console.error('Error loading rewards:', error);
        }
    }
    

    create() {
        this.background = this.add.image(width / 2, height / 2, 'background');
        this.background.displayWidth = width;
        this.background.displayHeight = height;
        this.createExitButton();
        this.displayInventory(1);
    }
    listAllItems(userID) {
        let inventory = getInventoryByHttp(userID);
        let items = inventory.listItems();
        items.forEach(item => {
            console.log(item);
        });
    }
    async displayInventory(userID) {
        const startX = 50;
        const startY = 100;
        const spacingX = 500; // Espacio horizontal entre columnas
        const spacingY = 150; // Espacio vertical entre filas
    
        try {
            let inventory = await getInventoryByHttp(userID);
            inventory = inventory.listItems();
        
            inventory.forEach((item, index) => {
                const column = Math.floor(index / 5); // Determina la columna
                const row = index % 5; // Determina la fila dentro de la columna
        
                const itemX = startX + column * spacingX;
                const itemY = startY + row * spacingY;
        
                // Mostrar la imagen del objeto
                const itemSprite = this.add.image(itemX, itemY, 'reward' + item.gameItemId);
                itemSprite.displayWidth = 100;
                itemSprite.displayHeight = 100;
        
                // Mostrar el nombre del objeto
                const itemName = this.add.text(itemX + 120, itemY - 40, item.name, {
                    fill: '#FFFFFF',
                    fontSize: '30px',
                    fontStyle: 'bold'
                });
        
                // Mostrar la cantidad o "U" si es único
                const itemQuantity = item.isUnique ? 'U' : item.quantity;
                const itemQuantityText = this.add.text(itemX + 120, itemY + 10, `Cantidad: ${itemQuantity}`, {
                    fill: '#000000',
                    fontSize: '25px',
                    fontStyle: 'bold'
                });
        
                // Añadir interactividad
                itemSprite.setInteractive();
                itemSprite.on('pointerdown', () => {
                    this.triggerItemEvent(item);
                });
            });
        } catch (error) {
            console.error('Error getting the user inventory:', error);
        }

    }
    
    triggerItemEvent(item) {
        console.log(item);
        console.log("Item clicked: ", item.name, " ", item.category);
        switch (item.category) {
            case 'Comida':
                alert("Comida seleccionada, evento específico para comida.");
                // Aquí podrías añadir la lógica específica para la categoría 'Comida'
                break;
            case 'Skin':
                alert("Cambio de Skin.");
                // Aquí podrías añadir la lógica específica para la categoría 'Arma'
                break;
            case 'Minijuego':
                alert("Se activo el Minijuego.");
                // Aquí podrías añadir la lógica específica para la categoría 'Arma'
                break;
            case 'Jackpot':
                alert("Jackpot.");
                // Aquí podrías añadir la lógica específica para la categoría 'Arma'
                break;
            // Añadir más categorías según sea necesario
            default:
                alert("Evento genérico para la categoría: " + item.category);
        }
    }
    createExitButton() {
        const exitButton = this.add.text(width - 100, 50, 'Exit', {
            font: '50px Arial',
            fill: 'Red'
        });
        exitButton.setInteractive();
        exitButton.on('pointerdown', () => {
            this.scene.start('Home');
        });
    }
}
async function getEveryPossibleRewardHttp() {
    try {
        const response = await fetch(`${backendUrl}gameitem`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const rewards = await response.json();
        return rewards;
    } catch (error) {
        console.error('Error fetching Possible Items: ', error);
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
async function getInventoryByHttp(userID) {
    let inventory = new InventoryEntity(userID);

    try {
        // Send HTTP GET request with userID in the query string
        const response = await fetch(`${backendUrl}inventory?userID=${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const everyPossibleReward = await getEveryPossibleRewardHttp();

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const items = await response.json();

        console.log("Items: ", items);
        // Add the items to the inventory
        inventory.addItem(items, everyPossibleReward);

        console.log("Inventory: ", inventory.items.length);
    } catch (error) {
        console.error('Error fetching inventory:', error);
    }

    return inventory;
}



export default Inventory;