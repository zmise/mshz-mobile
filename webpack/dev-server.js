const devServer = {
  historyApiFallback: true,
  host: 'localhost',
  port: 8088,
  compress: true,
  hot: true,
  stats: {
    colors: true
  }
};

module.exports = devServer;
