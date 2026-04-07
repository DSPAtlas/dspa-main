FROM node:20

WORKDIR /usr/src/app

# Copy the backend files from dspa-main
COPY dspa-main/ .

# Remove dspa-backend and dspa-frontend — Docker follows symlinks in the build context,
# so COPY dspa-main/ above may have brought in real directories (with stale build/ artifacts).
RUN rm -rf dspa-backend dspa-frontend

# Copy the actual directories for backend and frontend
COPY dspa-backend/ ./dspa-backend/
COPY dspa-frontend/ ./dspa-frontend/

# Install backend dependencies
RUN npm install

# Install frontend dependencies
RUN npm install --prefix dspa-frontend

# Clone external dependency into the path the frontend expects
# Clone Nightingale bundle and copy built modules into node_modules
# Since the local project root is used as context, we copy the local prebuilt Nightingale modules
RUN mkdir -p dspa-frontend/node_modules/@dspa-nightingale
COPY dspa-nightingale-bundle/nightingale-sequence dspa-frontend/node_modules/@dspa-nightingale/nightingale-sequence
COPY dspa-nightingale-bundle/nightingale-structure dspa-frontend/node_modules/@dspa-nightingale/nightingale-structure
COPY dspa-nightingale-bundle/nightingale-track dspa-frontend/node_modules/@dspa-nightingale/nightingale-track

# Build the frontend React app (now the folder exists)
RUN npm run build --prefix dspa-frontend

# Expose backend port
EXPOSE 8080

# Start backend
CMD ["node", "index.mjs"]
