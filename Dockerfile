FROM node:20

WORKDIR /usr/src/app

ENV CI=true \
    NPM_CONFIG_AUDIT=false \
    NPM_CONFIG_FUND=false \
    NPM_CONFIG_UPDATE_NOTIFIER=false

# Install server dependencies from the lockfile before copying source so this
# layer is reused unless package metadata changes.
COPY dspa-main/package*.json ./
RUN npm ci --omit=dev

# Copy the server and API source.
COPY dspa-main/ .
RUN rm -rf dspa-backend dspa-frontend
COPY dspa-backend/ ./dspa-backend/

# Install frontend dependencies from the lockfile before copying source.
COPY dspa-frontend/package*.json ./dspa-frontend/
RUN npm ci --omit=dev --prefix dspa-frontend

# Copy the frontend source.
COPY dspa-frontend/ ./dspa-frontend/

# Clone external dependency into the path the frontend expects
# Clone Nightingale bundle and copy built modules into node_modules
# Since the local project root is used as context, we copy the local prebuilt Nightingale modules
RUN mkdir -p dspa-frontend/node_modules/@dspa-nightingale
COPY dspa-nightingale-bundle/nightingale-sequence dspa-frontend/node_modules/@dspa-nightingale/nightingale-sequence
COPY dspa-nightingale-bundle/nightingale-structure dspa-frontend/node_modules/@dspa-nightingale/nightingale-structure
COPY dspa-nightingale-bundle/nightingale-track dspa-frontend/node_modules/@dspa-nightingale/nightingale-track
COPY dspa-nightingale-bundle/nightingale-sequence-heatmap dspa-frontend/node_modules/@nightingale-elements/nightingale-sequence-heatmap

# Build the frontend React app (now the folder exists)
RUN npm run build --prefix dspa-frontend

# Expose backend port
EXPOSE 8080

# Start backend
CMD ["node", "index.mjs"]
