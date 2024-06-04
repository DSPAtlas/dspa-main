import express from 'express';
import path from 'path'; 
import { fileURLToPath } from 'url';

// Derive __dirname in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));


const router = express.Router();

router.get('/:proteinId', (req, res) => {
    const { proteinId } = req.params;
    const filePath = path.join( __dirname, "temp_db/UP000002311_559292_YEAST_v4",  `AF-${proteinId}-F1-model_v4.pdb`)
    console.log(filePath);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('File not found');
        }
    });
});

// Handle requests to /proteinstruct/
router.get('/', (req, res) => {
    res.send('Please specify a protein ID.');
});


export default router;