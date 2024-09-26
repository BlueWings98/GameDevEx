import Phaser from "phaser";

const width = 1690;
const height = 835;
const textPerPage = 50; // Maximum number of characters per page
const backendUrl = 'http://localhost:8080/';
let textObject1;
let textObject2;
let writtenText = "";
let displayedUserText = "";
let displayedGeneratedText = "";
let generatedText = "";
let currentPage = 0;
let totalPages = 0;
let hunger = 1;
let characterEmotion = "Neutral";
let userID = 1;
let projectID = 1;
let numberOfSurveys = 1;
let totoloID = 1;

class Survey extends Phaser.Scene {
    constructor() {
        super({ key: 'Survey' });
    }
    init(data){
        characterEmotion = hungerToMood(data.hunger);
        totoloID = data.totoloID;
        numberOfSurveys = data.numberOfSurveys;
        userID = data.userID;
    }

    create() {
        this.getGeneratedQuestion();
        this.createWritableTextBox(0, height - 400, width / 2, 400);
        this.createUnWritableTextBox(0, height - 400, width / 2, 400);
        this.createExitButton();
        updateText();
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
            if (event.key === 'Enter') {
                receiveAnswerByHttp(writtenText, generatedText, projectID).then((response) => {
                    generatedText = response;
                    writtenText = "";
                    updateText();
                });
            } else if (event.key === 'Backspace' && writtenText.length > 0) {
                writtenText = writtenText.slice(0, -1);
            } else if (event.key.length === 1) {
                writtenText += event.key;
            } else if (event.key === 'ArrowRight' && currentPage < totalPages - 1) {
                currentPage++;
            } else if (event.key === 'ArrowLeft' && currentPage > 0) {
                currentPage--;
            }
            updateText();
        });

    }
    async getGeneratedQuestion() {
        generatedText = await generateQuestionByHttp();
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
async function receiveAnswerByHttp(writtenText, generatedText, projectID) {
    let gptResponse = "";
    try {
        // Send HTTP POST request with userID, characterEmotion in the query string, and the request body
        console.log("userID: " + userID + " characterEmotion: " + characterEmotion);
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
                characterEmotion: characterEmotion
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonResponse = await response.json();
        gptResponse = jsonResponse.choices[0].message.content;

        // Add the items to the inventory or handle the response as needed
    } catch (error) {
        console.error('Error fetching inventory:', error);
    }

    return gptResponse;
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
        gptQuestion = jsonResponse.choices[0].message.content;

        console.log("gptQuestion: ", gptQuestion);
        // Add the items to the inventory
    } catch (error) {
        console.error('Error fetching inventory:', error);
    }

    return gptQuestion;
}
function updateText() {
    // Divide el texto completo en líneas para el cuadro de texto escribible
    const linesWritable = writtenText.split('\n');
    const linesAvailableWritable = linesWritable.length;
    const linesToShowWritable = Math.min(4, linesAvailableWritable);

    displayedUserText = "";
    for (let i = 0; i < linesToShowWritable; i++) {
        displayedUserText += linesWritable[i] + '\n';
    }
    displayedUserText = displayedUserText.trim();
    textObject1.setText(displayedUserText);

    // Divide el texto completo en líneas para el cuadro de texto no escribible
    const linesUnWritable = generatedText.split('\n');
    const linesAvailableUnWritable = linesUnWritable.length;
    const linesToShowUnWritable = Math.min(4, linesAvailableUnWritable);

    displayedGeneratedText = "";
    for (let i = 0; i < linesToShowUnWritable; i++) {
        displayedGeneratedText += linesUnWritable[i] + '\n';
    }
    displayedGeneratedText = displayedGeneratedText.trim();
    textObject2.setText(displayedGeneratedText);
}
export default Survey;