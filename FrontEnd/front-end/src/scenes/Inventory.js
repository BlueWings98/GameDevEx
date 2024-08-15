import Phaser from "phaser";
import InventoryEntity from "../Entity/InventoryEntity";

class Inventory extends Phaser.Scene {
    constructor() {
        super({ key: 'Inventory' });
    }


    create() {
        this.listAllItems();
    }
    listAllItems(){
        let inventory = getInventoryByHttp();
        let items = inventory.listItems();
        items.forEach(item => {
            console.log(item);
        });
    }
}
function getInventoryByHttp() {
    let inventory = new InventoryEntity(1);
    // Send HTTP request to get inventory
    inventory.addItem({
        name: "Oran", 
        gameItemID: 1, 
        sprite: "../assets/sprites/items/Oran.png", 
        description: "The most basic food.", 
        rarity: "Common",
        isUnique: false
     });

     return inventory;
}

export default Inventory;