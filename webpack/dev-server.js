const devServer = {
  historyApiFallback: true,
  host: '172.16.72.97',
  port: 8080,
  compress: true,
  hot: true,
  proxy: {
    // proxy all requests starting with /api to jsonplaceholder
    '/mshz-app': {
      // target: 'http://172.16.72.198:51312/mshz-app',
      target: 'http://192.168.0.243:51312/',
      // target: 'http://api.mshz.com:51312/mshz-app',
      // target: 'http://api.mshz.com:51312/mshz-mgr',
      // target: 'http://192.168.0.139:51312/mshz-app/v2/api-docs',
      changeOrigin: true,
      // pathRewrite: {
      //   '^/api': ''
      // }
    }
  },
  stats: {
    colors: true
  }
};

module.exports = devServer;
