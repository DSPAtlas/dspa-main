# Use the official Node.js image
FROM node:14

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image
COPY package*.json ./

# Install production dependencies
RUN npm install

# Copy local code to the container image
COPY . .


RUN wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud_sql_proxy
RUN chmod +x cloud_sql_proxy

EXPOSE 8080

# Run the Cloud SQL Auth proxy
# Replace INSTANCE_CONNECTION_NAME with your instance's connection name

CMD ./cloud_sql_proxy -instances=dspa-429113:europe-west6:dspasampledatabase=tcp:3306 & npm start

# Expose the port on which your app runs


