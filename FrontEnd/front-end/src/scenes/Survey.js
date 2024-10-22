import Phaser from "phaser";

const width = 1690;
const height = 835;
const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080/';
const itemsDir = '../assets/sprites/items/';
let textObject1;
let textObject2;
let displayedUserText = "";
let displayedGeneratedText = "Estoy pensando....";
let characterEmotion = "Neutral";
let userID = 1;
let projectID = 1;
let totoloID = 1;
let dxFactorID = 0;
let numberOfSurveys = 1;
let isInputEnabled = true;


class Survey extends Phaser.Scene {
    constructor() {
        super({ key: 'Survey' });
    }
    init(data) {
        characterEmotion = hungerToMood(data.hunger);
        totoloID = data.totoloID;
        numberOfSurveys = data.numberOfSurveys;
        userID = data.userID;
        isInputEnabled = true
    }
    preload() {
        this.load.image('coins', `${itemsDir}Coin.png`); // Load the coin image
    }

    create() {
        this.createWritableTextBox(0, height - 400, width / 2, 400);
        this.createUnWritableTextBox(0, height - 400, width / 2, 400);
        this.createInvisibleBox(0, 0, width, height - 400);
        this.createExitButton();

        // Update generated text when the question is received
        generateQuestionByHttp().then((response) => {
            displayedGeneratedText = response;
            textObject2.setText(displayedGeneratedText); // Update the text object
        });
    }

    createWritableTextBox(x, y, width, height) {
        const textBox1 = this.add.graphics();
        textBox1.fillStyle(0xeabe63, 1); // Orange color
        textBox1.fillRect(x, y, width, height);

        textObject1 = this.add.text(x + 20, y + 20, displayedUserText, {
            font: '50px Arial',
            fill: 'Black',
            wordWrap: { width: width - 20, useAdvancedWrap: true }
        });

        this.input.keyboard.on('keydown', function (event) {
            if (!isInputEnabled) {
                return;
            }
            if (event.key === 'Enter') {
                receiveAnswerByHttp(displayedUserText, displayedGeneratedText, projectID, this).then((response) => {
                    displayedGeneratedText = response;
                    displayedUserText = "";
                    textObject1.setText(displayedUserText);  // Update writable text
                    console.log("displayedGeneratedText: ", displayedGeneratedText);
                    textObject2.setText(displayedGeneratedText);  // Update generated text
                    isInputEnabled = false;
                });
            } else if (event.key === 'Backspace' && displayedUserText.length > 0) {
                displayedUserText = displayedUserText.slice(0, -1);
                textObject1.setText(displayedUserText);  // Update writable text
            } else if (event.key.length === 1) {
                displayedUserText += event.key;
                textObject1.setText(displayedUserText);  // Update writable text
            }
        }, this);
        //This is to capture unwanted clicks.
        textBox1.setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);

    }
    createUnWritableTextBox(x, y, width, height) {
        const textBox2 = this.add.graphics();
        textBox2.fillStyle(0xeabe63, 1); // Orange color
        textBox2.fillRect(width, y, width, height);

        textObject2 = this.add.text(width + 20, y + 20, displayedGeneratedText, {
            font: '50px Arial',
            fill: 'Black',
            wordWrap: { width: width - 20, useAdvancedWrap: true }
        });
        //This is to capture unwanted clicks.
        textBox2.setInteractive(new Phaser.Geom.Rectangle(width, y, width, height), Phaser.Geom.Rectangle.Contains);
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
    // New method for creating the coin with physics
    createCoin() {
        // Set the world bounds for the physics world
        this.physics.world.setBounds(0, 0, width, height);

        // Add the coin sprite in the center of the screen
        const coin = this.physics.add.sprite(200, 200, 'coins');

        // Set normal physics properties for the coin
        coin.setCollideWorldBounds(true);  // Coin collides with world bounds
        coin.setBounce(0.8);               // Make it bouncy
        coin.setInteractive();             // Make it draggable
        coin.setDisplaySize(200, 200);     // Resize the coin

        // Allow the player to drag the coin around
        this.input.setDraggable(coin);

        // Handle dragging behavior
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        // Simulate toss with velocity after drag ends
        this.input.on('dragend', (pointer, gameObject) => {
            gameObject.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
        });

        // Add gravity for a "Beat the Boss" effect
        this.physics.world.gravity.y = 300;

        // Make the coin disappear after 20 seconds
        this.time.delayedCall(20000, () => {
            coin.destroy();
        });

        // Collide with world bounds
        this.physics.add.collider(coin, this.physics.world.bounds);
    }
    //This method creates an invisible box that captures unwanted clicks
    createInvisibleBox(x, y, width, height) {
        const invisibleBox = this.add.graphics();
        invisibleBox.fillStyle(0x000000, 0.4); // Transparent color
        invisibleBox.fillRect(x, y, width, height);
    
        // Enable input so it captures clicks
        invisibleBox.setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);
    }
    

}
async function receiveAnswerByHttp(writtenText, generatedText, projectID, scene) {
    try {
        // Send HTTP POST request with userID, characterEmotion in the query string, and the request body
        const response = await fetch(`${backendUrl}survey/receiveanswer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userResponse: writtenText,
                gptResponse: generatedText,
                projectID: projectID,
                userID: userID,
                characterEmotion: characterEmotion,
                dxFactorID: dxFactorID
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonResponse = await response.json();
        let gptJsonResponse = jsonResponse.gptResponse;
        console.log("isAnswerValid: ", jsonResponse.isAnswerValid);
        if (jsonResponse.isAnswerValid) {
            scene.createCoin();
        }

        console.log("gptResponse: ", gptJsonResponse);
        return gptJsonResponse;

        // Add the items to the inventory or handle the response as needed
    } catch (error) {
        console.error('Error fetching inventory:', error);
    }
}

async function generateQuestionByHttp() {
    // Definir el arreglo de características basado en los datos SQL proporcionados
    let gptQuestion = "";
    try {
        // Send HTTP GET request with userID in the query string
        const response = await fetch(`${backendUrl}survey/generatequestion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                totoloID: totoloID,
                characterEmotion: characterEmotion,
                numberOfSurveys: 1
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonResponse = await response.json();
        gptQuestion = jsonResponse.gptResponse;
        dxFactorID = jsonResponse.dxFactorID;

        console.log("gptQuestion: ", gptQuestion);
        // Add the items to the inventory
    } catch (error) {
        console.error('Error fetching inventory:', error);
    }

    return gptQuestion;
}
function hungerToMood(hunger) {
    switch (hunger) {
        case 0:
            return "Enojado";
        case 1:
            return "Triste";
        case 2:
            return "Neutral";
        case 3:
            return "Alegre";

        default:
            return "Neutral";
    }
}
export default Survey;