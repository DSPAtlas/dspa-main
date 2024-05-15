import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import debug from 'debug';

import homeRoutes from './src/routes/homeRoutes.js';
import proteinRoutes from './src/routes/proteinRoutes.js';

const startupDebugger = debug.default('app:startup');
const dbDebugger = debug.default('app:db');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', './src/views');
// Serve static files from the 'dist' directory
app.use(express.static('dist'));
app.use(express.static('public'));

app.use(express.json());
app.use(helmet());

console.log('Environment:', app.get('env'));

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug('app:startup')('Morgan enabled...');
}

app.use('/', homeRoutes); // Use the home routes for the root URL
app.use('/api/v1/proteins', proteinRoutes);

app.get('/search', (req, res) => {
    const { taxonomyID, proteinName } = req.query;

    // Validate the parameters as needed
    // For simplicity, assuming they're valid and present

    // Redirect to the proteins route with query parameters
    res.redirect(`/api/v1/proteins?taxonomyID=${encodeURIComponent(taxonomyID)}&proteinName=${encodeURIComponent(proteinName)}`);
});

dbDebugger('Connected to the database...');

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

