const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  mode: 'production', // Set to 'production' for optimized build
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public/js'), // Output directory to public/js/vendor
    filename: 'vizd3js-bundle.js', // Output file name
    module: true,
    library: {
      name: 'vizd3js',
      type: 'module'
    }
    //libraryTarget: 'umd',
    //globalObject: 'this'
  },

  experiments: {
    outputModule: true
  },
  resolve: {
    extensions: ['.ts', '.js'], // Add .ts if not already present
},  
  module: {
    rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { modules: false }]]
            }
          }
        }
      ]
    },
  plugins: [
    new CleanWebpackPlugin(),
  ],
};
