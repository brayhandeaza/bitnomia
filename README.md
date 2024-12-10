# Bitnomia Blockchain


### Running the Project

#### Prerequisites

- Docker need to be installed on your system

#### Clone the Repository

```bash
git clone https://github.com/brayhandeaza/bitnomia
```

#### Navigate to the Project Directory

```bash
cd bitnomia/
```

#### Run Docker Compose

```bash
docker compose up
```

This command will build and start the Docker containers specified in the `docker-compose.yml` file.

#### Access the Application

Once the Docker containers are up and running, you can access the application by navigating to http://localhost:3000 in your web browser, where `3000` is the port specified in the `docker-compose.yml` file for the application container.

Swagger documentation can be accessed at http://localhost:3000/docs. This provides detailed documentation for the API endpoints and allows for testing them directly from the browser.


### Screenshots
<img src="https://i.ibb.co/bPms6RS/blockchain.gif">

### Shutting Down the Project

To stop the project and remove the Docker containers, press `Ctrl + C` in the terminal where you ran `docker compose down --rmi all`.

```bash
docker compose down --rmi all
```

This will stop and remove the docker containers with all their volumes and images.

