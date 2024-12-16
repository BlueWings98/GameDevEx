# Auto DevEx: Enhancing Developer Experience Through Gamification and Metrics

Auto DevEx is a thesis project aimed at improving Developer Experience (DevEx) in software projects through gamification, modular design, and advanced analysis. The project integrates real-time subjective and objective evaluations to provide actionable insights at the team and organizational levels. Auto DevEx features Totolo, a tanuki character who interacts with users, guides them through surveys, and rewards engagement with prizes such as skins, minigames, and personalized reports.

## Features
- **Real-Time Developer Insights:** Combines subjective surveys with objective code analysis to generate comprehensive DevEx reports.
- **Gamification Elements:** Rewards users for participation and performance, improving engagement and motivation.
- **Modular Design:** Supports adaptive surveys, customizable character emotions, and seamless integration with projects and organizations.
- **Integrated Tools:** Utilizes OpenAI for intelligent survey generation and SonarCloud for code quality and security analysis.

## Prerequisites

Before running Auto DevEx, ensure you have the following:
- Docker Desktop or a similar container runtime.
- A valid API key for **OpenAI (ChatGPT)**.
- A valid API key for **SonarCloud**.
- PostgreSQL credentials for your database.

---

## Local Deployment Instructions

### 1. Generate Required API Keys
- **OpenAI API Key:** Needed for survey question generation.
- **SonarCloud API Key:** Required for code quality and security analysis.

### 2. Configure Environment Variables
Edit the `application.properties` file located in the backend directory:
```properties
openai.api.key="ChangeMe"
sonarcloud.api.key="ChangeMe"
frontend.url=${FRONTEND_URL:http://localhost:3000}

spring.datasource.url=jdbc:postgresql://db:5432/yourdatabase
spring.datasource.username=youruser
spring.datasource.password=yourpassword

```

### 3. Update `docker-compose.yml`

-   Navigate to the root of the project and open the `docker-compose.yml` file.
-   Update the database details as configured above.
-   Modify the following variable:
    
    ```yaml
    REACT_APP_BACKEND_URL: ${REACT_APP_BACKEND_URL:-http://localhost:8080/}
    
    ```
    

### 4. Build and Run

Run the following command in your terminal:

```bash
docker-compose up --build

```

### 5. Access the Application

Once the containers are up, access the frontend at:

```
http://localhost:3000/

```

----------

## Cloud Deployment Instructions

### 1. Update Backend URL

-   In your cloud-specific configuration file (e.g., `cloud-docker-compose.yml`), modify the variable:
    
    ```yaml
    REACT_APP_BACKEND_URL: ${REACT_APP_BACKEND_URL:-http://<your-backend-ip>:8080/}
    
    ```
    

### 2. Build and Push Images

-   Build the Docker images locally:
    
    ```bash
    docker-compose build
    
    ```
    
-   Push the images to a cloud image repository, such as **Google Cloud Artifact Registry**.

### 3. Set Up Virtual Machine

-   Install Docker on your virtual machine.
-   Pull the images from the cloud repository:
    
    ```bash
    docker pull <your-image-url>
    
    ```
    

### 4. Update and Run Cloud Configuration

-   Upload the `cloud-docker-compose.yml` file to your virtual machine.
-   Rename it to `docker-compose.yml`.
-   Modify the database and backend URL configurations in the file.

Run the following command:

```bash
docker-compose up --build

```

### 5. Access the Application

-   Use the public IP address of your virtual machine to access the frontend.

----------

## Contribution

This project is not being actively worked on. This was a MVP to test the validity of the idea to obtain the master's degree of the author. A new version of this project would require many changes starting by changing the game engine to one that has much more compatibility with mobile devices. I will post the full report here when it's published.

If you still want to contribute, you can. Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a feature branch.
3.  Commit your changes and push the branch.
4.  Open a pull request for review.

You can freely use this project as a base to improve Developer Experience in your workplace, and if you do we all win.

## License

Auto DevEx is licensed under the MIT License. See the [LICENSE](https://chatgpt.com/c/LICENSE) file for details.

## Contact

For questions or feedback, please contact **Sebastian Francisco Novoa Campos** at:

-   Email: [sebastiannovoa1998@hotmail.com](mailto:sebastiannovoa1998@hotmail.com)
-   GitHub: [BlueWings98](https://github.com/BlueWings98)

----------

```

Let me know if you need further adjustments or additions!