import db from '../config/database.js'; // Adjust the path according to your project structure

export const findAllOrganismNames = async () => {
  try {
    // Execute a query to select all organism names
    const [rows] = await db.query('SELECT organism_name FROM organism');
    // Extract just the organism names into an array
    const organismNames = rows.map(row => row.organism_name);
    return organismNames;
  } catch (error) {
    throw error; // Propagate the error
  }
};