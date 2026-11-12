# DSPA workspace overview

This document lists all 23 non-hidden folders directly under the workspace root
(`dspa/`), with a brief description of their contents. Links are relative to this
file in `dspa-main/`. Hidden folders and root-level files are omitted.

| Folder | Approximate contents |
| --- | --- |
| [3D_distance_analysis/](../3D_distance_analysis/) | Jupyter notebook for calculating distances between peptides, or between peptides and ligands, in protein structures. Includes example PDB and AlphaFold structures. |
| [3Dmol.js/](../3Dmol.js/) | WebGL molecular visualization library: JavaScript/TypeScript source, distribution builds, Python bindings (`py3Dmol`), examples, tutorials, documentation, and tests. |
| [Barcode_visualization/](../Barcode_visualization/) | Jupyter notebook for visualizing limited proteolysis (LiP) data as structural barcodes, with a README. |
| [Coverage_plot/](../Coverage_plot/) | Jupyter notebook for plotting peptide coverage along protein sequences, with optional structural and functional annotations. |
| [GO_enrichement/](../GO_enrichement/) | Gene Ontology enrichment analysis notebook, yeast identifier mappings, and yeast/human gene annotation files. |
| [LiP_scores_mapping_3D/](../LiP_scores_mapping_3D/) | Python script for mapping LiP scores onto 3D protein structures, with example scores, an example image, and documentation. |
| [OSMO_RMD/](../OSMO_RMD/) | RStudio project with R Markdown analyses of osmotic stress LiP Atlas data, preprocessing and quality-control helpers, plotting scripts, and gene-to-UniProt mapping code. |
| [db_new/](../db_new/) | Compressed MySQL database dump (`dynaprotdbv2_2026-11-09.sql.zip`). |
| [dspa-backend/](../dspa-backend/) | Node.js/Express API modules for protein searches, experiments, conditions, LiP scores, and enrichment data. Contains routes, controllers, models, middleware, database configuration, scripts, and tests. |
| [dspa-database/](../dspa-database/) | MySQL schema and Python tooling for importing experiments and reference data. Includes database setup and upload scripts, an ingestion CLI, Docker configuration, SQL scripts, and tests. |
| [dspa-frontend/](../dspa-frontend/) | React web application for protein searches, experiment/condition browsing, sequence and structure views, volcano plots, and GO enrichment. Includes source, public assets, build output, documentation, and unit/browser tests. |
| [dspa-main/](./) | Application entry point and deployment setup: Express server, backend/frontend links, Docker and Compose files, build/load/backup scripts, a database dump, cache, Rust/WebAssembly files, and profiling tests. Also contains this overview. |
| [dspa-mcp/](../dspa-mcp/) | Rust Model Context Protocol (MCP) server for DynaProt database queries and biology tools. Includes a browser authentication gateway, experiment importer, database packaging, deployment scripts/configuration, documentation, and tests. |
| [dspa-molstar/](../dspa-molstar/) | Mol* molecular visualization toolkit source, structure parsers, rendering/UI components, server and CLI utilities, example data, documentation, and build scripts. |
| [dspa-nightingale/](../dspa-nightingale/) | Nightingale biological visualization web-component monorepo, with component packages, Storybook examples, development resources, and build/test configuration. |
| [dspa-nightingale-bundle/](../dspa-nightingale-bundle/) | Customized Nightingale sequence, sequence-heatmap, structure, and feature-track components, including TypeScript source and compiled distributions. |
| [dspa-processing-pipeline/](../dspa-processing-pipeline/) | R pipelines for processing LiP/TrP and LiP-Quant dose-response experiments from Spectronaut output into files for database upload. Includes an RStudio project and YAML parameter template. |
| [dspa-sample-database/](../dspa-sample-database/) | Sample database setup with SQL table definitions, Python population scripts, example FASTA and GO-analysis data, Docker configuration, a notebook, and schema documentation. |
| [dspa-viz-d3js/](../dspa-viz-d3js/) | JavaScript visualization prototypes for barcode plots, peptide coverage, sequence display, and 3D structures, with viewer addons, example data, and browser demos. |
| [dspa-viz-py/](../dspa-viz-py/) | Python barcode visualization library, example proteomics data, a demonstration notebook, Poetry configuration, and tests. |
| [dspa_mcp/](../dspa_mcp/) | Local MCP working directory containing `work/dcr.yml` and `work/sql.yaml`; separate from the `dspa-mcp/` server source folder. |
| [test-imputationstrategies/](../test-imputationstrategies/) | R scripts and notebooks comparing missing-value imputation strategies for LiP data, with reference code/data, an RStudio project, and result plots. |
| [testdata_dspa_database/](../testdata_dspa_database/) | Extracted experiment datasets in a nested folder of the same name. Includes amino-acid scores, differential-abundance tables, cleaned DIA tables, and experiment parameter files for database import testing. |
