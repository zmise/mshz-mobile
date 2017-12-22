(function ($, undefined) {
  'use strict';

  var defaultParameters = {
    lr: 60, // 外圆半径
    sr: 30, // 内圆半径
    space: 5, // 间隙
    colors: ['#fcc900', '#f39801', '#59b9c7', '#3eb36f'], // 颜色
    series: [] // 数据
  };

  /* 绘制扇形  */
  function drawSector(cxt, x, y, r, sAngle, eAngle, space) {
    cxt.save();
    cxt.translate(x, y);
    cxt.beginPath();
    cxt.arc(0, 0, r, sAngle, eAngle);
    cxt.save();
    cxt.rotate(eAngle);
    cxt.moveTo(r, 0);
    cxt.lineTo(0, 0);
    cxt.lineWidth = space;
    cxt.strokeStyle = '#fff';
    cxt.stroke();
    cxt.restore();
    cxt.rotate(sAngle);
    cxt.lineTo(r, 0);
    cxt.lineWidth = space;
    cxt.strokeStyle = '#fff';
    cxt.stroke();
    cxt.closePath();
    cxt.restore();
  };

  /* 获取数组之和 */
  function getArraySum(arr) {
    var _sum = 0;
    $.each(arr, function (i) {
      _sum += parseFloat(this);
    });
    return _sum;
  };

  /* 初始化 */
  function init() {
    var _wid = this.$el.width();
    var _heg = this.$el.height();
    var _c = this.$el[0];
    var _cxt = _c.getContext('2d');
    var _deg = Math.PI / 180;
    var _width = _c.width;
    var _height = _c.height;
    var _sum = getArraySum(this.opts.series);
    var _num = 0;
    var _x = _width / 2;
    var _y = _height / 2;
    var _lr = this.opts.lr * _width / _wid;
    var _sr = this.opts.sr * _width / _wid;
    var _space = this.opts.space * _width / _wid;
    var colors = this.opts.colors;
    $.each(this.opts.series, function (i) {
      var _startAngle = _deg * (-90 + 360 * _num / _sum);
      _num += parseFloat(this);
      var _endAngle = _deg * (-90 + 360 * _num / _sum);
      drawSector(_cxt, _x, _y, _lr, _startAngle, _endAngle, _space);
      _cxt.fillStyle = colors[i];
      _cxt.fill();
    });
    drawSector(_cxt, _x, _y, _sr, 0, 360 * _deg, _space);
    _cxt.fillStyle = '#fff';
    _cxt.fill();
  };

  /* 扇形图  */
  function Sector($el, options) {
    this.$el = $el;
    this.opts = $.extend({}, defaultParameters, options);
    init.call(this);
  };

  /* 插件 */
  function Plugin(options) {
    return new Sector($(this), options);
  };

  $.fn.sector = Plugin;

  $(function () {
    $('canvas[js-plugin="sector"]').each(function () {
      $(this).sector({
        series: $(this).data('series').split(',')
      });
    });
  });
}(jQuery));