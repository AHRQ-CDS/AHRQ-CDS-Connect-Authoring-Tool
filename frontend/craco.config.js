// Configures fallbacks for modules that aren't available to webpack. In our case, we don't need
// the polyfills, so just set fallback to false.
const configureFallbacks = config => {
  // currently, resolve.fallback doesn't exist, but play nice in case it is added in the future.
  if (config.resolve.fallback == null) {
    config.resolve.fallback = {};
  }

  const fallback = config.resolve.fallback;
  fallback['fs'] = false;
  fallback['buffer'] = false;
  fallback['timers'] = false;
};

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      configureFallbacks(webpackConfig);
      return webpackConfig;
    }
  }
};
