import dspa_viz_py as viz
import json
import sys
import pandas as pd
from io import StringIO


# Function to capture SVG content from a matplotlib figure
def fig_to_svg(fig):
    import io
    figfile = io.BytesIO()
    fig.savefig(figfile, format='svg')
    figfile.seek(0)
    svg_data = figfile.getvalue().decode('utf-8')
    return svg_data

# Read the data sent from Node.js
data = sys.stdin.read()
parsed_data = json.loads(data)

# Extract parameters
proteinName = parsed_data['proteinName']
seq = parsed_data['sequence']

lip_data_json_str = json.loads(parsed_data['LiPDataFrame'])

# Read the JSON data into a DataFrame
LiPDataFrame = pd.DataFrame(lip_data_json_str)

plotter = viz.BarcodePlotter(prot=proteinName, lipdf=LiPDataFrame, aa_seq=seq)

# Generate plots
residue_level_fig = plotter.plot_residuelevel_barcode(qvalue_cutoff=0.05, log2FC_cutoff=0.2, save_as_svg=False)
dynamics_fig = plotter.plot_dynamics_barcode(qvalue_cutoff=0.05, log2FC_cutoff=0.2, save_as_svg=False)

# Convert figures to SVG
residue_level_svg = fig_to_svg(residue_level_fig)
dynamics_svg = fig_to_svg(dynamics_fig)

# Output both SVG plots as JSON
output = json.dumps({'residueLevelPlot': residue_level_svg, 'dynamicsPlot': dynamics_svg})
print(output)
