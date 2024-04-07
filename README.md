# Bitnomia Blockchain


### Running the Project

#### Prerequisites

- Docker installed on your system

#### Clone the Repository

```bash
git clone https://github.com/yourusername/project.git
```

#### Navigate to the Project Directory

```bash
cd project
```

#### Run Docker Compose

```bash
docker-compose up
```

This command will build and start the Docker containers specified in the `docker-compose.yml` file.

#### Access the Application

Once the Docker containers are up and running, you can access the application by navigating to http://localhost:port in your web browser, where `port` is the port specified in the `docker-compose.yml` file for the application container.

### Shutting Down the Project

To stop the project and remove the Docker containers, press `Ctrl + C` in the terminal where you ran `docker-compose up`. Then, run the following command:

```bash
docker-compose down
```

This will stop and remove the containers, but it will preserve your project files.