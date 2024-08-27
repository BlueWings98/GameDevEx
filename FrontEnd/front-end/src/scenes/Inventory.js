import Phaser, { Game } from "phaser";
import InventoryEntity from "../Entity/InventoryEntity";

const width = 1690;
const height = 835;
const itemsDir = '../assets/sprites/items/';
const backgroundDir = '../assets/background/';

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

class Inventory extends Phaser.Scene {
    constructor() {
        super({ key: 'Inventory' });
    }
    preload() {
        this.preloadEveryReward();
        this.load.image('background', `${backgroundDir}Barn.png`);

    }
    preloadEveryReward() {
        rewards.forEach((reward, index) => {
            this.load.image('reward' + index, `${itemsDir}${reward.Sprite}`);
            console.log("Reward loaded: ", reward, " ", `${itemsDir}${reward.Sprite}`);
        });
    }

    create() {
        this.background = this.add.image(width / 2, height / 2, 'background');
        this.background.displayWidth = width;
        this.background.displayHeight = height;
        this.createExitButton();
        this.displayInventory();
    }
    listAllItems() {
        let inventory = getInventoryByHttp();
        let items = inventory.listItems();
        items.forEach(item => {
            console.log(item);
        });
    }
    displayInventory() {
        const startX = 50;
        const startY = 100;
        const spacingX = 500; // Espacio horizontal entre columnas
        const spacingY = 150; // Espacio vertical entre filas
    
        let inventory = getInventoryByHttp();
        console.log("Quantity of Items: " + inventory.items.length);
    
        inventory.items.forEach((item, index) => {
            const column = Math.floor(index / 5); // Determina la columna
            const row = index % 5; // Determina la fila dentro de la columna
    
            const itemX = startX + column * spacingX;
            const itemY = startY + row * spacingY;
    
            // Mostrar la imagen del objeto
            const itemSprite = this.add.image(itemX, itemY, 'reward' + item.GameItemId);
            itemSprite.displayWidth = 100;
            itemSprite.displayHeight = 100;
    
            // Mostrar el nombre del objeto
            const itemName = this.add.text(itemX + 120, itemY - 40, item.Name, {
                fill: '#FFFFFF',
                fontSize: '30px',
                fontStyle: 'bold'
            });
    
            // Mostrar la cantidad o "U" si es único
            const itemQuantity = item.IsUnique ? 'U' : item.Quantity;
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
    }
    
    triggerItemEvent(item) {
        console.log(item);
        console.log("Item clicked: ", item.Name, " ", item.Category);
        switch (item.Category) {
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
                alert("Evento genérico para la categoría: " + item.Category);
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
function getInventoryByHttp() {
    let inventory = new InventoryEntity(1);
    // Send HTTP request to get inventory
    inventory.addItem([
        {
            GameItemId: "0",
            Name: "Oran",
            Sprite: "Oran.png",
            Description: "Dulce, especial para jalea.",
            Category: "Comida",
            Rarity: "Común",
            IsUnique: false,
            Quantity: 1
        },
        {
            GameItemId: "1",
            Name: "Zidra",
            Sprite: "Zidra.png",
            Description: "Ácida, va bien con el arroz.",
            Category: "Comida",
            Rarity: "Común",
            IsUnique: false,
            Quantity: 1
        },
        {
            GameItemId: "2",
            Name: "Ziruela",
            Sprite: "Ziruela.png",
            Description: "Deliciosa fruta verde con semillas jugosas.",
            Category: "Comida",
            Rarity: "Común",
            IsUnique: false,
            Quantity: 1
        },
        {
            GameItemId: "3",
            Name: "Skin Azul",
            Sprite: "SkinAzul.png",
            Description: "Una skin azul para tu personaje.",
            Category: "Skin",
            Rarity: "Raro",
            IsUnique: true,
            Quantity: 1
        },
        {
            GameItemId: "4",
            Name: "Skin Rosada",
            Sprite: "SkinRosada.png",
            Description: "Una skin rosada para tu personaje.",
            Category: "Skin",
            Rarity: "Raro",
            IsUnique: true,
            Quantity: 1
        },
        {
            GameItemId: "5",
            Name: "Skin Verde",
            Sprite: "SkinVerde.png",
            Description: "Una skin verde para tu personaje.",
            Category: "Skin",
            Rarity: "Raro",
            IsUnique: true,
            Quantity: 1
        },
        {
            GameItemId: "6",
            Name: "Minijuego Snake",
            Sprite: "MinijuegoSnake.png",
            Description: "Desbloquea el minijuego Snake.",
            Category: "Minijuego",
            Rarity: "Epico",
            IsUnique: true,
            Quantity: 1
        },
        {
            GameItemId: "7",
            Name: "Gallo de Diamante",
            Sprite: "GalloDiamante.png",
            Description: "El premio mas gordo de todos. Lo lograste.",
            Category: "Jackpot",
            Rarity: "Legendario",
            IsUnique: true,
            Quantity: 1
        }
    ]);

    console.log("Inventory: ", inventory.items.length);
    return inventory;
}

export default Inventory;