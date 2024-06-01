"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vizd3js = void 0;
var d3 = _interopRequireWildcard(require("d3"));
var _barcode = require("./barcode.js");
var _utils = require("./utils.js");
var _structure3d = require("./structure3d.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
// src/main.js
//import * as $3Dmol from '3dmol'; // Ensure this points to the correct alias

// Access the global variable defined by the UMD module
//const $3Dmol = window['3Dmol'];
//-import 'jquery';
//-import $3Dmol from '../3Dmol-min.js';

var vizd3js = exports.vizd3js = {
  prepareData: _utils.prepareData,
  plotDynamicBarcode: _barcode.plotDynamicBarcode,
  plotResidueLevelBarcode: _barcode.plotResidueLevelBarcode,
  loadAndDisplayProteinStructure: _structure3d.loadAndDisplayProteinStructure
};