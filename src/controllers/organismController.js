import { findAllOrganismNames } from '../models/organismModel.js'; // Adjust path as necessary

export const getAllOrganismNames = async (req, res) => {
  try {
    const organismNames = await findAllOrganismNames();
    res.json({ success: true, data: organismNames });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};