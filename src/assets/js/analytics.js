/**
 * 百度统计代码安装
 */
(function (window, document, tag, src, r, a, m) {
  window[r] = window[r] || [];
  a = document.createElement(tag);
  m = document.getElementsByTagName(tag)[0];
  a.async = 1;
  a.src = src;
  m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://hm.baidu.com/hm.js?7f179190a5503056e847e1130eb9b40d', '_hmt');
