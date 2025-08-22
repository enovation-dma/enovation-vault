module.exports = function override(config, env) {
  if (env === "production") {
    // Customize JS filenames if needed
    config.output.filename = "static/js/[name].[contenthash:8].js";
    config.output.chunkFilename = "static/js/[name].[contenthash:8].chunk.js";
    
    // ⚠️ Do NOT override CSS filenames
    // Let CRA handle CSS hashing automatically to prevent conflicts
  }
  return config;
};
