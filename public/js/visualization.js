import { vizd3js } from "./vendor/dspa-viz-d3js-2/lib/index.js";

let glviewer;
let labels = [];

document.addEventListener("DOMContentLoaded", function() {
    // Get the JSON data from the script element and parse it
    const differentialDataElement= document.getElementById('differentialAbundanceData');
    const proteinDataElement = document.getElementById('proteinData');
    const proteinId = proteinDataElement.getAttribute('data-protein-name');
    const sequenceElement = document.getElementById('proteinSequence');

    if (!differentialDataElement) {
      console.error('Element with id "differentialAbundanceData" not found.');
      return;
    }
    if (!sequenceElement) {
      console.error('Element with id "proteinSequence" not found.');
      return;
    }

    const differentialAbundanceData = JSON.parse(differentialDataElement.textContent);
    const proteinSequence = sequenceElement.textContent;
    // ID of the SVG element where the plot will be rendered
    const residueHtmlid = "svg#residuelevelPlot";
    const dynamicHtmlid = "svg#dynamicPlot";
    const structureHtmlid = "#structureViewer";
    
    let indicesWithScore = [];


    // Call the function to plot the data
    if (differentialAbundanceData.length > 0) {
        console.log('vizd3js object:', vizd3js);
        vizd3js.plotResidueLevelBarcode(differentialAbundanceData, proteinSequence, residueHtmlid);
        vizd3js.plotDynamicBarcode(differentialAbundanceData, dynamicHtmlid);
        indicesWithScore = differentialAbundanceData.filter(item => item.score !== null).map(item => item.index);
    }
   

    fetchAndDisplayProtein(proteinId, structureHtmlid, indicesWithScore);
    const button1 = document.getElementById('viewFunction1');
    const button2 = document.getElementById('viewFunction2');
    const button3 = document.getElementById('viewFunction3');

    button1.addEventListener('click', function () {
        applyFunction1(v);
    });

    button2.addEventListener('click', function () {
        window.addResidueLevel(indicesWithScore);
    });

    button3.addEventListener('click', function () {
        window.addLabels();
    });

  });



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
      initialize3DMol(pdbData);
    })
    .catch(e => {
        console.error("Failed to load protein data:", e);
    });
};




// --------------------------------------------------------------------------------------------------------------------
// -- 3D Structure Buttons --------------------------------------------------------------------------------------------

window.addLabels = function () {
  if (!glviewer || !glviewer.getModel) {
    console.error("glviewer is not initialized.");
    return; 
  }
  var atoms = glviewer.getModel().selectedAtoms({ atom: "CA" });
  for (var a in atoms) {
      var atom = atoms[a];
      var l = glviewer.addLabel(atom.resn + " " + atom.resi, {
            inFront: true,
            fontSize: 12,
            position: { x: atom.x, y: atom.y, z: atom.z }
        });
      labels.push({ label: l, atom: atom });
    }
};


window.colorSS = function () {
  var m = glviewer.getModel();
  m.setColorByFunction({}, function (atom) {
      if (atom.ss === 'h') return "magenta";
      else if (atom.ss === 's') return "orange";
      else return "white";
  });
  glviewer.render();
};

window.addResidueLevel = function (indicesWithScore) {
  var m = glviewer.getModel();
  glviewer.setStyle({chain: "A", resi: 50}, {cartoon: {color: 'red'}});
  glviewer.setStyle({resi: indicesWithScore}, {cartoon: {color: 'red'}});
  glviewer.setStyle({resi: 21}, {cartoon: {color: 'red'}});
  glviewer.render();
};





// --------------------------------------------------------------------------------------------------------------------
// -- 3D Structure Initalize ------------------------------------------------------------------------------------------

function initialize3DMol(pdbData) {
  glviewer = window.$3Dmol.createViewer($("#gldiv"), {
      defaultcolors: window.$3Dmol.rasmolElementColors
  });
  glviewer.addModel(pdbData, "pdb");
  glviewer.zoomTo();
  glviewer.setStyle({}, { cartoon: {color: "grey"} });
  glviewer.render();
  glviewer.setBackgroundColor(0xffffff);
};

