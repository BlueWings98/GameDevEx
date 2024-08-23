class InventoryEntity {
    constructor(userID) {
        this.userID = userID; // ID of the user to whom the inventory belongs
        this.items = []; // Array to hold GameItem instances
    }

    addItem(gameItems) {
        // Si solo se pasa un objeto y no un arreglo, convertirlo en un arreglo de un solo elemento
        console.log("Received GameItems before adding the items: ", gameItems);
        if (!Array.isArray(gameItems)) {
            gameItems = [gameItems];
        }
    
        gameItems.forEach(gameItem => {
            if (gameItem.IsUnique) {
                // Verificar si el elemento único ya está en el inventario
                const exists = this.items.some(item => item.GameItemId === gameItem.GameItemId);
                if (!exists) {
                    this.items.push(gameItem);
                } else {
                    console.log(`Item with ID ${gameItem.GameItemId} is unique and already exists in the inventory.`);
                }
            } else {
                // Para los elementos no únicos, sumamos la cantidad si ya existe en el inventario
                const existingItem = this.items.find(item => item.GameItemId === gameItem.GameItemId);
                if (existingItem) {
                    existingItem.Quantity += gameItem.Quantity;
                } else {
                    this.items.push(gameItem);
                }
            }
        });
        console.log("Inventory after adding the items: ", this.items.length);
    }
    
    removeItem(gameItemId) {
        this.items = this.items.filter(item => item.GameItemId !== gameItemId);
    }

    listItems() {
        return this.items;
    }
}
export default InventoryEntity;