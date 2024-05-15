import Joi from 'joi';

import { getProteinFeatures } from '../models/proteinModel.js';
//import { findByProteinAccessions, executePythonVisualization} from '../models/differentialAbundance.js';

// Define Joi validation schema for the query parameters
const querySchema = Joi.object({
  taxonomyID: Joi.number().integer().required(),
  proteinName: Joi.string().trim().required()
});

// request handling
// routing logic
// input validation
// decoupling business logic and data access from the presentation layer 

export const searchProteins = async (req, res) => {
  try {
    // Validate the request query
    const { value, error } = querySchema.validate(req.query);
    if (error) {
      // If validation fails, return a 400 Bad Request response
      return res.status(400).json({ success: false, message: 'Validation error', error: error.details[0].message });
    }

    // Destructure the validated values
    const { taxonomyID, proteinName } = value;

    // Fetch protein features, which includes sequence data and plots
    const result = await getProteinFeatures(taxonomyID, proteinName);

    console.log(JSON.stringify(result.differentialabundanceData))

    // Check if result is not empty
    if (result) {
      res.render('proteinView', {
        success: true,
        proteinName: result.proteinName, // or whichever property has the name
        proteinSequence: result.proteinSequence || "No sequence found",
        differentialabundanceData: JSON.stringify(result.differentialabundanceData),
        //residueLevelPlot: result.residueLevelPlot, // Assuming this is the name used in the result object
        dynamicsPlot: result.dynamicsPlot // Assuming this is the name used in the result object
      });
    } else {
      // Handle case when no results are found
      res.render('proteinView', {
        success: false,
        proteinName: '',
        proteinSequence: "No sequence found",
        differentialabundanceData: JSON.stringify([]),
        residueLevelPlot: '', // Ensure to handle or display a message when no plot is found
        dynamicsPlot: '' // Ensure to handle or display a message when no plot is found
      });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};