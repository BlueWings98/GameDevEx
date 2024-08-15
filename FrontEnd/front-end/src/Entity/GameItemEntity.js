class GameItemEntity {
    constructor(name, gameItemID, sprite, description, rarity, isUnique) {
        this.name = name;
        this.gameItemID = gameItemID;
        this.sprite = sprite; // URL or path to the sprite image
        this.description = description;
        this.rarity = rarity; // Should be one of 'Common', 'Uncommon', 'Rare', 'Legendary'
        this.isUnique = isUnique; // Boolean indicating if the item is unique
    }
}
export default GameItemEntity;