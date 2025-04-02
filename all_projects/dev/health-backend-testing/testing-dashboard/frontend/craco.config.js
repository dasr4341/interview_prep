module.exports = {
  typescript: {
    enableTypeChecking: true /* (default value) */,
  },
  plugins: [
    {
      plugin: require('craco-plugin-scoped-css')
    }
  ]
};
