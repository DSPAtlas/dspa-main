# DSPA-main
The DSPA application consists of a frontend built with React.js, a backend using Node.js, and a MySQL database. This setup is hosted in a Docker container running on a Linux VM. Below are the steps to pull the Docker image from Docker Hub, set up the database, and start the application.

Prerequisites
- Ensure Docker and Docker Compose are installed on your Linux VM.
- Access to the Linux VM with appropriate permissions.
- A local dump of the dsaa-database is available for importing.


## Hosting
The website is running in a Dockecontainer on our Linux VM. Pulling the docker image from dockerhub and having a local dsaa-database dumb.

1. Pull the Latest Docker Image

First, pull the latest Docker image for the DSPA application from Docker Hub. The --platform linux/amd64 flag ensures compatibility with the target architecture.

```bash
sudo docker pull --platform linux/amd64 elenakrismer/dspa-main-app:latest
```
2. Set up Docker
Use Docker Compose to build and run the application. This will spin up the containers for both the frontend, backend, and the MySQL database.

```bash
sudo docker compose up --build -d
```

## Updating Docker Image


```bash
docker login

docker buildx build --platform linux/arm64 -t elenakrismer/dspa-main-app:latest --push .

docker buildx build --platform linux/amd64 -t elenakrismer/dspa-main-app:latest --push .
```


## Dumping the database

Creating a database dump to upload it on the VM

```bash
mysqldump -u root -p dynaprotdb > dynaprotdb.sql

```

## Loading of database
 
 The database dump is getting loaded by the dockercompose.yml however it can happen that it needs to be loaded manually into the docker container.


```bash
sudo docker exec -it ekrismer-db-1 bash
mysql -u root -p
USE dynaprotdb;
SOURCE /docker-entrypoint-initdb.d/dynaprotdb.sql;
```
