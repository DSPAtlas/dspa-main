import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import debug from 'debug';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import https from 'https';


import proteinRoutes from './dspa-backend/routes/proteinRoutes.js';
import searchRoutes from './dspa-backend/routes/searchRoutes.js';
import allExperimentsRoutes from './dspa-backend/routes/allExperimentsRoutes.js';
import experimentRoutes from './dspa-backend/routes/experimentRoutes.js';
import treatmentRoutes from './dspa-backend/routes/treatmentRoutes.js';

const startupDebugger = debug.default('app:startup');
const dbDebugger = debug.default('app:db');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// SSL Options


// Middlewares
app.use(express.json());

// Serve the static files from the React app
const frontendPath = path.join(__dirname, 'dspa-frontend/build');
app.use(express.static(frontendPath));

app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https://alphafold.ebi.ac.uk"],
        connectSrc: ["'self'", "https://alphafold.ebi.ac.uk", 
          "http://localhost:3000",  
          "http://localhost:8080", 
          "https://localhost:8081",
          "https://rest.uniprot.org", 
          "https://www.ebi.ac.uk", "https://rest.kegg.jp"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
        workerSrc: ["'self'", "blob:"]
      },
    },
  }));

console.log('Environment:', app.get('env'));

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled...');
}

app.use(cors());

//app.use('/', homeRoutes); 
app.use('/api/v1/proteins', proteinRoutes);
app.use('/api/v1/experiments', allExperimentsRoutes);
app.use('/api/v1/experiment', experimentRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/treatment', treatmentRoutes);

// Catch-all route for React frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/dspa-frontend/build', 'index.html'));
});

dbDebugger('Connected to the database...');

if (app.get('env') === 'development') {
  app.listen(PORT, () => {
      console.log(`HTTP Server is running on port ${PORT}`);
  });
} else {
  const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'nginx.key')), // Path to your private key
    cert: fs.readFileSync(path.join(__dirname, 'nginx.crt')), // Path to your certificate
};

  https.createServer(sslOptions, app).listen(PORT, '0.0.0.0', () => {
      console.log(`HTTPS Server is running on port ${PORT}`);
  });
}
