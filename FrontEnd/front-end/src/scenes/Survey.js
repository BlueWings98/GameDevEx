import Phaser from "phaser";

const width = 1690;
const height = 835;
const textPerPage = 50; // Maximum number of characters per page
let textObject1;
let textObject2;
let writtenText = "This is a long text that will be displayed inside the orange textbox. It needs pagination if it doesn't fit entirely within the box.";
let displayedUserText = "";
let displayedGeneratedText = "";
let generatedText = "";
let currentPage = 0;
let totalPages = 0;

class Survey extends Phaser.Scene {
    constructor() {
        super({ key: 'Survey' });
    }

    create() {
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
                generatedText = sendHttpRequest(writtenText);
                writtenText = "";
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
function sendHttpRequest(text) {
    return "Esto es lo que devolveria el servidor";
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
    console.log(linesUnWritable);
    const linesAvailableUnWritable = linesUnWritable.length;
    const linesToShowUnWritable = Math.min(4, linesAvailableUnWritable);
    console.log(linesToShowUnWritable);

    displayedGeneratedText = "";
    for (let i = 0; i < linesToShowUnWritable; i++) {
        displayedGeneratedText += linesUnWritable[i] + '\n';
    }
    displayedGeneratedText = displayedGeneratedText.trim();
    textObject2.setText(displayedGeneratedText);
}
export default Survey;