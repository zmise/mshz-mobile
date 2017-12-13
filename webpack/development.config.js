module.exports = {
  // devtool: 'eval',
  devServer: require('./dev-server'),
  entry: require('./entry'),
  output: require('./output'),
  plugins: require('./plugins'),
  module: require('./modules'),
  resolve: require('./resolve')
};
