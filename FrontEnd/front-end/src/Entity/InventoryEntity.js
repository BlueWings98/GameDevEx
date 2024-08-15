class InventoryEntity {
    constructor(userID) {
        this.userID = userID; // ID of the user to whom the inventory belongs
        this.items = []; // Array to hold GameItem instances
    }

    addItem(gameItem) {
        if (gameItem.isUnique) {
            // Check if the unique item is already in the inventory
            const exists = this.items.some(item => item.gameItemID === gameItem.gameItemID);
            if (!exists) {
                this.items.push(gameItem);
            } else {
                console.log(`Item with ID ${gameItem.gameItemID} is unique and already exists in the inventory.`);
            }
        } else {
            this.items.push(gameItem);
        }
    }

    removeItem(gameItemID) {
        this.items = this.items.filter(item => item.gameItemID !== gameItemID);
    }

    listItems() {
        return this.items;
    }
}
export default InventoryEntity;