// If adding to an existing routes file


// Or if in a new routes file (organismRoutes.js)
import express from 'express';
import { getAllOrganismNames } from '../controllers/organismController.js';

const router = express.Router();

//router.get('/search', searchOrganisms);
router.get('/names', getAllOrganismNames);

export default router;