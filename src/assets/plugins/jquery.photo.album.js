(function ($, undefined) {
  'use strict';

  /* 默认参数  */
  var defaultParameters = {
    width: 'auto', // 宽度 
    height: 'auto', // 高度 
    loop: true, // 是否循环
    index: 0, // 当前为第几个
    zoomNumber: 1, // 图片缩放倍数
    maxZoomNumber: 3, // 图片最大缩放的倍数
    picturePosition: { // 图片移动位置
      x: 0,
      y: 0
    },
    transformOrigin: { // 图片缩放基于的点
      x: 0,
      y: 0
    },
    lazyLoad: true, // 是否懒加载
    threShold: 30, // 阀值
    pagination: true, // 是否添加分页器
    paginationClass: 'pagination', // 分页器的className
    container: '.container', // 容器选择器
    child: '.items', // 项容器选择器
    callback: null, // 回调函数
    pictureLoadComplete: null // 图片加载完成时的回调
  };

  /* 获取Value值 */
  function getValue() {
    return this.opts.loop && this.length > 1 ? -(this.opts.index + 1) * this.opts.width : -this.opts.index * this.opts.width;
  };

  /* 初始化布局  */
  function ready() {
    this.$child.css({
      'width': this.opts.width,
      'height': 'auto'
    });
    if (this.opts.loop && this.length > 1) {
      var $firstItem = this.$child.first().clone(); // 克隆第一项
      var $lastItem = this.$child.last().clone(); // 克隆最后一项
      this.$container.append($firstItem).prepend($lastItem);
    }
    this.$container.prefix({
      'transition': 'transform 0s',
      'transform': 'translate(' + getValue.call(this) + 'px, 0)'
    });
  };

  /* 初始化分页器 */
  function initPagination() {
    var _html = '<div class="' + this.opts.paginationClass + '">';
    _html += '<span>' + (this.opts.index + 1) + '</span><span>/</span><span>' + this.length + '</span>';
    _html += '</div>';
    this.$el.find('.' + this.paginationClass).remove();
    this.$el.append(_html);
  };

  /* 设置分页器  */
  function setPagination() {
    this.$el.find('.' + this.opts.paginationClass).find('span').first().text(this.opts.index + 1);
  };

  /* 图片懒加载  */
  function lazyLoading() {
    var _this = this;
    this.$el.find('[jslazy]').each(function (i) {
      var $this = $(this);
      var _flag = $this.offset().left >= -_this.opts.width && $this.offset().left < _this.opts.width * 2;
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
      this.$container.prefix({
        'transition': 'transform .3s',
        'transform': 'translate(' + getValue.call(this) + 'px, 0)'
      });
      if (this.opts.index < 0) {
        this.opts.index = this.length - 1;
      } else if (this.opts.index > this.length - 1) {
        this.opts.index = 0;
      }
      if (this.opts.index === 0 || this.opts.index === this.length - 1) {
        setTimeout(function () { // 动画结束后执行
          _this.$container.prefix({
            'transition': 'transform 0s',
            'transform': 'translate(' + getValue.call(_this) + 'px, 0)'
          });
        }, 300);
      }
    } else {
      if (this.opts.index < 0) {
        this.opts.index = 0;
      } else if (this.opts.index > this.length - 1) {
        this.opts.index = this.length - 1;
      }
      this.$container.prefix({
        'transition': 'transform .3s',
        'transform': 'translate(' + getValue.call(this) + 'px, 0)'
      });
    }
    if (this.opts.pagination) {
      setPagination.call(this);
    }
    setTimeout(function () { // 动画结束后执行
      if (_this.opts.lazyLoad) {
        lazyLoading.call(_this);
      }
    }, 300);
    this.opts.callback && $.isFunction(this.opts.callback) && this.opts.callback(this.opts.index);
  };

  /* 两点之间的距离 */
  function getDistance(point1, point2) {
    return Math.pow((Math.pow((point2.x - point1.x), 2) + Math.pow((point2.y - point1.y), 2)), 0.5);
  };

  /* 两点之间的中心点 */
  function getCenterPoint(point1, point2) {
    return {
      x: (point1.x + point2.x) / 2,
      y: (point1.y + point2.y) / 2
    }
  };

  /* 设置图片缩放的基点样式 */
  function setTransformOrigin($picture, centerPoint) {
    $.extend(this.opts.transformOrigin, {
      x: (centerPoint.x - $picture.offset().left) / this.opts.zoomNumber,
      y: (centerPoint.y - $picture.offset().top) / this.opts.zoomNumber
    });
    if (this.opts.transformOrigin.x < 0) { // 当基点小于0时
      this.opts.transformOrigin.x = 0;
    } else if (this.opts.transformOrigin.x > $picture.width()) { // 当基点大于图片的宽时
      this.opts.transformOrigin.x = $picture.width();
    }
    if (this.opts.transformOrigin.y < 0) { // 当基点小于0时
      this.opts.transformOrigin.y = 0;
    } else if (this.opts.transformOrigin.y > $picture.height()) { // 当基点大于图片的高时
      this.opts.transformOrigin.y = $picture.height();
    }
    $picture.prefix({
      'transform-origin': this.opts.transformOrigin.x + 'px ' + this.opts.transformOrigin.y + 'px 0'
    });
  };

  /* 获取图片移动的极限位置 */
  function getLimitPosition($picture) {
    return {
      left: (this.opts.zoomNumber - 1) * this.opts.transformOrigin.x, // 左边的限制位置
      right: -(this.opts.zoomNumber - 1) * ($picture.width() - this.opts.transformOrigin.x), // 右边的限制位置
      top: (this.opts.zoomNumber - 1) * this.opts.transformOrigin.y, // 上边的限制位置
      bottom: -(this.opts.zoomNumber - 1) * ($picture.height() - this.opts.transformOrigin.y), // 下边的限制位置
    }
  };

  /* 图片的缩放和移动位置 */
  function pictureZoom($picture) {
    if (this.opts.zoomNumber < 1) {
      this.opts.zoomNumber = 1;
    } else if (this.opts.zoomNumber > this.opts.maxZoomNumber) {
      this.opts.zoomNumber = this.opts.maxZoomNumber;
    }
    var _limitPosition = getLimitPosition.call(this, $picture);
    if (this.opts.picturePosition.x > _limitPosition.left) {
      this.opts.picturePosition.x = _limitPosition.left;
    } else if (this.opts.picturePosition.x < _limitPosition.right) {
      this.opts.picturePosition.x = _limitPosition.right;
    }
    if (this.opts.picturePosition.y > _limitPosition.top) {
      this.opts.picturePosition.y = _limitPosition.top;
    } else if (this.opts.picturePosition.y < _limitPosition.bottom) {
      this.opts.picturePosition.y = _limitPosition.bottom;
    }
    $picture.prefix({
      'transition': 'transform .3s',
      'transform': 'translate(' + this.opts.picturePosition.x + 'px, ' + this.opts.picturePosition.y + 'px) scale(' + this.opts.zoomNumber + ')'
    });
  };

  /* 重置图片的缩放和位置 */
  function resetPictureInfo() {
    var _this = this;
    this.opts.picturePosition.x = 0;
    this.opts.picturePosition.y = 0;
    this.opts.transformOrigin.x = 0;
    this.opts.transformOrigin.y = 0;
    this.opts.zoomNumber = 1;
    setTimeout(function () {
      _this.$container.find('img').prefix({
        'transition': 'transform 0s',
        'transform': 'translate(' + _this.opts.picturePosition.x + 'px, ' + _this.opts.picturePosition.y + 'px) scale(' + _this.opts.zoomNumber + ')'
      });
    }, 300);
  };

  /* 增加吸附力效果 */
  function adsorbability(_newValue, _limitPosition) {
    if (_newValue.x > _limitPosition.left) {
      _newValue.x = (_newValue.x - _limitPosition.left) / 3 + _limitPosition.left;
    } else if (_newValue.x < _limitPosition.right) {
      _newValue.x = (_newValue.x - _limitPosition.right) / 3 + _limitPosition.right;
    }
    if (_newValue.y > _limitPosition.top) {
      _newValue.y = (_newValue.y - _limitPosition.top) / 3 + _limitPosition.top;
    } else if (_newValue.y < _limitPosition.bottom) {
      _newValue.y = (_newValue.y - _limitPosition.bottom) / 3 + _limitPosition.bottom;
    }
    return _newValue;
  };

  /* 初始化绑定事件  */
  function initEvent() {
    var _this = this;
    var _startPoint1 = { // 开始时的点1
      x: 0,
      y: 0,
      t: 0
    };
    var _startPoint2 = { // 开始时的点2
      x: 0,
      y: 0,
      t: 0
    };
    var _endPoint1 = { // 结束时的点1
      x: 0,
      y: 0,
      t: 0
    };
    var _endPoint2 = { // 结束时的点2
      x: 0,
      y: 0,
      t: 0
    };
    var _startCenterPoint = { // 两之间的中心点
      x: 0,
      y: 0
    };
    var _startDistance = 0; // 开始时两点间的距离
    var _endDistance = 0; // 结束时两点间的距离
    var _flag = 'none'; // 标志类型

    /* 触摸开始事件 */
    this.$el.on('touchstart', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var $picture = _this.$child.eq(_this.opts.index).find('img');
      _startPoint1.x = e.originalEvent.touches[0].pageX;
      _startPoint1.y = e.originalEvent.touches[0].pageY;
      _startPoint1.t = new Date().getTime();
      if (e.originalEvent.touches.length > 1) {
        _startPoint2.x = e.originalEvent.touches[1].pageX;
        _startPoint2.y = e.originalEvent.touches[1].pageY;
        _startPoint2.t = new Date().getTime();
        _startDistance = getDistance(_startPoint1, _startPoint2); // 计算两点间的距离
        _startCenterPoint = getCenterPoint(_startPoint1, _startPoint2); // 计算两点间的中心
        setTransformOrigin.call(_this, $picture, _startCenterPoint); // 设置图片缩放的基点样式
      }
    });

    /* 触摸移动事件 */
    this.$el.on('touchmove', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var $picture = _this.$child.eq(_this.opts.index).find('img');
      _endPoint1.x = e.originalEvent.touches[0].pageX;
      _endPoint1.y = e.originalEvent.touches[0].pageY;
      _endPoint1.t = new Date().getTime();
      var _limitPosition = getLimitPosition.call(_this, $picture); // 获取图片的极限位置

      /* 这个是判断是否满足切换条件 */
      var _b = _this.opts.zoomNumber === 1 || (_this.opts.picturePosition.x === _limitPosition.left && _endPoint1.x - _startPoint1.x > 0) || (_this.opts.picturePosition.x === _limitPosition.right && _endPoint1.x - _startPoint1.x < 0);

      /* 缩放图片 */
      if ((_flag === 'none' && e.originalEvent.touches.length > 1) || _flag === 'zoom') {
        _endPoint2.x = e.originalEvent.touches[1].pageX;
        _endPoint2.y = e.originalEvent.touches[1].pageY;
        _endPoint2.t = new Date().getTime();
        _flag = 'zoom';
        _endDistance = getDistance(_endPoint1, _endPoint2);
        $picture.prefix({
          'transition': 'transform 0s',
          'transform': 'translate(' + _this.opts.picturePosition.x + 'px, ' + _this.opts.picturePosition.y + 'px) scale(' + _this.opts.zoomNumber * _endDistance / _startDistance + ')'
        });
      }

      /* 移动图片 */
      else if ((_flag === 'none' && !_b) || _flag === 'move') {
        _flag = 'move';
        var _newValue = {
          x: _this.opts.picturePosition.x + _endPoint1.x - _startPoint1.x,
          y: _this.opts.picturePosition.y + _endPoint1.y - _startPoint1.y
        }
        _newValue = adsorbability(_newValue, _limitPosition); // 增加吸附力效果
        $picture.prefix({
          'transition': 'transform 0s',
          'transform': 'translate(' + _newValue.x + 'px, ' + _newValue.y + 'px) scale(' + _this.opts.zoomNumber + ')'
        });
      }

      /* 切换图片 */
      else if ((_flag === 'none' && _b) || _flag === 'switch') {
        _flag = 'switch';
        _this.$container.prefix({
          'transition': 'transform 0s',
          'transform': 'translate(' + (_endPoint1.x - _startPoint1.x + getValue.call(_this)) + 'px, 0)'
        });
      }
    });

    /* 触摸结束事件 */
    this.$el.on('touchend', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var $picture = _this.$child.eq(_this.opts.index).find('img');
      switch (_flag) {
        case 'zoom': // 缩放图片
          _this.opts.zoomNumber = _this.opts.zoomNumber * _endDistance / _startDistance; // 缓存缩放倍数
          pictureZoom.call(_this, $picture); // 图片移动和缩放
          break;
        case 'move': // 移动图片
          $.extend(_this.opts.picturePosition, { // 缓存位移值
            x: _this.opts.picturePosition.x + _endPoint1.x - _startPoint1.x,
            y: _this.opts.picturePosition.y + _endPoint1.y - _startPoint1.y
          });
          pictureZoom.call(_this, $picture); // 图片移动和缩放
          break;
        case 'switch': // 切换图片
          if (_endPoint1.x - _startPoint1.x < -_this.opts.threShold) {
            _this.opts.index++;
          } else if (_endPoint1.x - _startPoint1.x > _this.opts.threShold) {
            _this.opts.index--;
          }
          play.call(_this); // 播放图片
          if (Math.abs(_endPoint1.x - _startPoint1.x) > _this.opts.threShold) {
            resetPictureInfo.call(_this); // 重置图片信息
          }
          break;
        default:
          return;
      }
      _flag = 'none';

      /* 当结束事件触发后剩于的点重新分配 */
      if (e.originalEvent.touches.length > 0) {
        _startPoint1.x = e.originalEvent.touches[0].pageX;
        _startPoint1.y = e.originalEvent.touches[0].pageY;
        _startPoint1.t = new Date().getTime();
        if (e.originalEvent.touches.length > 1) {
          _startPoint2.x = e.originalEvent.touches[1].pageX;
          _startPoint2.y = e.originalEvent.touches[1].pageY;
          _startPoint2.t = new Date().getTime();
          _startDistance = getDistance(_startPoint1, _startPoint2); // 计算两点间的距离
          _startCenterPoint = getCenterPoint(_startPoint1, _startPoint2); // 计算两点间的中心
          setTransformOrigin.call(_this, $picture, _startCenterPoint); // 设置图片缩放的基点样式
        }
      }
    });
  };

  /* 相册 */
  function PhototAlbum($el, options) {
    this.$el = $el;
    this.opts = $.extend({}, defaultParameters, options);
    this.$container = this.$el.find(this.opts.container);
    this.$child = this.$el.find(this.opts.child);
    this.length = this.$child.length;
    ready.call(this);
    if (this.opts.pagination) {
      initPagination.call(this);
    }
    if (this.opts.lazyLoad) {
      lazyLoading.call(this);
    }
    initEvent.call(this);
  };

  /* 播放上一张 */
  PhototAlbum.prototype.prev = function () {
    this.opts.index--;
    resetPictureInfo.call(this); // 重置图片信息
    play.call(this);
  };

  /* 播放下一张 */
  PhototAlbum.prototype.next = function () {
    this.opts.index++;
    resetPictureInfo.call(this); // 重置图片信息
    play.call(this);
  };

  /* 播放指定张 */
  PhototAlbum.prototype.goto = function (index) {
    if (this.opts.index !== index) {
      this.opts.index = index;
      resetPictureInfo.call(this); // 重置图片信息
      play.call(this);
    }
  };

  /* 插件 */
  function Plugin(options) {
    return new PhototAlbum($(this), options);
  };

  /* 绑定 */
  $.fn.phototAlbum = Plugin;

  $(function () {
    $('[js-plugin="phototAlbum"]').each(function (i, v) {
      $(this).phototAlbum({
        width: $(window).width(),
        height: $(window).height()
      });
    });
  });
}(jQuery));
