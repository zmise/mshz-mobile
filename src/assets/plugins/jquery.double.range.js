(function ($, undefined) {
  'use strict';

  /* 默认参数  */
  var defaultParameters = {
    direction: 'horizontal', // 方向   horizontal | vertical
    minValue: 0, // 最小值
    maxValue: 0, // 最大值
    unitValue: 1, // 单元值
    firstPot: 0, // 前一个滑块的位置
    lastPot: 0, // 后一个滑块的位置
    firstValue: 0, // 前一个滑块的值
    lastValue: 0, // 后一个滑块的值
    sliderSize: 20, // 滑块大小
    firstSlider: '.first-slider', // 前一个滑块的选择器
    lastSlider: '.last-slider', // 后一个滑块的选择器
    rangeValue: '.range-value', // range-value
    textValue: '.text-value', // text-value
    moveTextClass: 'orange-text', // 拖动时的ClassName
    defaultText: '不限', // 默认文本
    firstCallback: null, // 前一个回调函数
    lastCallback: null, // 后一个回调函数
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
    var _rangeLength = 0; // Range实际的长度
    var _unitLength = 0; // 单元的实际长度

    //获取Range实际的长度
    function getRangeLength() {
      _rangeLength = _this.$el.width();
      _unitLength = _rangeLength / (_this.opts.maxValue - _this.opts.minValue);
    }

    this.$el.on('touchstart', this.opts.firstSlider, function (e) {
      $.extend(_startPoint, {
        x: e.originalEvent.touches[0].pageX,
        y: e.originalEvent.touches[0].pageY,
        t: new Date().getTime()
      });
      getRangeLength();
    });
    this.$el.on('touchmove', this.opts.firstSlider, function (e) {
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
        var _newPot = _this.opts.firstPot + _pot;
        if (_newPot < 0) {
          _newPot = 0;
        } else if (_newPot > _rangeLength - _this.opts.lastPot - Math.round(_unitLength)) {
          _newPot = _rangeLength - _this.opts.lastPot - Math.round(_unitLength);
        }
        var _newValue = _this.opts.minValue + Math.round(_newPot / _unitLength);
        $(this).css({
          'left': _newPot - _this.opts.sliderSize
        });
        _this.$el.find(_this.opts.rangeValue).css({
          'left': _newPot
        });
        var _txt = '￥' + _newValue * _this.opts.unitValue;
        if (_newValue === _this.opts.minValue) {
          _txt = _this.opts.defaultText;
        }
        $(this).find(_this.opts.textValue).addClass(_this.opts.moveTextClass).text(_txt);
      }
    });
    this.$el.on('touchend', this.opts.firstSlider, function (e) {
      _firstFlag = true;
      if (_moveFlag) {
        _moveFlag = false;
        var _pot = _this.opts.direction === 'horizontal' ? _endPoint.x - _startPoint.x : _endPoint.y - _startPoint.y;
        var _newPot = _this.opts.firstPot + _pot;
        if (_newPot < 0) {
          _newPot = 0;
        } else if (_newPot > _rangeLength - _this.opts.lastPot - Math.round(_unitLength)) {
          _newPot = _rangeLength - _this.opts.lastPot - Math.round(_unitLength);
        }
        var _newValue = _this.opts.minValue + Math.round(_newPot / _unitLength);
        _this.opts.firstPot = _newPot;
        _this.opts.firstValue = _newValue;
        $(this).find(_this.opts.textValue).removeClass(_this.opts.moveTextClass);
        /* 解决前后数字不重叠  */
        if (_this.opts.lastValue - _this.opts.firstValue < 4) {
          $(this).find(_this.opts.textValue).css({
            'left': '-100%'
          });
        } else {
          $(this).find(_this.opts.textValue).css({
            'left': '-50%'
          });
        }
        _this.opts.firstCallback && $.isFunction(_this.opts.firstCallback) && _this.opts.firstCallback();
      }
    });
    this.$el.on('touchstart', this.opts.lastSlider, function (e) {
      $.extend(_startPoint, {
        x: e.originalEvent.touches[0].pageX,
        y: e.originalEvent.touches[0].pageY,
        t: new Date().getTime()
      });
      getRangeLength();
    });
    this.$el.on('touchmove', this.opts.lastSlider, function (e) {
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
        var _newPot = _this.opts.lastPot - _pot;
        if (_newPot < 0) {
          _newPot = 0;
        } else if (_newPot > _rangeLength - _this.opts.firstPot - Math.round(_unitLength)) {
          _newPot = _rangeLength - _this.opts.firstPot - Math.round(_unitLength);
        }
        var _newValue = _this.opts.maxValue - Math.round(_newPot / _unitLength);
        $(this).css({
          'right': _newPot - _this.opts.sliderSize
        });
        _this.$el.find(_this.opts.rangeValue).css({
          'right': _newPot
        });
        var _txt = '￥' + _newValue * _this.opts.unitValue;
        if (_newValue === _this.opts.maxValue) {
          _txt = _this.opts.defaultText;
        }
        $(this).find(_this.opts.textValue).addClass(_this.opts.moveTextClass).text(_txt);
      }
    });
    this.$el.on('touchend', this.opts.lastSlider, function (e) {
      _firstFlag = true;
      if (_moveFlag) {
        _moveFlag = false;
        var _pot = _this.opts.direction === 'horizontal' ? _endPoint.x - _startPoint.x : _endPoint.y - _startPoint.y;
        var _newPot = _this.opts.lastPot - _pot;
        if (_newPot < 0) {
          _newPot = 0;
        } else if (_newPot > _rangeLength - _this.opts.firstPot - Math.round(_unitLength)) {
          _newPot = _rangeLength - _this.opts.firstPot - Math.round(_unitLength);
        }
        var _newValue = _this.opts.maxValue - Math.round(_newPot / _unitLength);
        _this.opts.lastPot = _newPot;
        _this.opts.lastValue = _newValue;
        $(this).find(_this.opts.textValue).removeClass(_this.opts.moveTextClass);
        /* 解决前后数字不重叠  */
        if (_this.opts.lastValue - _this.opts.firstValue < 4) {
          $(this).find(_this.opts.textValue).css({
            'left': 0
          });
        } else {
          $(this).find(_this.opts.textValue).css({
            'left': '-50%'
          });
        }
        _this.opts.lastCallback && $.isFunction(_this.opts.lastCallback) && _this.opts.lastCallback();
      }
    });
  };

  /* 上下、左右滑动 */
  function DoubleRange($el, options) {
    this.$el = $el;
    this.opts = $.extend({}, defaultParameters, options);
    this.setFirstValue(this.opts.firstValue);
    this.setLastValue(this.opts.lastValue);
    initEvent.call(this);
  };

  /* 设置前一个的值  */
  DoubleRange.prototype.setFirstValue = function (value) {
    var _unitLength = this.$el.width() / (this.opts.maxValue - this.opts.minValue);
    if (value < this.opts.minValue) {
      value = this.opts.minValue;
    } else if (value > this.opts.lastValue - 1) {
      value = this.opts.lastValue - 1;
    }
    this.opts.firstValue = value;
    this.opts.firstPot = (value - this.opts.minValue) * _unitLength;
    this.$el.find(this.opts.firstSlider).css({
      'left': this.opts.firstPot - this.opts.sliderSize
    });
    this.$el.find(this.opts.rangeValue).css({
      'left': this.opts.firstPot
    });
    var _txt = '￥' + this.opts.firstValue * this.opts.unitValue;
    if (this.opts.firstValue === this.opts.minValue) {
      _txt = this.opts.defaultText;
    }
    this.$el.find(this.opts.firstSlider).find(this.opts.textValue).text(_txt);
  };

  /* 设置后一个的值  */
  DoubleRange.prototype.setLastValue = function (value) {
    var _unitLength = this.$el.width() / (this.opts.maxValue - this.opts.minValue);
    if (value > this.opts.maxValue) {
      value = this.opts.maxValue;
    } else if (value < this.opts.firstValue + 1) {
      value = this.opts.firstValue + 1;
    }
    this.opts.lastValue = value;
    this.opts.lastPot = (this.opts.maxValue - value) * _unitLength;
    this.$el.find(this.opts.lastSlider).css({
      'right': this.opts.lastPot - this.opts.sliderSize
    });
    this.$el.find(this.opts.rangeValue).css({
      'right': this.opts.lastPot
    });
    var _txt = '￥' + this.opts.lastValue * this.opts.unitValue;
    if (this.opts.lastValue === this.opts.maxValue) {
      _txt = this.opts.defaultText;
    }
    this.$el.find(this.opts.lastSlider).find(this.opts.textValue).text(_txt);
  };

  /* 插件 */
  function Plugin(options) {
    return new DoubleRange($(this), options);
  };

  /* 绑定 */
  $.fn.doubleRange = Plugin;

}(jQuery));
