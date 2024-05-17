import vizd3js from "@dspa/vizd3js";

if (typeof vizd3js !== 'undefined') {
    vizd3js.initialize();
}

document.addEventListener("DOMContentLoaded", function() {
    // Get the JSON data from the script element and parse it
    const differentialDataElement= document.getElementById('differentialAbundanceData');
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
        vizd3js.plotResidueLevelBarcode(differentialAbundanceData, proteinSequence, residueHtmlid);
        vizd3js.plotDynamicBarcode(differentialAbundanceData, dynamicHtmlid);
    }
    vizd3js.loadAndDisplayProteinStructure(structureHtmlid, "./data/AF-P00925-F1-model_v4.pdb", indicesWithScore);
  });


  // Load and display the initial protein structure
  
  // Add event listener to the button to update highlights
  document.getElementById('updateButton').addEventListener('click', () => {
    const differentialDataElement= document.getElementById('differentialAbundanceData');
    let indicesWithScore = differentialAbundanceData.filter(item => item.score !== null).map(item => item.index);
    vizd3js.updateHighlights(containerId, indicesWithScore);
  });