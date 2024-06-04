import { vizd3js } from "./vendor/dspa-viz-d3js-2/lib/index.js";

document.addEventListener("DOMContentLoaded", function() {
    // Get the JSON data from the script element and parse it
    const differentialDataElement= document.getElementById('differentialAbundanceData');
   
    const proteinDataElement = document.getElementById('proteinData');
    const proteinId = proteinDataElement.getAttribute('data-protein-name');
    console.log("proteinid 1");
    console.log(proteinId);

    if (!differentialDataElement) {
      console.error('Element with id "differentialAbundanceData" not found.');
      return;
    }
    //console.log(JSON.parse(differentialDataElement.textContent))
    const differentialAbundanceData = JSON.parse(differentialDataElement.textContent);

    // Get the protein sequence from the script element
    const sequenceElement = document.getElementById('proteinSequence');
    if (!sequenceElement) {
      console.error('Element with id "proteinSequence" not found.');
      return;
    }
    const proteinSequence = sequenceElement.textContent;
  
    // ID of the SVG element where the plot will be rendered
    const residueHtmlid = "svg#residuelevelPlot";
    const dynamicHtmlid = "svg#dynamicPlot";
    const structureHtmlid = "#structureViewer";
    
    let indicesWithScore = [];

    console.log(differentialAbundanceData);
    // Call the function to plot the data
    if (differentialAbundanceData.length > 0) {
        console.log('vizd3js object:', vizd3js);
        vizd3js.plotResidueLevelBarcode(differentialAbundanceData, proteinSequence, residueHtmlid);
        vizd3js.plotDynamicBarcode(differentialAbundanceData, dynamicHtmlid);
    }

    fetchAndDisplayProtein(proteinId, structureHtmlid, indicesWithScore);
  });

function initialize3DMol(pdbData) {
    glviewer = window.$3Dmol.createViewer($("#gldiv"), {
        defaultcolors: $3Dmol.rasmolElementColors
    });

    $.ajax({
        url: pdbData,
        success: function(data) {
            glviewer.addModel(data, "pdb");
            glviewer.zoomTo();
            glviewer.setStyle({}, { cartoon: {color: "grey"} });
            glviewer.render();
            glviewer.setBackgroundColor(0xffffff);
        },
        error: function() {
            console.error("Failed to load PDB file.");
        }
    });
}


  function fetchAndDisplayProtein(proteinId, structureHtmlid, indicesWithScore) {
    const url = `/proteinstruct/${proteinId}`; // URL to your server endpoint

    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text(); // Assuming the server sends the .pdb file content as plain text
    })
    .then(pdbData => {
      console.log(pdbData);
      initialize3DMol(pdbData);
      vizd3js.loadAndDisplayProteinStructure(structureHtmlid, pdbData, indicesWithScore);
    })
    .catch(e => {
        console.error("Failed to load protein data:", e);
    });
}


  // Load and display the initial protein structure
  
  // Add event listener to the button to update highlights
  document.getElementById('updateButton').addEventListener('click', () => {
    const differentialDataElement= document.getElementById('differentialAbundanceData');
    let indicesWithScore = differentialAbundanceData.filter(item => item.score !== null).map(item => item.index);
    updateHighlights(containerId, indicesWithScore);
  });