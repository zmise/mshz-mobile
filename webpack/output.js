const config = require('./config');

// 定义输出目录
const output = {
  path: config.distDir, // 生成文件的存放路径
  publicPath: process.env.NODE_ENV === 'development' ? '/' : '../', // 发布后的页面路径
  filename: process.env.NODE_ENV === 'development' ? 'js/[name]-[chunkhash:8].js' : 'js/[name].js', //各页面模块对应的主要 js 文件命名
};

module.exports = output;
