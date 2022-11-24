const path = require('path');
const config = require('./common');

Object.assign(config, {
  releaseDestDir: path.resolve(__dirname, '../build/next/examples')
});

module.exports = config;
