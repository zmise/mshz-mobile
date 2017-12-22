(function ($, undefined) {
  'use strict';

  /* 默认参数  */
  var defaultParameters = {
    width: 'auto', // 宽度 
    height: 'auto', // 高度 
    direction: 'horizontal', // 方向   horizontal | vertical
    autoPlay: false, // 是否自动播放
    loop: true, // 是否循环
    speed: 5000, // 播放速度
    index: 0, // 当前为第几个
    lazyLoad: true, // 是否懒加载
    threShold: 30, // 阀值
    pagination: 'pagination', // 分页器的className
    paginationType: 'bullets', // 分页器的类型   bullets (小点) | fraction (x/y) 
    container: '.banner', // 容器选择器
    child: '.items', // 项容器选择器
    callback: null, // 回调函数
    pictureLoadComplete: null // 图片加载完成时的回调
  };

  var intervalObject = null;

  /* 开启自动播放  */
  function startAutoPlay() {
    var _this = this;
    intervalObject = setInterval(function () {
      _this.opts.index++;
      play.call(_this);
    }, this.opts.speed);
  };

  /* 停止自动播放  */
  function stopAutoPlay() {
    clearInterval(intervalObject);
  };

  /* 获取Value值 */
  function getValue() {
    var _val = this.opts.direction === 'horizontal' ? this.opts.width : this.opts.height;
    return this.opts.loop && this.length > 1 ? -(this.opts.index + 1) * _val : -this.opts.index * _val;
  };

  /* 初始化布局  */
  function ready() {
    this.$child.css({
      'width': this.opts.width,
      'height': this.opts.height
    });
    if (this.opts.loop && this.length > 1) {
      var $first = this.$child.first().clone();
      var $last = this.$child.last().clone();
      this.$container.append($first).prepend($last); // 在容器前后加上clone项
    }
    this.$container.translate({
      direction: this.opts.direction,
      value: getValue.call(this)
    });
  };

  /* 初始化分页器 */
  function initPagination() {
    var _html = '<div class="' + this.opts.pagination + '">';
    switch (this.opts.paginationType) {
      case 'fraction':
        _html += '<i class="icon iconfont icon-tupian"></i>' +
          '<span>' + (this.opts.index + 1) + '</span>' +
          '<span>/</span>' +
          '<span>' + this.length + '</span>';
        break;
      default:
        if (this.length > 1) {
          for (var i = 0; i < this.length; i++) {
            _html += '<span' + (i === this.opts.index ? ' class="current"' : '') + '></span>';
          }
        }
    }
    _html += '</div>';
    this.$el.find('.' + this.pagination).remove();
    this.$el.append(_html);
  };

  /* 设置分页器  */
  function setPagination() {
    switch (this.opts.paginationType) {
      case 'fraction':
        this.$el.find('.' + this.opts.pagination).find('span').first().text(this.opts.index + 1);
        break;
      default:
        this.$el.find('.' + this.opts.pagination).find('span').eq(this.opts.index).addClass('current').siblings().removeClass('current');
    }
  };

  /* 图片懒加载  */
  function lazyLoading() {
    var _this = this;
    this.$el.find('[jslazy]').each(function (i) {
      var $this = $(this);
      var _flag = $this.offset().left >= -_this.opts.width && $this.offset().left < _this.opts.width * 2;
      if (_this.opts.direction !== 'horizontal') {
        _flag = $this.offset().top >= -_this.opts.height && $this.offset().top < _this.opts.height * 2;
      }
      if ($this.data('src') && _flag) {
        var img = new Image();
        img.src = $this.data('src');
        img.onload = function () {
          $this.attr('src', this.src);
          $this.removeAttr('jslazy');
          _this.opts.pictureLoadComplete && $.isFunction(_this.opts.pictureLoadComplete) && _this.opts.pictureLoadComplete(this.naturalWidth, this.naturalHeight);
        }
        img.onerror = function () {
          throw 'picture loading error';
        }
      }
    });
  };

  /* 播放 */
  function play() {
    var _this = this;
    if (this.opts.loop) {
      this.$container.translate({
        duration: 0.3,
        direction: this.opts.direction,
        value: getValue.call(this)
      });
      if (this.opts.index < 0) {
        this.opts.index = this.length - 1;
      } else if (this.opts.index > this.length - 1) {
        this.opts.index = 0;
      }
      setTimeout(function () { // 动画结束后执行
        _this.$container.translate({
          direction: _this.opts.direction,
          value: getValue.call(_this)
        });
      }, 300);
    } else {
      if (this.opts.index < 0) {
        this.opts.index = 0;
      } else if (this.opts.index > this.length - 1) {
        this.opts.index = this.length - 1;
      }
      this.$container.translate({
        duration: 0.3,
        direction: this.opts.direction,
        value: getValue.call(this)
      });
    }
    setPagination.call(this);
    if (this.opts.lazyLoad) {
      lazyLoading.call(this);
    }
    this.opts.callback && $.isFunction(this.opts.callback) && this.opts.callback();
  };

  /* 初始化绑定事件  */
  function initEvent() {
    var _this = this;
    var _startPoint = { // 开始位置
      x: 0,
      y: 0,
      t: 0
    };
    var _endPoint = { // 结束位置
      x: 0,
      y: 0,
      t: 0
    };
    var _firstFlag = true; // 是否首次触发移动事件
    var _direction = 'horizontal'; // 移动的方向
    var _moveFlag = false; // 是否有效移动
    this.$el.on('touchstart', function (e) {
      $.extend(_startPoint, {
        x: e.originalEvent.touches[0].pageX,
        y: e.originalEvent.touches[0].pageY,
        t: new Date().getTime()
      });
      if (_this.opts.autoPlay && _this.opts.loop) {
        stopAutoPlay(); // 停止自动播放
      }
      _this.$container.translate({
        direction: _this.opts.direction,
        value: getValue.call(_this)
      });
    });
    this.$el.on('touchmove', function (e) {
      if (_this.length <= 1) return;
      $.extend(_endPoint, {
        x: e.originalEvent.touches[0].pageX,
        y: e.originalEvent.touches[0].pageY,
        t: new Date().getTime()
      });
      if (_firstFlag && Math.abs(_endPoint.x - _startPoint.x) > 5) { // 水平方向移动
        _firstFlag = false;
        _direction = 'horizontal';
      } else if (_firstFlag && Math.abs(_endPoint.y - _startPoint.y) > 5) { // 垂直方向移动
        _firstFlag = false;
        _direction = 'vertical';
      }
      if (_this.opts.direction !== 'horizontal' || (_this.opts.direction === 'horizontal' && _direction === 'horizontal')) {
        e.preventDefault();
        _moveFlag = true;
        var _pot = _this.opts.direction === 'horizontal' ? _endPoint.x - _startPoint.x : _endPoint.y - _startPoint.y;
        _this.$container.translate({
          direction: _this.opts.direction,
          value: getValue.call(_this) + _pot
        });
      }
    });
    this.$el.on('touchend', function (e) {
      _firstFlag = true;
      if (_moveFlag) {
        _moveFlag = false;
        var _pot = _this.opts.direction === 'horizontal' ? _endPoint.x - _startPoint.x : _endPoint.y - _startPoint.y;
        if (_pot < -_this.opts.threShold) {
          _this.opts.index++;
        } else if (_pot > _this.opts.threShold) {
          _this.opts.index--;
        }
        play.call(_this);
      }
      if (_this.opts.autoPlay && _this.opts.loop) {
        startAutoPlay.call(_this); // 停止自动播放
      }
    });
  };

  /* 焦点图片 */
  function Banner($el, options) {
    this.$el = $el;
    this.opts = $.extend({}, defaultParameters, options);
    this.$container = this.$el.find(this.opts.container);
    this.$child = this.$el.find(this.opts.child);
    this.length = this.$child.length;
    ready.call(this);
    initPagination.call(this);
    if (this.opts.lazyLoad) {
      lazyLoading.call(this);
    }
    if (this.opts.autoPlay && this.opts.loop) {
      startAutoPlay.call(this);
    }
    initEvent.call(this);
  };

  /* 播放上一张 */
  Banner.prototype.prev = function () {
    this.opts.index--;
    play.call(this);
  };

  /* 播放下一张 */
  Banner.prototype.next = function () {
    this.opts.index++;
    play.call(this);
  };

  /* 插件 */
  function Plugin(options) {
    return new Banner($(this), options);
  };

  /* 绑定 */
  $.fn.banner = Plugin;

}(jQuery));
