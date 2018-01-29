require('./index.scss');

require('../../assets/js/plugins.js');


function getUrlParam(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return decodeURI(r[2]); //处理中文乱码
  return null; //返回参数值
}


var mp = new BMap.Map('allmap'); // 创建Map实例
// 22.538246,113.931198
// var lng = 113.931198;

var lng = getUrlParam('lng');
// var lat = 22.538246;
var lat = getUrlParam('lat');
var level = 15;
// var level = getUrlParam('level');
var point = new BMap.Point(lng, lat);

mp.centerAndZoom(point, level);

mp.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

var geolocationControl = new BMap.GeolocationControl();


var opts = {
  position: point, // 指定文本标注所在的地理位置
}
// 复杂的自定义覆盖物
function ComplexCustomOverlay(point, text) {
  this._point = point;
  this._text = text;
}
ComplexCustomOverlay.prototype = new BMap.Overlay();
ComplexCustomOverlay.prototype.initialize = function (map) {
  this._map = map;
  var div = this._div = document.createElement('div');
  div.className = 'overlay';
  div.style.position = 'absolute';
  // div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
  // div.style.backgroundColor = '#000';
  // div.style.color = '#fff';
  // div.style.paddingTop = '.12rem';
  // div.style.paddingBottom = '.12rem';
  // div.style.paddingRight = '.15rem';
  // div.style.paddingLeft = '.15rem';
  // div.style.fontSize = '.3rem';
  // div.style.whiteSpace = "nowrap";
  // div.style.MozUserSelect = "none";
  // div.style.opacity = .6;
  // div.style.borderRadius = '.1rem';
  div.style.backgroundColor = '#000';
  div.style.color = '#fff';
  div.style.paddingTop = '.25rem';
  div.style.paddingBottom = '.25rem';
  div.style.paddingRight = '.3rem';
  div.style.paddingLeft = '.3rem';
  div.style.fontSize = '.6rem';
  div.style.whiteSpace = "nowrap";
  div.style.MozUserSelect = "none";
  div.style.opacity = .6;
  div.style.borderRadius = '.2rem';
  var span = this._span = document.createElement('span');
  span.className = 'overSpan';
  div.appendChild(span);
  span.appendChild(document.createTextNode(this._text));
  var that = this;
  var arrow = this._arrow = document.createElement('div');

  arrow.style.position = 'absolute';
  arrow.style.width = '1rem';
  arrow.style.height = '1rem';
  arrow.style.borderTop = '1rem solid #000';
  arrow.style.borderLeft = '.5rem solid transparent';
  arrow.style.borderRight = '.5rem solid transparent';
  arrow.style.overflow = 'hidden';
  div.appendChild(arrow);
  map.getPanes().labelPane.appendChild(div);
  return div;
}



ComplexCustomOverlay.prototype.draw = function () {
  var map = this._map;
  var pixel = map.pointToOverlayPixel(this._point);
  var that = this;
  that._div.style.left = pixel.x - $('.overlay')[0].clientWidth / 2 + 'px';
  that._div.style.top = pixel.y - $('.overlay')[0].clientHeight - 10 + 'px';
  that._arrow.style.left = $('.overSpan')[0].offsetWidth / 2 + 'px';
  that._arrow.style.top = $('.overlay')[0].clientHeight - 2 + 'px';
}

// var content = '桃园地铁站';


var content = getUrlParam('content');
var myCompOverlay = new ComplexCustomOverlay(new BMap.Point(lng, lat), content);
console.log(myCompOverlay);
mp.addOverlay(myCompOverlay);



mp.addControl(geolocationControl);

var geolocationControl = new BMap.GeolocationControl();


geolocationControl.addEventListener("locationSuccess", function (e) {
  // 定位成功事件
  var Dlng = e.target.vD.lng;
  var Dlat = e.target.vD.lat;
  $('#circle').attr('href', 'http://api.map.baidu.com/direction?origin=' + Dlat + ',' + Dlng + '&destination=' + lat + ',' + lng + '&mode=driving&region=深圳&output=html');
});
geolocationControl.addEventListener("locationError", function (e) {
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




// function getNavigation() {
//   var geolocation = new BMap.Geolocation();
//   geolocation.getCurrentPosition(function (r) {
//     if (this.getStatus() == BMAP_STATUS_SUCCESS) {
//       var mk = new BMap.Marker(r.point);
//       mp.addOverlay(mk);
//       //map.panTo(r.point);//地图中心点移到当前位置
//       var latCurrent = r.point.lat;
//       var lngCurrent = r.point.lng;
//       // alert('我的位置：' + latCurrent + ',' + lngCurrent);
//       // 我的位置：22.54605355,114.02597366
//       window.location.href = "http://api.map.baidu.com/direction?origin=" + latCurrent + "," + lngCurrent +
//         "&destination=" + lat + "," + lng + "&mode=driving&region=深圳&output=html";
//       // window.location.href = "http://api.map.baidu.com/direction?origin=" + latCurrent + "," + lngCurrent +
//       //   "&destination=22.538246,113.931198&mode=driving&region=深圳&output=html";


//     } else {
//       alert('failed' + this.getStatus());
//     }
//   }, {
//       enableHighAccuracy: true
//     })

// }

// $('#circle').on('click', function () {
//   var latCurrent, lngCurrent
//   var geolocation = new BMap.Geolocation();
//   geolocation.getCurrentPosition(function (result) {
//     if (this.getStatus() == BMAP_STATUS_SUCCESS) {
//       var mk = new BMap.Marker(result.point);//创建一个覆盖物
//       mp.addOverlay(mk);//增加一个标示到地图上
//       latCurrent = result.point.lat;//获取到的纬度
//       lngCurrent = result.point.lng;//获取到的经度
//       if (latCurrent && lngCurrent) {
//         window.location.href = 'http://api.map.baidu.com/direction?origin=' + latCurrent + ',' + lngCurrent + '&destination=' + lat + ',' + lng + '&mode=driving&region=深圳&output=html';
//         console.log('http://api.map.baidu.com/direction?origin=' + latCurrent + ',' + lngCurrent + '&destination=' + lat + ',' + lng + '&mode=driving&region=深圳&output=html');
//       }
//     } else {
//       alert('请获取定位');
//     }
//   });

// });

// setTimeout(function () {
//   console.log(latCurrent, lngCurrent)

//   document.getElementById('circle').href = "http://api.map.baidu.com/direction?origin=" + latCurrent + "," + lngCurrent + "&destination=" + lat + "," + lng + "&mode=driving&region=深圳&output=html";
// }, 500);
// document.getElementById('circle').onclick = function (e) {
//   getNavigation();
// };


// document.getElementById('circle').onclick = function (e) {
//   window.location.href = "http://api.map.baidu.com/direction?origin=" + latCurrent + "," + lngCurrent +
//     "&destination=" + lat + "," + lng + "&mode=driving&region=深圳&output=html";
//   //  window.location.href = "http://api.map.baidu.com/direction?origin=22.54605355,114.02597366&destination=22.538246,113.931198&mode=driving&region=深圳&output=html"
// };
