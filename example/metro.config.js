/* eslint-env node */
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const escape = require('escape-string-regexp');

// 1. load the default Expo Metro config
const config = getDefaultConfig(__dirname);

// 2. point Metro at your library one folder up
const root = path.resolve(__dirname, '..');

// 3. watch the parent folder so it picks up your library’s source
config.watchFolders = [root];

// 4. blacklist the parent’s node_modules (so you don’t load duplicates)
config.resolver.blacklistRE = exclusionList([new RegExp(`^${escape(path.join(root, 'node_modules'))}\\/.*$`)]);

// 5. ensure Metro only resolves modules from demo’s own node_modules
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];

// 6. (optional) allow require.context if you need it
config.transformer.unstable_allowRequireContext = true;

module.exports = config;
