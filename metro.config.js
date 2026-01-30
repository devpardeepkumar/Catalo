const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Clear cache on startup
config.cacheVersion = Date.now().toString();

module.exports = config;
