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
    const maxIndex = Math.max(...jsonData.map(row => Math.round(row.pos_end)));
    const len_vector = new Array(maxIndex + 1).fill(0); // +1 because arrays are 0-indexed
    const len_vector_detected = new Array(maxIndex + 1).fill(0);
    const scores = new Array(maxIndex + 1).fill(null);

    // Constants for cutoff values
    const qvalue_cutoff = 0.05;
    const log2FC_cutoff = 0.2;

    // Process JSON data
    jsonData.forEach(row => {
        const start = Math.round(row.pos_start);
        const end = Math.round(row.pos_end);
        const log2FC = !isFinite(row.diff) ? 0 : row.diff;
        const qvalue = row.adj_pval;
        const score = -Math.log10(qvalue) + Math.abs(log2FC);

        for (let i = start; i < end; i++) {
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
    const dataframe_with_vector = len_vector.map((value, index) => ({
        value: value !== 0 ? value : NaN,
        aminoacid: index < proteinSequence.length ? proteinSequence[index] : '?', // '?' as fallback if index exceeds protein sequence length
        score: scores[index]
    }));

    const dataframe_with_vector_detected = len_vector_detected.map((value, index) => ({
        value: (value === 1 && len_vector[index] === 0) ? 0 : NaN,
        aminoacid: index < proteinSequence.length ? proteinSequence[index] : '?'
    }));

    // Combine into an array of objects
    return dataframe_with_vector.map((item, index) => ({
        index: index,
        sig: isNaN(item.value) ? null : item.value,
        aminoacid: item.aminoacid,
        detected: isNaN(dataframe_with_vector_detected[index]) ? null : dataframe_with_vector_detected[index],
        score: item.score
    }));
}
