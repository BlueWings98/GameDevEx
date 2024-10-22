import Phaser, { Game } from "phaser";
import InventoryEntity from "../Entity/InventoryEntity";

const width = 1690;
const height = 835;
const itemsDir = '../assets/sprites/items/';
const backgroundDir = '../assets/background/';
const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080/';

const rewards = [];

let userID = 1;
let totoloID = 1;

class Inventory extends Phaser.Scene {
    constructor() {
        super({ key: 'Inventory' });
    }
    init(data){
        userID = data.userID;
        console.log("totoloID despues: ", userID);
        totoloID = data.totoloID;
        console.log("totoloID despues: ", totoloID);
    }
    preload() {
        this.preloadEveryReward();
        this.load.image('background', `${backgroundDir}CasillaDeTexto.png`);

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
        this.displayInventory(userID);
    }
    listAllItems(userID) {
        let inventory = getInventoryByHttp(userID);
        let items = inventory.listItems();
        items.forEach(item => {
            console.log(item);
        });
    }
    async displayInventory(userID) {
        const startX = 150;
        const startY = 150;
        const spacingX = 500; // Espacio horizontal entre columnas
        const spacingY = 120; // Espacio vertical entre filas

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
                    triggerItemEvent(userID, item.gameItemId, 1, totoloID).then((responseData) => {
                        // Assuming the responseData contains the message, like { message: "Totolo has been fed!" }
                        if (responseData && responseData.response) {
                            alert(responseData.response); // Display the message in an alert box
                        }
                        itemQuantityText.setText(`Cantidad: ${item.isUnique ? 'U' : item.quantity - 1}`);
                    });
                });
        });
        } catch (error) {
            console.error('Error getting the user inventory:', error);
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
function getEveryPossibleRewardLocal() {
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
    console.log("UserID before http: ", userID);

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
async function triggerItemEvent(userID, itemID, quantity) {
    let response;
    try {
        response = await fetch(`${backendUrl}use-item`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: userID,
                itemID: itemID,
                quantity: quantity,
                totoloID: totoloID
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error triggering item event:', error);
    }
}



export default Inventory;