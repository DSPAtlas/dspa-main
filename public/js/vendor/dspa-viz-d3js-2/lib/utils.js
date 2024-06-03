function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
export function prepareData(jsonData, proteinSequence) {
  /**
   * Prepare data for barcode visualitzation
   * 
   * @param {json} jsonData
   * @param {string} proteinSequence
   * 
   * @typedef {Object} DataPoint
   * @property {number} index - The position of the item in the original data structure.
   * @property {number|null} sig - The numerical value from `item.value` or `null` if `item.value` is NaN.
   * @property {string} aminoacid - The amino acid represented by a string.
   * @property {number|null} detected - The numerical value from `dataframe_with_vector_detected` at the corresponding index or `null` if it is NaN.
   * @property {number} score - The score value from `item.score`.
   *
   * @returns {DataPoint[]} An array of objects with properties `index`, `sig`, `aminoacid`, `detected`, and `score`.
   */

  // Determine the required size for vectors based on the maximum "end" value in the data
  var maxIndex = Math.max.apply(Math, _toConsumableArray(jsonData.map(function (row) {
    return Math.round(row.pos_end);
  })));
  var len_vector = new Array(maxIndex + 1).fill(0); // +1 because arrays are 0-indexed
  var len_vector_detected = new Array(maxIndex + 1).fill(0);
  var scores = new Array(maxIndex + 1).fill(null);

  // Constants for cutoff values
  var qvalue_cutoff = 0.05;
  var log2FC_cutoff = 0.2;

  // Process JSON data
  jsonData.forEach(function (row) {
    var start = Math.round(row.pos_start);
    var end = Math.round(row.pos_end);
    var log2FC = !isFinite(row.diff) ? 0 : row.diff;
    var qvalue = row.adj_pval;
    var score = -Math.log10(qvalue) + Math.abs(log2FC);
    for (var i = start; i < end; i++) {
      if (i < len_vector.length) {
        scores[i] = score;
        if (qvalue < qvalue_cutoff && Math.abs(log2FC) > log2FC_cutoff) {
          len_vector[i] = len_vector[i] !== 0 ? (len_vector[i] + log2FC) / 2 : log2FC;
        } else {
          len_vector_detected[i] = 1;
        }
      }
    }
  });

  // Create output arrays
  var dataframe_with_vector = len_vector.map(function (value, index) {
    return {
      value: value !== 0 ? value : NaN,
      aminoacid: index < proteinSequence.length ? proteinSequence[index] : '?',
      // '?' as fallback if index exceeds protein sequence length
      score: scores[index]
    };
  });
  var dataframe_with_vector_detected = len_vector_detected.map(function (value, index) {
    return {
      value: value === 1 && len_vector[index] === 0 ? 0 : NaN,
      aminoacid: index < proteinSequence.length ? proteinSequence[index] : '?'
    };
  });

  // Combine into an array of objects
  return dataframe_with_vector.map(function (item, index) {
    return {
      index: index,
      sig: isNaN(item.value) ? null : item.value,
      aminoacid: item.aminoacid,
      detected: isNaN(dataframe_with_vector_detected[index]) ? null : dataframe_with_vector_detected[index],
      score: item.score
    };
  });
}