const path = require('path');
const config = require('./config');
const pages = require('./pages');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //html插件
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //静态资源提取插件
const stylePlugin = new ExtractTextPlugin('css/[name]-[chunkhash:8].css'); //提取CSS
const commonsPlugin = new webpack.optimize.CommonsChunkPlugin({ //公共资源
  name: 'common',
  filename: 'js/[name]-[chunkhash:8].js',
  minChunks: 2
});

const providePlugin = new webpack.ProvidePlugin({ //提供
  $: 'jquery',
  jQuery: 'jquery',
  'window.$': 'jquery',
  'window.jQuery': 'jquery'
});

const CopyWebpackPlugin = require('copy-webpack-plugin');
const copyArray = new CopyWebpackPlugin([
  {
    from: path.resolve(config.srcDir, 'assets/img'),
    to: 'static/img'
  }, {
    from: path.resolve(config.srcDir, 'assets/app'),
    to: 'app'
  }
  // , {
  //   from: path.resolve(config.distDir, 'js'),// + '/common-*.js',
  //   to: path.resolve(config.distDir, 'js111'),// + '/common.js',
  //   context: path.resolve(config.distDir, 'js')
  // }
  // , {
  //   from: path.resolve(config.distDir, 'js') + '/index-*.js',
  //   to: path.resolve(config.distDir, 'js') + '/index.js',
  //   context: path.resolve(config.distDir, 'js')
  // }, {
  //   from: path.resolve(config.distDir, 'js') + '/house-list-*.js',
  //   to: path.resolve(config.distDir, 'js') + '/house-list.js',
  //   context: path.resolve(config.distDir, 'js')
  // },
  // {
  //   from: path.resolve(config.distDir, 'js') + '/house-details-*.js',
  //   to: path.resolve(config.distDir, 'js') + '/house-details.js',
  //   context: path.resolve(config.distDir, 'js')
  // }
]);

// 定义 plugin
const plugins = [
  providePlugin,
  commonsPlugin,
  stylePlugin,
  copyArray,
  // filemanager
];

// 自动生成 html 页面，并注入 css & js
pages.forEach(function (page) {
  const htmlPlugin = new HtmlWebpackPlugin({
    filename: page + '.html',
    template: path.resolve(config.srcDir, 'pages/' + page + '/index.html'),
    chunks: [page, 'common'],
    minify: {
      removeComments: false,
      collapseWhitespace: false
    }
  });
  plugins.push(htmlPlugin);
});

module.exports = plugins;
