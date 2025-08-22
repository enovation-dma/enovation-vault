const path = require("path");

module.exports = function override(config, env) {
  if (env === "production") {
    config.output.filename = "static/js/[name].js";
    config.output.chunkFilename = "static/js/[name].chunk.js";
    config.plugins.forEach((plugin) => {
      if (plugin.options && plugin.options.filename) {
        plugin.options.filename = "static/css/[name].css";
      }
    });
  }
  return config;
};
