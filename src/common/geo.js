//h5本地获取地理位置
function getLocation(onSuccess) {
  var options = {
    enableHighAccuracy: true, //boolean 是否要求高精度的地理信息，默认为false
    maximumAge: 1000 //应用程序的缓存时间
  }

  if (navigator.geolocation) {
    //浏览器支持geolocation
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
  } else {
    //浏览器不支持geolocation
    console.log('浏览器不支持!');
  }
}

// //成功时
// function onSuccess(position) {
//   //返回用户位置
//   //经度
//   longitude = position.coords.longitude;
//   //纬度
//   latitude = position.coords.latitude;
// }

//失败时
function onError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert('用户拒绝对获取地理位置的请求');
      break;

    case error.POSITION_UNAVAILABLE:
      alert('位置信息是不可用的');
      break;

    case error.TIMEOUT:
      alert('请求用户地理位置超时');
      break;

    case error.UNKNOWN_ERROR:
      alert('未知错误');
      break;
  }

}


module.exports = {
  getLocation: getLocation
};
