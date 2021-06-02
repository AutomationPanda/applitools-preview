const siteConfig = require('./site.config.js');

const { env } = siteConfig;

module.exports = {
  target: 'serverless',
  env: {
    NEXT_PUBLIC_GA_PROPERTY_ID: env.gaPropertyId
  }
};