const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/'
  },
  mode: 'development',
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        enforce: 'pre',
        use: ['prettier-loader', 'tslint-loader']
      },
      {
        test: /^(?!.*\.spec\.ts)./,
        use: 'ts-loader'
      }
    ]
  }
};
