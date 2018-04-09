module.exports = {
  // devtool: 'cheap-source-map',
  devServer: require('./dev-server'),
  entry: require('./entry'),
  output: require('./output'),
  plugins: require('./plugins'),
  module: require('./modules'),
  resolve: require('./resolve')
};
