"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plotDynamicBarcode = plotDynamicBarcode;
exports.plotResidueLevelBarcode = plotResidueLevelBarcode;
var _sequencedisplay = require("./sequencedisplay.js");
var d3 = _interopRequireWildcard(require("d3"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
//import * as d3 from "https://cdn.skypack.dev/d3@6";

function plotDynamicBarcode(data) {
  var htmlid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "svg#dynamicbarcodePlot";
  /**
   * Dynamic Barcode
   * Significantly changing regions (based on defined cut-offs) are coloured in orange,
   * identified (but not changing) regions in grey and identified regions are black.
   * 
   * @param {DataPoint[]} data An array of objects with properties `index`, `sig`, `aminoacid`, `detected`, and `score`.
   * @param {string} htmlid id of html element has to be svg, default svg#dynamicbarcodePlot
   */

  // Select the existing SVG element by its ID and set its dimensions
  var svgContainer = d3.select(htmlid);

  // Ensure SVG has width and height set correctly in HTML
  var width = +svgContainer.attr("width"),
    height = +svgContainer.attr("height");
  var margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    },
    plotWidth = width - margin.left - margin.right,
    plotHeight = height - margin.top - margin.bottom;

  // Clear previous contents if any
  svgContainer.selectAll("*").remove();

  // Append "g" to handle margins
  var svg = svgContainer.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")"));

  // Define the scales
  var x = d3.scaleBand() // Use plotWidth to respect margins
  .domain(data.map(function (d) {
    return d.index;
  })).range([0, plotWidth]).padding(0);
  var colorScaleSig = d3.scaleLinear().domain([0, 1]).range(["black", "red"]);
  var colorScaleDetected = d3.scaleLinear().domain([0, 1]).range(["black", "silver"]);
  svg.selectAll(".dynamicbarcodeBar").data(data).enter().append("rect").attr("x", function (d) {
    return x(d.index);
  }).attr("width", x.bandwidth()).attr("height", plotHeight).attr("fill", function (d) {
    if (d.sig !== null && d.sig !== 0) {
      return colorScaleSig(d.sig); // Significant changes in orange gradient
    } else if (d.detected !== null && d.detected !== 0) {
      return colorScaleDetected(d.detected); // Detected changes in silver gradient
    } else {
      return "black"; // Default color for identified but not significant or detected areas
    }
  }).on("mouseover", function (event, d) {
    var tooltipText = "Sig: ".concat(d.sig || 'N/A', ", Aminoacid: ").concat(d.aminoacid, ", Detected: ").concat(d.detected);
    var textElement = svg.append("text").attr("x", x(d.index) + x.bandwidth() / 2).attr("y", 15).attr("text-anchor", "middle").attr("font-family", "sans-serif").attr("font-size", "12px").attr("fill", "black").text(tooltipText).attr("class", "tooltipText"); // Adding a class for easy removal

    var bbox = textElement.node().getBBox();
    var rect = svg.insert("rect", "text").attr("x", bbox.x - 5).attr("y", bbox.y - 5).attr("width", bbox.width + 10).attr("height", bbox.height + 10).attr("fill", "white").attr("opacity", 0.7).attr("rx", 5) // rounded corners
    .attr("ry", 5).attr("class", "tooltipRect");
    ;
    textElement.raise();
    d3.select(this).attr("stroke", "yellow").attr("stroke-width", 2); // Highlight bar on hover
  }).on("mouseout", function () {
    svg.selectAll(".tooltipText").remove(); // Remove the text elements
    svg.selectAll(".tooltipRect").remove(); // Remove the rectangle elements
    d3.select(this).attr("stroke", "none"); // Remove highlight
  });
}
function plotResidueLevelBarcode(data, proteinSequence) {
  var htmlid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "svg#residuelevelPlot";
  /**
   * ResidueLevel Plot
   * @param {data} data differential abundance data
   * @param {string} proteinSequence 
   * @param {string} htmlid
   */

  var svgContainer = d3.select(htmlid);
  var width = +svgContainer.attr("width"),
    height = +svgContainer.attr("height");
  var margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    },
    plotWidth = width - margin.left - margin.right,
    plotHeight = height - margin.top - margin.bottom;
  svgContainer.selectAll("*").remove();
  var svg = svgContainer.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")"));
  var x = d3.scaleBand() // Use plotWidth to respect margins
  .domain(data.map(function (d) {
    return d.index;
  })).range([0, plotWidth]).padding(0);
  var maxScore = d3.max(data, function (d) {
    return d.score;
  });
  console.log("Max score:", maxScore);
  var colorScale = d3.scaleSequential(d3.interpolateYlOrBr).domain([0, maxScore]);
  svg.selectAll(".residue").data(data).enter().append("rect").attr("class", "residue").attr("x", function (d, i) {
    return x(i);
  }).attr("width", Math.max(1, width / data.length)).attr("height", height).attr("fill", function (d) {
    return isNaN(d.score) ? "silver" : colorScale(d.score);
  }).on("mouseover", function (event, d) {
    return (0, _sequencedisplay.highlightSequence)(d.index, proteinSequence);
  }).on("mouseout", function () {
    d3.select("#tooltip").remove();
    d3.select(this).attr("stroke", "none"); // Remove highlight
  });
}