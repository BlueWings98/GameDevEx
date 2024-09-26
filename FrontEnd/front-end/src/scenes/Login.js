import Phaser from 'phaser';

const width = 1690;
const height = 835;

const backendUrl = 'http://localhost:8080/';
const backgroundDir = '../assets/background/';

class Login extends Phaser.Scene {
    constructor() {
        super({ key: 'Login' });
        this.userName = '';
        this.email = '';
        this.projectID = '';
        this.displayedUserText = '';
        this.writtenText = '';
        this.currentTextBox = 'userName'; // To track which text box is active
    }

    preload() {
        // Load background image
        this.load.image('barn', `${backgroundDir}CampoVainilla.png`);
    }

    create() {
        // Add background
        //this.barn = this.add.image(width / 2, height / 2, 'barn');
        //this.barn.displayWidth = width;
        //this.barn.displayHeight = height;

        // Create Username Input Field
        this.createWritableTextBox(100, 300, 600, 100, 'Nombre de Usuario');


        // Handle keyboard input
        this.input.keyboard.on('keydown', (event) => {
            this.handleTextInput(event);
        });
    }

    createWritableTextBox(x, y, width, height, placeholder) {
        const textBox = this.add.graphics();
        textBox.fillStyle(0xeabe63, 1); // Orange color
        textBox.fillRect(x, y, width, height);

        // Display placeholder text until the user types
        this.textObject = this.add.text(x + 20, y + 20, this.displayedUserText || placeholder, {
            font: '32px Arial',
            fill: 'Black',
            wordWrap: { width: width - 20, useAdvancedWrap: true }
        });
    }

    handleTextInput(event) {
        if (event.key === 'Enter') {
            if (this.currentTextBox === 'userName' && this.userName === '') {
                this.userName = this.writtenText;
                this.writtenText = '';
                this.checkUserName();
            } else if (this.currentTextBox === 'email') {
                this.email = this.writtenText;
                this.writtenText = '';
            } else if (this.currentTextBox === 'projectID') {
                this.projectID = this.writtenText;
                this.writtenText = '';
                this.createNewUser();
            }
        } else if (event.key === 'Backspace' && this.writtenText.length > 0) {
            this.writtenText = this.writtenText.slice(0, -1);
        } else if (event.key.length === 1) {
            this.writtenText += event.key;
        }

        this.updateText();
    }

    updateText() {
        this.displayedUserText = this.writtenText;
        this.textObject.setText(this.displayedUserText);
    }


    async checkUserName() {
        try {
            const isUserNameAvailableResponse = await fetch(`${backendUrl}users/available?userName=${this.userName}`);
            const isUserNameAvailable = await isUserNameAvailableResponse.json();
            console.log(isUserNameAvailable.isUserNameAvailable);

            if (isUserNameAvailable) {
                // If the username is available, prompt for email and projectID
                this.promptNewUserDetails();
            } else {
                // If the username is not available, log in the user
                await this.loginUser();
            }
        } catch (error) {
            console.error('Error checking username:', error);
        }
    }

    async loginUser() {
        try {
            const response = await fetch(`${backendUrl}users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName: this.userName })
            });
            const user = await response.json();
            console.log('User logged in:', user);
            this.scene.start('Home', { projectID: user.ProjectID, userID: user.UserID,
                totoloID: user.TotoloID, characterSkin : user.CharacterSkin});

            // Proceed to the next scene or game logic
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    promptNewUserDetails() {
        // Clear screen to remove previous input
        this.children.removeAll();

        // Create writable text boxes for email and projectID
        this.createWritableTextBox(100, 300, 600, 100, 'Id del Proyecto al que quieras pertenecer: 1-3');

        this.createWritableTextBox(100, 450, 600, 100, '');
        this.currentTextBox = 'projectID';

    }

    async createNewUser() {
        try {
            console.log('Creating new user:', this.userName, this.email, this.projectID);
            const response = await fetch(`${backendUrl}users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: this.userName,
                    email: "placeholderemail@example.com",
                    projectID: this.projectID
                })
            });
            const newUser = await response.json();
            console.log('New user created:', newUser);
            this.scene.start('Home', { projectID: newUser.ProjectID, userID: newUser.UserID,
                totoloID: newUser.TotoloID, characterSkin : newUser.CharacterSkin});

            // Proceed to the next scene or game logic
        } catch (error) {
            console.error('Error creating new user:', error);
        }
    }
}

export default Login;

