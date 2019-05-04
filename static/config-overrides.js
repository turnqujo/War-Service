module.exports = config =>
  require('react-app-rewire-postcss')(config, {
    plugins: [require('autoprefixer'), require('postcss-nested')]
  });
