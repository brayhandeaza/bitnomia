# Variables
DOCKER = docker

up:
	$(DOCKER) compose up 

drop: 
	$(DOCKER) compose down --rmi all

down: 
	$(DOCKER) compose down 