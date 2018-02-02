const path = require('path');
const config = require('./config');
const pages = require('./pages');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //html插件
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //静态资源提取插件
const stylePlugin = new ExtractTextPlugin(process.env.NODE_ENV === 'development' ? 'css/[name]-[hash:8].css' : 'css/[name].css'); //提取CSS
const commonsPlugin = new webpack.optimize.CommonsChunkPlugin({ //公共资源
  name: 'common',
  filename: process.env.NODE_ENV === 'development' ? 'js/[name]-[hash:8].js' : 'js/[name].js',
  minChunks: 2
});
const providePlugin = new webpack.ProvidePlugin({ //提供
  $: 'jquery',
  jQuery: 'jquery',
  'window.$': 'jquery',
  'window.jQuery': 'jquery'
});
const jsPlugin = new webpack.optimize.UglifyJsPlugin(); //JS压缩

const CopyWebpackPlugin = require('copy-webpack-plugin');
const copyArray = new CopyWebpackPlugin([{
  from: path.resolve(config.srcDir, 'assets/img'),
  to: 'static/img/'
}]);

// 定义 plugin
const plugins = [
  providePlugin,
  commonsPlugin,
  stylePlugin,
  copyArray
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
