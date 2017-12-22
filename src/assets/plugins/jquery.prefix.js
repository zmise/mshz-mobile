(function ($, undefined) {
  'use strict';

  /* 初始化 */
  function init() {
    var _this = this;
    var _prefix = ['-webkit-', '-moz-', '-ms-', '-o-'];
    $.each(this.options, function (i, v) {
      var _str = '{';
      $.each(_prefix, function (j) {
        _str += '\"' + this[j] + i + '\":\"' + v + '\",';
      });
      _str = _str.substr(0, _str.length - 1) + '}';
      $.extend(_this.options, $.parseJSON(_str));
    });
    this.$el.css(this.options);
  };

  /* 给css3加前缀 */
  function Prefix($el, options) {
    this.$el = $el;
    this.options = options;
    init.call(this);
  };

  /* 插件 */
  function Plugin(options) {
    if (typeof options !== 'object') {
      throw 'arguments are not object';
    }
    return new Prefix($(this), options);
  };

  $.fn.prefix = Plugin;
}(jQuery));