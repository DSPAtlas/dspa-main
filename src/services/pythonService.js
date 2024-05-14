import { spawn } from 'child_process';

const dataToSend = JSON.stringify({
    proteinName,
    proteinsInFileFastaDict,
    organismProteins,
    LiPDataFrame: JSON.stringify(LiPDataFrame) // Convert DataFrame to JSON string
  });

export const executePythonVisualization = (data) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['../../python/generate_svg.py']);

    let svgData = '';
    pythonProcess.stdout.on('data', (data) => {
      svgData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      reject(data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(svgData);
      } else {
        reject(`Python script exited with code ${code}`);
      }
    });

    // Send the data to the Python script
    pythonProcess.stdin.write(JSON.stringify(data));
    pythonProcess.stdin.end();
  });
};
