//import * as ThreeDmol from '../node_modules/3dmol/build/3Dmol-min.js';
//import * as jQuery from '../jquery36.js';

export async function loadAndDisplayProteinStructure(containerId, pdbUri, indicesList) {
    let element = document.querySelector(containerId);
    
    if (!element) {
        console.error("Container not found:", containerId);
        return;
    }

    let config = { backgroundColor: 'white' };
    let viewer = window.$3Dmol.createViewer(element, config);

    jQuery.ajax(pdbUri, {
        success: function(data) {
            let v = viewer;
            v.addModel(data, "pdb");
            v.setStyle({}, {cartoon: {color: 'grey'}});  /* style all atoms */
            v.setStyle({resi: indicesList}, {cartoon: {color: 'red'}});
            v.zoomTo();                                      /* set camera */
            v.render();                                      /* render scene */
            v.zoom(1.2, 1000);                               /* slight zoom */
            element.viewer = v;
        },
        error: function(hdr, status, err) {
            console.error("Failed to load PDB " + pdbUri + ": " + err);
        },
    });
}

export function updateHighlights(containerId, indicesList) {
    let element = document.querySelector(containerId);
    if (!element || !element.viewer) {
        console.error("Viewer not found in container:", containerId);
        return;
    }

    let viewer = element.viewer;
    viewer.setStyle({}, {cartoon: {color: 'grey'}});  /* reset style for all atoms */
    viewer.setStyle({resi: indicesList}, {cartoon: {color: 'red'}});
    viewer.render();                                  /* render scene */
}