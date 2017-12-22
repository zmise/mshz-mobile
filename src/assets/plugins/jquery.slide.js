(function ($, undefined) {
  'use strict';

  /* 默认参数  */
  var defaultParameters = {
    direction: 'horizontal', // 方向   horizontal | vertical
    value: 0, // 过渡的值
    callback: null // 回调函数
  };

  /* 初始化绑定事件  */
  function initEvent() {
    var _this = this;
    var _startPoint = {
      x: 0,
      y: 0,
      t: 0
    };
    var _endPoint = {
      x: 0,
      y: 0,
      t: 0
    };
    var _firstFlag = true; // 是否首次触发移动事件
    var _direction = 'horizontal'; // 移动的方向
    var _moveFlag = false; // 是否有效移动
    var _overtop = 0; // 超出的值
    /* 获取超出的值 */
    function getOvertopVaule() {
      var _val = 0;
      if (_this.opts.direction === 'horizontal') {
        _this.$child.children().each(function () {
          _val += $(this).outerWidth(true);
        });
        return _this.$el.width() - _val;
      } else {
        _this.$child.children().each(function () {
          _val += $(this).outerHeight(true);
        });
        return _this.$el.height() - _val;
      }
    };
    this.$el.on('touchstart', function (e) {
      $.extend(_startPoint, {
        x: e.originalEvent.touches[0].pageX,
        y: e.originalEvent.touches[0].pageY,
        t: new Date().getTime()
      });
      _this.$child.translate({
        direction: _this.opts.direction,
        value: _this.opts.value
      });
      _overtop = getOvertopVaule();
    });
    this.$el.on('touchmove', function (e) {
      if (_overtop >= 0) return;
      $.extend(_endPoint, {
        x: e.originalEvent.touches[0].pageX,
        y: e.originalEvent.touches[0].pageY,
        t: new Date().getTime()
      });
      if (_firstFlag && Math.abs(_endPoint.x - _startPoint.x) > 5) {
        _firstFlag = false;
        _direction = 'horizontal';
      } else if (_firstFlag && Math.abs(_endPoint.y - _startPoint.y) > 5) {
        _firstFlag = false;
        _direction = 'vertical';
      }
      if (_this.opts.direction !== 'horizontal' || (_this.opts.direction === 'horizontal' && _direction === 'horizontal')) {
        e.preventDefault();
        _moveFlag = true;
        var _pot = _this.opts.direction === 'horizontal' ? _endPoint.x - _startPoint.x : _endPoint.y - _startPoint.y;
        var _newValue = _this.opts.value + _pot;
        if (_newValue > 0) {
          _newValue = _newValue / 3;
        } else if (_newValue < _overtop) {
          _newValue = (_newValue - _overtop) / 3 + _overtop;
        }
        _this.$child.translate({
          direction: _this.opts.direction,
          value: _newValue
        });
      }
    });
    this.$el.on('touchend', function (e) {
      _firstFlag = true;
      if (_moveFlag) {
        _moveFlag = false;
        var _pot = _this.opts.direction === 'horizontal' ? _endPoint.x - _startPoint.x : _endPoint.y - _startPoint.y;
        var _v = _pot / (_endPoint.t - _startPoint.t); // 初始速度
        var _t = 300; // 减速运动时间 （毫秒）
        var _s = _v * _t / 2; // 减速距离公式：s = (v0-v1)/2 * t;
        var _newValue = _this.opts.value + _pot + _s;
        if (_newValue > 0) {
          _newValue = 0;
        } else if (_newValue < _overtop) {
          _newValue = _overtop;
        }
        _this.$child.translate({
          duration: 0.3,
          direction: _this.opts.direction,
          value: _newValue
        });
        _this.opts.value = _newValue;
        _this.opts.callback && $.isFunction(_this.opts.callback) && _this.opts.callback();
      }
    });
  };

  /* 上下、左右滑动 */
  function Slide($el, options) {
    this.$el = $el;
    this.opts = $.extend({}, defaultParameters, options);
    this.$child = this.$el.children();
    this.setPosition(this.opts.value);
    initEvent.call(this);
  };

  /* 设置位置 */
  Slide.prototype.setPosition = function (value) {
    this.opts.value = value;
    this.$child.translate({
      direction: this.opts.direction,
      value: this.opts.value
    });
  };

  /* 插件 */
  function Plugin(options) {
    return new Slide($(this), options);
  };

  /* 绑定 */
  $.fn.slide = Plugin;

  $(function () {
    $('[js-plugin="slide"]').each(function (i, v) {
      $(this).slide({
        direction: $(this).data('direction'),
        value: $(this).data('value')
      });
    });
  });
}(jQuery));
