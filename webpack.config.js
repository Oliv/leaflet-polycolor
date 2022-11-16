const path = require('path');

module.exports = {
  entry: './src/leaflet-polycolor.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'leaflet-polycolor.min.js',
  },
  mode: 'production',
  target: 'web',
};