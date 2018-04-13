require('./index.scss');
require('../../assets/js/analytics.js');

require('../../assets/js/plugins.js');


function getUrlParam(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return decodeURIComponent(r[2]); //处理中文乱码
  return null; //返回参数值
}


var mp = new BMap.Map('allmap'); // 创建Map实例

var lng = getUrlParam('lng');
var lat = getUrlParam('lat');

var level = 15;

var point = new BMap.Point(lng, lat);

mp.centerAndZoom(point, level);

 //开启鼠标滚轮缩放
mp.enableScrollWheelZoom();


// var opts = {
//   position: point, // 指定文本标注所在的地理位置
// }
// 复杂的自定义覆盖物
function ComplexCustomOverlay(point, text) {
  this._point = point;
  this._text = text;
}
ComplexCustomOverlay.prototype = new BMap.Overlay();
ComplexCustomOverlay.prototype.initialize = function (map) {
  this._map = map;
  var div = this._div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
  div.style.backgroundColor = '#000';
  div.style.color = '#fff';
  div.style.padding = '.1rem .2rem';
  div.style.fontSize = '.24rem';
  div.style.whiteSpace = 'nowrap';
  div.style.MozUserSelect = 'none';
  div.style.opacity = .6;
  div.style.borderRadius = '.2rem';
  var span = this._span = document.createElement('span');
  span.id = 'textName';
  div.appendChild(span);
  span.appendChild(document.createTextNode(this._text));
  var that = this;
  var arrow = this._arrow = document.createElement('div');

  arrow.style.position = 'absolute';
  arrow.style.width = '0';
  arrow.style.height = '0';
  arrow.style.borderTop = '.2rem solid #000';
  arrow.style.borderLeft = '.1rem solid transparent';
  arrow.style.borderRight = '.1rem solid transparent';
  arrow.style.overflow = 'hidden';
  div.appendChild(arrow);
  map.getPanes().labelPane.appendChild(div);
  return div;
}


ComplexCustomOverlay.prototype.draw = function () {
  var map = this._map;
  var pixel = map.pointToOverlayPixel(this._point);
  // this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
  var text = $('#textName')[0];
  this._div.style.left = pixel.x - text.offsetWidth / 2 + 'px';
  this._div.style.top = pixel.y - text.offsetHeight / 2 + 'px';
  this._arrow.style.left = $('#textName')[0].offsetWidth / 2 + 'px';
  this._arrow.style.top = $('#textName')[0].clientHeight + 24 + 'px';
}

var content = getUrlParam('content');
var myCompOverlay = new ComplexCustomOverlay(new BMap.Point(lng, lat), content);
console.log(myCompOverlay);
mp.addOverlay(myCompOverlay);



mp.addControl(geolocationControl);

var geolocationControl = new BMap.GeolocationControl();


geolocationControl.addEventListener('locationSuccess', function (e) {
  // 定位成功事件
  var Dlng = e.target.vD.lng;
  var Dlat = e.target.vD.lat;
  $('#circle').attr('href', 'http://api.map.baidu.com/direction?origin=' + Dlat + ',' + Dlng + '&destination=' + lat + ',' + lng + '&mode=driving&region=深圳&output=html');
});
geolocationControl.addEventListener('locationError', function (e) {
  // 定位失败事件
  alert('获取不到定位，请检查手机定位设置');
});

mp.addControl(geolocationControl);

$('#circle').on('click', function () {
  var geolocation = new BMap.Geolocation();
  geolocation.getCurrentPosition(function (result) {
    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
      var latCurrent = result.point.lat;//获取到的纬度
      var lngCurrent = result.point.lng;//获取到的经度
      if (latCurrent && lngCurrent) {
        window.location.href = "http://api.map.baidu.com/direction?origin=" + latCurrent + "," + lngCurrent + "&destination=" + lat + "," + lng + "&mode=driving&region=深圳&output=html";
      } else {
        alert('获取不到定位，请检查手机定位设置');
      }
    }
  });
});


// 点击返回回到上一页
$('#back').on('click', function (e) {
  e.stopPropagation();
  e.preventDefault();
  history.go(-1);
});
