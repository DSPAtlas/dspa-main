import '@nightingale-elements/nightingale-sequence@latest';
import '@nightingale-elements/nightingale-track@latest';
import '@nightingale-elements/nightingale-manager@latest';
import '@nightingale-elements/nightingale-navigation@latest';
import '@nightingale-elements/nightingale-colored-sequence@latest';

document.addEventListener('DOMContentLoaded', function() {
    const proteinData = JSON.parse(document.getElementById('protein-data').textContent);

    // get barplot sequence data

    customElements.whenDefined("nightingale-sequence").then(() => {
        const seq = document.querySelector("#sequence");
        seq.data = featuresData.sequence;
      });
      
    customElements.whenDefined("nightingale-colored-sequence").then(() => {
        const coloredSeq = document.querySelector("#colored-sequence");
        coloredSeq.data = featuresData.sequence;
      }); 
      
    customElements.whenDefined("nightingale-track").then(() => {
        // Assuming featuresData is defined elsewhere and has a .features property
        const features = featuresData.features.map((ft) => ({
            ...ft,
            start: ft.start || ft.begin
        }));
    });
    
    const domain = document.querySelector("#domain");
    domain.data = features.filter(({ type }) => type === "DOMAIN");
      
    const region = document.querySelector("#region");
    region.data = features.filter(({ type }) => type === "REGION");
      
    const site = document.querySelector("#site");
    site.data = features.filter(({ type }) => type === "SITE");
      
    const binding = document.querySelector("#binding");
    binding.data = features.filter(({ type }) => type === "BINDING");
     
    const chain = document.querySelector("#chain");
    chain.data = features.filter(({ type }) => type === "CHAIN");
     
    const disulfide = document.querySelector("#disulfide-bond");
    disulfide.data = features.filter(({ type }) => type === "DISULFID");
     
    const betaStrand = document.querySelector("#beta-strand");
    betaStrand.data = features.filter(({ type }) => type === "STRAND");
});