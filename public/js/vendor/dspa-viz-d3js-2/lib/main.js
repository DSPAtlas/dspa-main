"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _dmol = _interopRequireDefault(require("3dmol"));
var _barcode = require("./barcode.js");
var _utils = require("./utils.js");
var _structure3d = require("./structure3d.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// src/main.js

// Export $3Dmol to make it available globally if needed
window.$3Dmol = _dmol["default"];
var vizd3js = {
  prepareData: _utils.prepareData,
  plotDynamicBarcode: _barcode.plotDynamicBarcode,
  plotResidueLevelBarcode: _barcode.plotResidueLevelBarcode,
  loadAndDisplayProteinStructure: _structure3d.loadAndDisplayProteinStructure
};
var _default = exports["default"] = vizd3js;