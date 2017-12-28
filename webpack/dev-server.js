const devServer = {

  // proxyTable: {
  //   // proxy all requests starting with /api to jsonplaceholder
  //   '/api': {
  //     target: 'http://jsonplaceholder.typicode.com',
  //     changeOrigin: true,
  //     pathRewrite: {
  //       '^/api': ''
  //     }
  //   }
  // },

  historyApiFallback: true,
  host: '172.16.72.97',
  port: 8080,
  compress: true,
  hot: true,
  proxy: {
    // proxy all requests starting with /api to jsonplaceholder
    '/api': {
      target: 'http://api.mshz.com:51313/mshz-mgr',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  },
  stats: {
    colors: true
  }
};

module.exports = devServer;
