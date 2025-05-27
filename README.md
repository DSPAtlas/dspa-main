# DSPA-Main: Application Deployment Guide
The DSPA application consists of a frontend built with React.js, a backend powered by Node.js, and a MySQL database. This setup is containerized using Docker and hosted on a Linux virtual machine (VM).

This guide walks you through pulling the Docker image, setting up the database, running the application, and managing updates.

## ✅ Prerequisites
- Ensure Docker and Docker Compose are installed on your Linux VM.
- Access to the Linux VM with appropriate permissions.
- A local dump of the dsaa-database is available for importing.


## 🔄 Updating the Docker Image

To update and push a new version of the Docker image:

```bash
docker login

docker buildx build --platform linux/amd64 -t dynaprot/dspa-main-app:latest --push .
```
This builds the image for the correct architecture and pushes it to Docker Hub.



## 🚀 Hosting the DSPA Application
The website is running in a Dockecontainer on our Linux VM. Pulling the docker image from dockerhub and having a local dsaa-database dumb.

1. Pull the Latest Docker Image

First, pull the latest Docker image for the DSPA application from Docker Hub. The --platform linux/amd64 flag ensures compatibility with the target architecture.

```bash
sudo docker pull --platform linux/amd64 dynaprot/dspa-main-app:latest
```
2. Start the Application with Docker Compose
Use Docker Compose to build and run the application. This will spin up the containers for both the frontend, backend, and the MySQL database.

```bash
sudo docker compose up --build -d
```
This command will start the containers in detached mode (-d).

## Dumping the database

Creating a database dump to upload it on the VM

```bash
mysqldump -u root -p dynaprotdb > dynaprotdb.sql

```

## 💾 Creating a Database Dump

To back up the local MySQL database before transferring or reloading:
 
```bash
mysqldump -u root -p dynaprotdb > dynaprotdb.sql

```

## 🗃️ Loading the Database into Docker

Although docker-compose.yml can automatically load the SQL dump via:

```yaml
volumes:
  - ./dynaprotdb.sql:/docker-entrypoint-initdb.d/dynaprotdb.sql
```

... you may occasionally need to load it manually:

**Manual Import Steps**
 Access the running MySQL container:
 ```bash
   sudo docker exec -it ekrismer-db-1 bash
  ```
Enter the MySQL CLI:
 ```bash
   mysql -u root -p
  ```

Load the SQL dump:
 ```bash
USE dynaprotdb;
SOURCE /docker-entrypoint-initdb.d/dynaprotdb.sql;
```

    

# ✅ Summary

| Task                   | Command or Step                                                        |
| ---------------------- | ---------------------------------------------------------------------- |
| Pull Docker image      | `docker pull --platform linux/amd64 dynaprot/dspa-main-app:latest` |
| Start containers       | `docker compose up --build -d`                                         |
| Build & push new image | `docker buildx build --platform linux/amd64 -t ... --push .`           |
| Stop website/containers | `docker compose down`           |


