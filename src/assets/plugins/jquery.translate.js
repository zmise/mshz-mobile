(function ($, undefined) {
  'use strict';

  /* 默认参数  */
  var defaultParameters = {
    direction: 'horizontal', // 方向   horizontal | vertical
    duration: 0, // 过渡效果花费的时间
    timing: 'ease', // 过渡效果的时间曲线
    value: 0, // 过渡的值
    callback: null // 回调
  };

  /* 初始化 */
  function init() {
    var _str = '';
    if (typeof this.opts.value === 'number') {
      _str = this.opts.direction === 'horizontal' ? this.opts.value + 'px,0,0' : '0,' + this.opts.value + 'px,0';
    } else {
      _str = this.opts.direction === 'horizontal' ? this.opts.value + ',0,0' : '0,' + this.opts.value + ',0';
    }
    this.$el.prefix({
      'transition-property': 'all',
      'transition-duration': this.opts.duration + 's',
      'transition-timing-function': this.opts.timing,
      'transform': 'translate3d(' + _str + ')'
    });
    if (this.opts.callback && $.isFunction(this.opts.callback)) {
      setTimeout(this.opts.callback, 300);
    }
  };

  /* css3过渡动画 */
  function Translate($el, options) {
    this.$el = $el;
    this.opts = $.extend({}, defaultParameters, options);
    init.call(this);
  };

  /* 插件 */
  function Plugin(options) {
    return new Translate($(this), options);
  };

  $.fn.translate = Plugin;
}(jQuery));
