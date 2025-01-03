# Use the official Node.js image from Docker Hub as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .
COPY certs/nginx.key /usr/src/app/nginx.key
COPY certs/nginx.crt /usr/src/app/nginx.crt

# Build the frontend React app
RUN npm run build --prefix dspa-frontend

# Expose the port that your app runs on
EXPOSE 8080

# Start the application
CMD ["node", "index.mjs"]