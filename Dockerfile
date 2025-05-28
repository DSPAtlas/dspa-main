FROM node:20

WORKDIR /usr/src/app

# Copy root package files first
COPY package*.json ./

COPY . .

# Install backend dependencies
RUN npm install

# Install frontend dependencies
RUN npm install --prefix dspa-frontend

# Clone external dependency into the path the frontend expects
# Clone Nightingale bundle and copy built modules into node_modules
RUN mkdir -p dspa-frontend/node_modules/@dspa-nightingale && \
    git clone --depth 1 https://github.com/DSPAtlas/dspa-nightingale-bundle.git /tmp/nightingale && \
    cp -r /tmp/nightingale/nightingale-sequence dspa-frontend/node_modules/@dspa-nightingale/nightingale-sequence && \
    cp -r /tmp/nightingale/nightingale-structure dspa-frontend/node_modules/@dspa-nightingale/nightingale-structure && \
    cp -r /tmp/nightingale/nightingale-track dspa-frontend/node_modules/@dspa-nightingale/nightingale-track


# Build the frontend React app (now the folder exists)
RUN npm run build --prefix dspa-frontend

# Expose backend port
EXPOSE 8080

# Start backend
CMD ["node", "index.mjs"]
