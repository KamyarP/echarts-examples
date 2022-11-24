const path = require('path');
const config = require('./common');

Object.assign(config, {
  releaseDestDir: path.resolve(__dirname, '../build/examples')
});

module.exports = config;
