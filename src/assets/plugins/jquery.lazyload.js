(function ($, undefined) {
  'use strict';

  /* 默认参数  */
  var defaultParameters = {
    multiple: 1, // 可见区域的多少倍
    callback: null // 回调函数
  };

  /* 初始化 */
  function init() {
    var _this = this;
    $('img[lazyload]').each(function (i) {
      var $this = $(this);
      if ($this.data('src') && $this.offset().top < $(document).scrollTop() + $(window).height() * _this.opts.multiple) {
        var img = new Image();
        img.src = $this.data('src');
        img.onload = function () {
          $this.attr('src', this.src);
          $this.removeAttr('lazyload');
          _this.opts.callback && $.isFunction(_this.opts.callback) && _this.opts.callback(this.naturalWidth, this.naturalHeight);
        }
        img.onerror = function () {
          throw 'picture loading error';
        }
      }
    });
  };

  /* 图片懒加载  */
  function Lazyload(options) {
    this.opts = $.extend({}, defaultParameters, options);
    init.call(this);
  };

  /* 插件 */
  function Plugin(options) {
    return new Lazyload(options);
  };

  $.lazyload = Plugin;

  $(function () {
    var timeoutObject;
    $.lazyload();
    $(document).on('scroll.lazyload', function () {
      if (timeoutObject) {
        clearTimeout(timeoutObject);
      }
      timeoutObject = setTimeout($.lazyload, 30);
    });
  });
}(jQuery));