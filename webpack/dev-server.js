const devServer = {
  historyApiFallback: true,
  host: '0.0.0.0',
  port: 8080,
  compress: true,
  hot: true,
  stats: {
    colors: true
  }
};

module.exports = devServer;
