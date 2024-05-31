"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.highlightSequence = highlightSequence;
exports.removeHighlight = removeHighlight;
var d3 = _interopRequireWildcard(require("d3"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
//import * as d3 from "https://cdn.skypack.dev/d3@6";

function highlightSequence(index, sequence) {
  var htmlid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "#sequenceDisplay";
  /**
   * Highlight Protein Sequence when hovering over barcode
   * 
   * @param {} index
   * @param {string} sequence
   * @param {string} htmlid 
   */

  var sequenceSvg = d3.select(htmlid);
  var charsPerLine = Math.floor((960 - 20) / 7); // assuming each character takes 7px width, adjust based on actual width
  var lineNumber = Math.floor(index / charsPerLine);
  var charInLineIndex = index % charsPerLine;
  var xPosition = 10 + charInLineIndex * 19;
  var yPosition = 30 + lineNumber * 40;
  removeHighlight(); // Clear previous highlights

  sequenceSvg.append("rect").attr("x", xPosition).attr("y", yPosition - 20) // Adjust y position to align with text
  .attr("width", "19px") // Width of one character; adjust as needed
  .attr("height", "30px") // Height of one character line; adjust as needed
  .attr("fill", "yellow").attr("class", "highlight-rect");
  ; // Use a soft color for highlighting

  // Append text on top of the rectangle
  sequenceSvg.append("text").attr("x", xPosition + 4) // Slightly adjust x to center text if necessary
  .attr("y", yPosition).text(sequence[index]).attr("font-family", "monospace").attr("font-size", "15px").attr("fill", "black") // Text color
  .attr("class", "highlight-text");
}
function removeHighlight() {
  /**
   * remove highlight
   */
  d3.selectAll(".highlight-rect, .highlight-text").remove();
}
function wrapText(text, width, x, y, lineHeight) {
  var htmlid = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "#sequenceDisplay";
  var sequenceSvg = d3.select(htmlid);
  var line = [];
  var words = text.split(""); // Split by character for proteins
  var lineNumber = 0;
  var dy = 0;
  var tspan = sequenceSvg.append("text").attr("x", x).attr("y", y).attr("font-family", "monospace").attr("font-size", "15px").append("tspan").attr("x", x).attr("y", y);
  words.forEach(function (word) {
    line.push(word);
    tspan.text(line.join(""));
    if (tspan.node().getComputedTextLength() > width) {
      line.pop(); // Remove overflowing word
      tspan.text(line.join(""));
      line = [word];
      tspan = sequenceSvg.select("text").append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
    }
  });
}