const path = require('path');
const config = require('./config');

// 定义输出目录
const resolve = {
  alias: {
    jquery: path.resolve('./node_modules/jquery/dist/jquery.min.js')
  },
  modules: ['node_modules', 'src', 'src/pages', 'src/assets']
};

module.exports = resolve;
