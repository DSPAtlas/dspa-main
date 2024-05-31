import * as d3 from "../d3v6.js";
import {highlightSequence} from "./sequencedisplay.js";
//import * as d3 from 'd3';

export function plotDynamicBarcode(data, htmlid = "svg#dynamicbarcodePlot"){
    /**
     * Dynamic Barcode
     * Significantly changing regions (based on defined cut-offs) are coloured in orange,
     * identified (but not changing) regions in grey and identified regions are black.
     * 
     * @param {DataPoint[]} data An array of objects with properties `index`, `sig`, `aminoacid`, `detected`, and `score`.
     * @param {string} htmlid id of html element has to be svg, default svg#dynamicbarcodePlot
     */

    // Select the existing SVG element by its ID and set its dimensions
    const svgContainer = d3.select(htmlid);

    // Ensure SVG has width and height set correctly in HTML
    const width = +svgContainer.attr("width"),
          height = +svgContainer.attr("height");

    const margin = {top: 20, right: 20, bottom: 20, left: 20},
          plotWidth = width - margin.left - margin.right,
          plotHeight = height - margin.top - margin.bottom;

    // Clear previous contents if any
    svgContainer.selectAll("*").remove();

    // Append "g" to handle margins
    const svg = svgContainer.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define the scales
    const x = d3.scaleBand() // Use plotWidth to respect margins
        .domain(data.map(d => d.index))
        .range([0, plotWidth])  
        .padding(0);  
 
    const colorScaleSig = d3.scaleLinear()
        .domain([0, 1])
        .range(["black", "red"]);

    const colorScaleDetected = d3.scaleLinear()
        .domain([0, 1])
        .range(["black", "silver"]);

    svg.selectAll(".dynamicbarcodeBar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.index))
        .attr("width", x.bandwidth())
        .attr("height", plotHeight)
        .attr("fill", d => {
            if (d.sig !== null && d.sig !== 0) {
                return colorScaleSig(d.sig);  // Significant changes in orange gradient
            } else if (d.detected !== null && d.detected !== 0) {
                return colorScaleDetected(d.detected);  // Detected changes in silver gradient
            } else {
                return "black";  // Default color for identified but not significant or detected areas
            }})
        .on("mouseover", function(event, d) {
            const tooltipText = `Sig: ${d.sig || 'N/A'}, Aminoacid: ${d.aminoacid}, Detected: ${d.detected}`;
            const textElement = svg.append("text")
                .attr("x", x(d.index) + x.bandwidth() / 2)
                .attr("y", 15)
                .attr("text-anchor", "middle")
                .attr("font-family", "sans-serif")
                .attr("font-size", "12px")
                .attr("fill", "black")
                .text(tooltipText)
                .attr("class", "tooltipText");  // Adding a class for easy removal

            const bbox = textElement.node().getBBox();
            const rect = svg.insert("rect", "text")
                .attr("x", bbox.x - 5)
                .attr("y", bbox.y - 5)
                .attr("width", bbox.width + 10)
                .attr("height", bbox.height + 10)
                .attr("fill", "white")
                .attr("opacity", 0.7)
                .attr("rx", 5) // rounded corners
                .attr("ry", 5)
                .attr("class", "tooltipRect");;

            textElement.raise();
            d3.select(this).attr("stroke", "yellow").attr("stroke-width", 2); // Highlight bar on hover
            })
        .on("mouseout", function() {
            svg.selectAll(".tooltipText").remove();  // Remove the text elements
            svg.selectAll(".tooltipRect").remove();  // Remove the rectangle elements
            d3.select(this).attr("stroke", "none"); // Remove highlight
         });
       
}

export function plotResidueLevelBarcode(data, proteinSequence, htmlid="svg#residuelevelPlot"){
    /**
     * ResidueLevel Plot
     * @param {data} data differential abundance data
     * @param {string} proteinSequence 
     * @param {string} htmlid
     */

    const svgContainer = d3.select(htmlid);

    const width = +svgContainer.attr("width"),
        height = +svgContainer.attr("height");

    const margin = {top: 20, right: 20, bottom: 20, left: 20},
        plotWidth = width- margin.left - margin.right,
        plotHeight = height - margin.top - margin.bottom;
    
    svgContainer.selectAll("*").remove();

    const svg = svgContainer.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    const x = d3.scaleBand() // Use plotWidth to respect margins
        .domain(data.map(d => d.index))
        .range([0, plotWidth])  
        .padding(0);  
    
    const maxScore = d3.max(data, d => d.score);
    console.log("Max score:", maxScore); 

    const colorScale = d3.scaleSequential(d3.interpolateYlOrBr)
        .domain([0, maxScore]);
    
    svg.selectAll(".residue")
        .data(data)
        .enter().append("rect")
        .attr("class", "residue")
        .attr("x", (d, i) => x(i))
        .attr("width", Math.max(1, width / data.length))
        .attr("height", height)
        .attr("fill", d => isNaN(d.score) ? "silver" : colorScale(d.score))
        .on("mouseover", (event, d) => highlightSequence(d.index, proteinSequence))
        .on("mouseout", function() {
            d3.select("#tooltip").remove();
            d3.select(this).attr("stroke", "none"); // Remove highlight
         });

    }
