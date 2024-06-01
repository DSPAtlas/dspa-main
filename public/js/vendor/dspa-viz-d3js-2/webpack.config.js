const path = require('path');

module.exports = {
  mode: 'production', // Set to 'production' for optimized build
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'public/js'), // Output directory to public/js/vendor
    filename: 'vizd3js-bundle.js', // Output file name
    library: 'vizd3js',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/, 
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  resolve: {
  
    modules: ['node_modules']
    //alias: {
    //  '$3Dmol': path.resolve(__dirname, '3Dmol-min.js'),
    //  'jquery': path.resolve(__dirname, 'jquery36.js'),
   // },
  },
  plugins: [],
};
