const { merge } = require('webpack-merge');

const commonConfig = require('./webpack.common.config');

const developmentConfig = require('./webpack.dev.config');

const env = process.env.NODE_ENV;

module.exports = () => {
  switch(env) {
    case 'development':
      return merge(commonConfig, developmentConfig);
    case 'production':
      return commonConfig;
    default:
      throw new Error('No matching configuration was found!');
  }
}