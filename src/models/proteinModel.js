import db from '../config/database.js';
import { spawn } from 'child_process';
import {plotResidueLevelBarcode} from "dspa-viz-d3js-2";

// data handling CRUD 
// business logic
// data validation
// abstraction

export const getDifferentialAbundanceByAccession = async (pgProteinAccessions) => {
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

export const extractProteinAccession = (proteinName) => {
  const match = proteinName.match(/^[^|]*\|([^|]+)\|/);
  if (match) {
      return match[1]; // Returns the extracted accession part
  } else {
      throw new Error(`Protein name "${proteinName}" does not match the expected format.`);
  }
};

export const getBarPlotsFromPythonScript = (data) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['src/python/generate_plot.py']);

    let svgData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      svgData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString(); // Accumulate error data
    });

    console.log(errorData)
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(svgData);
      } else {
        console.error(`Python script exited with code ${code}`);
        console.error(`stderr: ${errorData}`); // Log all accumulated error data
        reject(`Python script exited with code ${code}, stderr: ${errorData}`);
      }
    });

    // Send the data to the Python script
    pythonProcess.stdin.write(JSON.stringify(data));
    pythonProcess.stdin.end();
  });
};

export const findProteinByOrganismAndName = async(taxonomyID, proteinName) => {
  try {
    const query = `SELECT seq, protein_name, protein_description FROM organism_proteome_entries WHERE taxonomy_id = ? AND protein_name LIKE ?`;
    const [rows] = await db.query(query, [taxonomyID, `%${proteinName}%`]);
    return rows;
  } catch (error) {
    throw error; // Propagate the error
  }
};

export const getProteinFeatures = async(taxonomyID, proteinName) => {
  try {
    // look for protein
    const fastaEntries = await findProteinByOrganismAndName(taxonomyID, proteinName);
    if (fastaEntries.length === 0) {
      throw new Error("No protein found for the given taxonomy ID and protein name.");
    }
    const fastaEntry = fastaEntries[0];

    // extract protein accession
    const pgProteinAccession = extractProteinAccession(fastaEntry.protein_name); 
    // get differential abundance
    const differentialAbundance = await getDifferentialAbundanceByAccession(pgProteinAccession);
    
    // Prepare data for Python script
    const dataForPythonScript = {
      proteinName: pgProteinAccession,
      sequence: fastaEntry.seq,
      LiPDataFrame: JSON.stringify(differentialAbundance) // Assuming differentialAbundance is in the correct format; adjust as needed
    };

    console.log(JSON.stringify(dataForPythonScript));

    // Get bar plots - Executes the Python script once and expects both plots in return
    const plots = await getBarPlotsFromPythonScript(dataForPythonScript);

    let residueLevelPlot = '';
    let dynamicsPlot = '';
    // Listen for standard output data from the Python script
    try {
      const plotsData = JSON.parse(plots); // Attempt to parse the JSON string
      residueLevelPlot = plotsData.residueLevelPlot;
      dynamicsPlot = plotsData.dynamicsPlot;
      // Further processing...
    } catch (error) {
      console.error("Failed to parse plots data:", error);
    }

    // Compile results including the plots
    const result = {
      proteinName: pgProteinAccession,
      sequence: fastaEntry.seq,
      data: JSON.stringify(differentialAbundance),
      // ...fastaEntry,
      residueLevelPlot: residueLevelPlot, // Assuming this is how the plots are named in the Python script output
      dynamicsPlot: dynamicsPlot
    };

    return result;
  } catch (error) {
    console.error("Error in getProteinFeatures:", error.message);
    throw error; // Rethrow the error to be handled by the caller
  }
};
  