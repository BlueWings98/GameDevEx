class InventoryEntity {
    constructor(userID) {
        this.userID = userID; // ID of the user to whom the inventory belongs
        this.items = new Map(); // Use a Map to hold GameItem instances with their quantities
    }

    addItem(gameItems, everyPossibleReward) {
        console.log("Received GameItems before adding the items: ", gameItems);

        // Create a map for faster lookups
        const rewardMap = new Map(everyPossibleReward.map(reward => [reward.gameItemId, reward]));

        Object.keys(gameItems).forEach(key => {
            const count = gameItems[key];
            const reward = rewardMap.get(parseInt(key)); // O(1) lookup

            if (reward) {
                if (reward.isUnique) {
                    if (!this.items.has(reward.gameItemId)) {
                        this.items.set(reward.gameItemId, { ...reward, quantity: 1 });
                    } else {
                        console.log(`Item with ID ${reward.gameItemId} is unique and already exists in the inventory.`);
                    }
                } else {
                    if (this.items.has(reward.gameItemId)) {
                        const existingItem = this.items.get(reward.gameItemId);
                        existingItem.quantity += count; // Update the quantity
                    } else {
                        this.items.set(reward.gameItemId, { ...reward, quantity: count });
                    }
                }
            }
        });

        console.log("Inventory after adding the items: ", this.listItems());
    }

    removeItem(gameItemId) {
        this.items.delete(gameItemId);
    }

    listItems() {
        // Convert the Map to an array of items
        return Array.from(this.items.values());
    }
}

export default InventoryEntity;
