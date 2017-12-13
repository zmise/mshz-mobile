const path = require('path');
const config = require('./config');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 定义所需的 loader
const modules = {
  rules: [{
    test: /\.html$/,
    include: config.srcDir,
    loader: 'dot-loader'
  }, {
    test: /\.css$/,
    include: config.srcDir,
    loader: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: 'css-loader?minimize'
    })
  }, {
    test: /\.scss$/,
    include: config.srcDir,
    loader: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: ['css-loader?minimize', 'sass-loader']
    })
  }, {
    test: /\.js$/,
    include: config.srcDir,
    loader: 'jsx-loader'
  }, {
    test: /\.(png|jpg|gif)$/,
    include: config.srcDir,
    loader: process.env.NODE_ENV === 'development' ? 'file-loader?name=static/img/[name]-[hash:8].[ext]' : 'file-loader?name=static/img/[name].[ext]'
  }, {
    test: /\.ttf\??.*$/,
    include: path.resolve(config.srcDir, './assets/vendors/'),
    loader: process.env.NODE_ENV === 'development' ? 'file-loader?minetype=application/octet-stream&name=static/fonts/[name]-[hash:8].[ext]' : 'file-loader?minetype=application/octet-stream&name=static/fonts/[name].[ext]'
  }, {
    test: /\.eot\??.*$/,
    include: path.resolve(config.srcDir, './assets/vendors/'),
    loader: process.env.NODE_ENV === 'development' ? 'file-loader?name=static/fonts/[name]-[hash:8].[ext]' : 'file-loader?name=static/fonts/[name].[ext]'
  }, {
    test: /\.svg\??.*$/,
    include: path.resolve(config.srcDir, './assets/vendors/'),
    loader: process.env.NODE_ENV === 'development' ? 'file-loader?minetype=image/svg+xml&name=static/fonts/[name]-[hash:8].[ext]' : 'file-loader?minetype=image/svg+xml&name=static/fonts/[name].[ext]'
  }, {
    test: /\.(woff|woff2)\??.*$/,
    include: path.resolve(config.srcDir, './assets/vendors/'),
    loader: process.env.NODE_ENV === 'development' ? 'file-loader?minetype=application/font-woff&name=static/fonts/[name]-[hash:8].[ext]' : 'file-loader?minetype=application/font-woff&name=static/fonts/[name].[ext]'
  }]
};

module.exports = modules;
