import vizd3js from "@dspa/vizd3js";

document.addEventListener("DOMContentLoaded", function() {
    // Get the JSON data from the script element and parse it
    const differentialDataElement= [{"pg_protein_accessions": "P00925",
    "pep_grouping_key": "SIVPSGASTGVHEALEMRDEDK",
    "start": 33.0,
    "end": 54.0,
    "pep_type": "fully-tryptic",
    "sequence": "MAVSKVYARSVYDSRGNPTVEVELTTEKGVFRSIVPSGASTGVHEALEMRDEDKSKWMGKGVMNAVNNVNNVIAAAFVKANLDVKDQKAVDDFLLSLDGTANKSKLGANAILGVSMAAARAAAAEKNVPLYQHLADLSKSKTSPYVLPVPFLNVLNGGSHAGGALALQEFMIAPTGAKTFAEAMRIGSEVYHNLKSLTKKRYGASAGNVGDEGGVAPNIQTAEEALDLIVDAIKAAGHDGKVKIGLDCASSEFFKDGKYDLDFKNPESDKSKWLTGVELADMYHSLMKRYPIVSIEDPFAEDDWEAWSHFFKTAGIQIVADDLTVTNPARIATAIEKKAADALLLKVNQIGTLSESIKAAQDSFAANWGVMVSHRSGETEDTFIADLVVGLRTGQIKTGAPARSERLAKLNQLLRIEEELGDKAVYAGENFHHGDKL",
    "length": 437.0,
    "eg_precursor_id": "_SIVPSGASTGVHEALEMRDEDK_.4",
    "go_f": "magnesium ion binding [GO:0000287]; melatonin binding [GO:1904408]; phosphopyruvate hydratase activity [GO:0004634]",
    "comparison": "LiP_OSMO_vs_LiP_CTR",
    "missingness": "complete",
    "diff": 0.199453965016001,
    "CI_2.5": -0.862910859277783,
    "CI_97.5": 1.26181878930979,
    "avg_abundance": 19.8597722074408,
    "t_statistic": 0.46815039105946,
    "pval": 0.657433340000937,
    "adj_pval": 0.735203428082945,
    "B": -7.18473444431397,
    "n_obs": 6},
   {"pg_protein_accessions": "P00925",
    "pep_grouping_key": "SIVPSGASTGVHEALEMRDEDK",
    "start": 33.0,
    "end": 54.0,
    "pep_type": "fully-tryptic",
    "sequence": "MAVSKVYARSVYDSRGNPTVEVELTTEKGVFRSIVPSGASTGVHEALEMRDEDKSKWMGKGVMNAVNNVNNVIAAAFVKANLDVKDQKAVDDFLLSLDGTANKSKLGANAILGVSMAAARAAAAEKNVPLYQHLADLSKSKTSPYVLPVPFLNVLNGGSHAGGALALQEFMIAPTGAKTFAEAMRIGSEVYHNLKSLTKKRYGASAGNVGDEGGVAPNIQTAEEALDLIVDAIKAAGHDGKVKIGLDCASSEFFKDGKYDLDFKNPESDKSKWLTGVELADMYHSLMKRYPIVSIEDPFAEDDWEAWSHFFKTAGIQIVADDLTVTNPARIATAIEKKAADALLLKVNQIGTLSESIKAAQDSFAANWGVMVSHRSGETEDTFIADLVVGLRTGQIKTGAPARSERLAKLNQLLRIEEELGDKAVYAGENFHHGDKL",
    "length": 437.0,
    "eg_precursor_id": "_SIVPSGASTGVHEALEM[Oxidation (M)]RDEDK_.3",
    "go_f": "magnesium ion binding [GO:0000287]; melatonin binding [GO:1904408]; phosphopyruvate hydratase activity [GO:0004634]",
    "comparison": "LiP_OSMO_vs_LiP_CTR",
    "missingness": "complete",
    "diff": -0.369419859944415,
    "CI_2.5": -0.852699475178555,
    "CI_97.5": 0.113859755289726,
    "avg_abundance": 19.7679215195463,
    "t_statistic": -1.90606699414335,
    "pval": 0.109035057487218,
    "adj_pval": 0.184111305766528,
    "B": -5.67078344971566,
    "n_obs": 6},
   {"pg_protein_accessions": "P00925",
    "pep_grouping_key": "SIVPSGASTGVHEALEMRDEDK",
    "start": 33.0,
    "end": 54.0,
    "pep_type": "fully-tryptic",
    "sequence": "MAVSKVYARSVYDSRGNPTVEVELTTEKGVFRSIVPSGASTGVHEALEMRDEDKSKWMGKGVMNAVNNVNNVIAAAFVKANLDVKDQKAVDDFLLSLDGTANKSKLGANAILGVSMAAARAAAAEKNVPLYQHLADLSKSKTSPYVLPVPFLNVLNGGSHAGGALALQEFMIAPTGAKTFAEAMRIGSEVYHNLKSLTKKRYGASAGNVGDEGGVAPNIQTAEEALDLIVDAIKAAGHDGKVKIGLDCASSEFFKDGKYDLDFKNPESDKSKWLTGVELADMYHSLMKRYPIVSIEDPFAEDDWEAWSHFFKTAGIQIVADDLTVTNPARIATAIEKKAADALLLKVNQIGTLSESIKAAQDSFAANWGVMVSHRSGETEDTFIADLVVGLRTGQIKTGAPARSERLAKLNQLLRIEEELGDKAVYAGENFHHGDKL",
    "length": 437.0,
    "eg_precursor_id": "_SIVPSGASTGVHEALEMRDEDK_.3",
    "go_f": "magnesium ion binding [GO:0000287]; melatonin binding [GO:1904408]; phosphopyruvate hydratase activity [GO:0004634]",
    "comparison": "LiP_OSMO_vs_LiP_CTR",
    "missingness": "complete",
    "diff": 0.945065215039929,
    "CI_2.5": 0.612813102426616,
    "CI_97.5": 1.27731732765324,
    "avg_abundance": 20.9338578171152,
    "t_statistic": 7.09268097664737,
    "pval": 0.0005466468471803,
    "adj_pval": 0.0073130362905088,
    "B": 0.135554845761708,
    "n_obs": 6}]

    console.log(JSON.stringify(differentialDataElement))

    //const differentialDataElement= document.getElementById('differentialabundanceData');
    if (!differentialDataElement) {
      console.error('Element with id "differentialabundanceData" not found.');
      return;
    }
    //console.log(JSON.parse(differentialDataElement.textContent))
    //const differentialabundanceData= JSON.parse(differentialDataElement);
  
    // Get the protein sequence from the script element
    const sequenceElement = document.getElementById('proteinSequence');
    if (!sequenceElement) {
      console.error('Element with id "proteinSequence" not found.');
      return;
    }
    const proteinSequence = sequenceElement.textContent;
  
    // ID of the SVG element where the plot will be rendered
    const residueHtmlid = "svg#residuelevelPlot";
  
    // Call the function to plot the data
    if (differentialabundanceData.length > 0) {
      vizd3js.plotResidueLevelBarcode(differentialabundanceData, proteinSequence, residueHtmlid);
    }
  });