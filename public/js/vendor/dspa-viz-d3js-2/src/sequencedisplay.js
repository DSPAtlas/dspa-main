//import * as d3 from "../d3.v4.js";
//
import * as d3 from 'd3';

export function highlightSequence(index, sequence, htmlid="#sequenceDisplay") {
    /**
     * Highlight Protein Sequence when hovering over barcode
     * 
     * @param {} index
     * @param {string} sequence
     * @param {string} htmlid 
     */
    
    const sequenceSvg = d3.select(htmlid);
    const charsPerLine = Math.floor((960 - 20) / 7); // assuming each character takes 7px width, adjust based on actual width
    const lineNumber = Math.floor(index / charsPerLine);
    const charInLineIndex = index % charsPerLine;
    const xPosition = 10 + charInLineIndex * 19;
    const yPosition = 30 + lineNumber * 40;

    removeHighlight(); // Clear previous highlights

    sequenceSvg.append("rect")
        .attr("x", xPosition)
        .attr("y", yPosition - 20) // Adjust y position to align with text
        .attr("width", "19px") // Width of one character; adjust as needed
        .attr("height", "30px") // Height of one character line; adjust as needed
        .attr("fill", "yellow")
        .attr("class", "highlight-rect");; // Use a soft color for highlighting

    // Append text on top of the rectangle
    sequenceSvg.append("text")
        .attr("x", xPosition + 4) // Slightly adjust x to center text if necessary
        .attr("y", yPosition)
        .text(sequence[index])
        .attr("font-family", "monospace")
        .attr("font-size", "15px")
        .attr("fill", "black") // Text color
        .attr("class", "highlight-text"); 
}

export function removeHighlight() {
    /**
     * remove highlight
     */
    d3.selectAll(".highlight-rect, .highlight-text").remove();
}

function wrapText(text, width, x, y, lineHeight, htmlid="#sequenceDisplay") {
    const sequenceSvg = d3.select(htmlid);
    let line = [];
    const words = text.split(""); // Split by character for proteins
    let lineNumber = 0;
    let dy = 0;
    let tspan = sequenceSvg.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("font-family", "monospace")
        .attr("font-size", "15px")
        .append("tspan")
        .attr("x", x)
        .attr("y", y);

    words.forEach(function(word) {
        line.push(word);
        tspan.text(line.join(""));
        if (tspan.node().getComputedTextLength() > width) {
            line.pop(); // Remove overflowing word
            tspan.text(line.join(""));
            line = [word];
            tspan = sequenceSvg.select("text").append("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", ++lineNumber * lineHeight + dy + "em")
                .text(word);
        }
    });
}
