import db from '../config/database.js'; 

export const findByProteinAccessions = async (pgProteinAccessions) => {
    try {
        const [rows] = await db.query(`
            SELECT * FROM differential_abundance
            WHERE pg_protein_accessions = ?
        `, [pgProteinAccessions]);
        return rows;
    } catch (error) {
        console.error('Error in findByProteinAccessions:', error);
        throw error;
    }
};

import { spawn } from 'child_process';

export const executePythonVisualization = (data) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['../python/generate_plot.py']);

    let svgData = '';
    pythonProcess.stdout.on('data', (data) => {
      svgData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      reject(data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(svgData);
      } else {
        reject(`Python script exited with code ${code}`);
      }
    });

    // Send the data to the Python script
    pythonProcess.stdin.write(JSON.stringify(data));
    pythonProcess.stdin.end();
  });
};