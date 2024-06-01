// src/main.js
//import * as $3Dmol from '3dmol'; // Ensure this points to the correct alias

// Access the global variable defined by the UMD module
//const $3Dmol = window['3Dmol'];
//-import 'jquery';
//-import $3Dmol from '../3Dmol-min.js';

import {plotDynamicBarcode, plotResidueLevelBarcode} from "./barcode.js";
import {prepareData} from "./utils.js";
import {loadAndDisplayProteinStructure} from "./structure3d.js";

const vizd3js = {
    prepareData,
    plotDynamicBarcode,
    plotResidueLevelBarcode,
    loadAndDisplayProteinStructure
}

export { vizd3js };