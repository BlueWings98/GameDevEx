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
        this.createWritableTextBox(100, 300, 600, 100, 'Enter Username');

        // Create Submit Button
        this.createButton(100, 450, 'Submit', async () => {
            if (!this.userName) return; // Ensure username is not empty
            await this.checkUserName();
        });

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

    createButton(x, y, text, callback) {
        const button = this.add.text(x, y, text, { fontSize: '32px', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', callback);
    }

    async checkUserName() {
        try {
            const userExistsResponse = await fetch(`${backendUrl}users/available?userName=${this.userName}`);
            const userExists = await userExistsResponse.json();
            console.log(userExists.isUserNameAvailable);

            if (userExists) {
                // If user exists, log them in
                await this.loginUser();
            } else {
                // If user doesn't exist, prompt for email and projectID
                this.promptNewUserDetails();
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
        this.createWritableTextBox(100, 300, 600, 100, 'Enter Email');
        this.currentTextBox = 'email';

        this.createWritableTextBox(100, 450, 600, 100, 'Enter Project ID');
        this.currentTextBox = 'projectID';

        // Submit button for registering new user
        this.createButton(100, 600, 'Register', async () => {
            if (this.email && this.projectID) {
                await this.createNewUser();
            }
        });
    }

    async createNewUser() {
        try {
            const response = await fetch(`${backendUrl}users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: this.userName,
                    email: this.email,
                    projectID: this.projectID
                })
            });
            const newUser = await response.json();
            console.log('New user created:', newUser);

            // Proceed to the next scene or game logic
        } catch (error) {
            console.error('Error creating new user:', error);
        }
    }
}

export default Login;

