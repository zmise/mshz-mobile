require('./index.scss');
require('../../assets/js/analytics.js');

$(function () {
  function getOS() {
    var ua = navigator.userAgent.toLowerCase();
    var os = 'android';
    if (/micromessenger/.test(ua)) {
      os = 'mm';
    } else if (/(iphone|ipad|ipod|ios)/.test(ua)) {
      os = 'iOS';
    } else if (/(android)/.test(ua)) {
      os = 'android';
    }
    return os;
  }

  function getiOS() {
    var iOSUrl =
      'http://agentapp.qfang.com/qfang-agent-api/product/download/getDownloadUrl?callback=downloadAPP&productId=bef877d9-de55-404d-8cdb-5c9871bcfe7b&productType=&mobileSystem=IOS';

    $.ajax({
      url: iOSUrl,
      type: 'GET',
      dataType: 'jsonp',
      jsonp: 'callback',
      jsonpCallback: 'downloadAPP'
    });
  };

  function getAndroid() {
    var androidUrl = '/app/update.json?' + Math.random();
    $.ajax({
      url: androidUrl,
      type: 'GET',
      dataType: 'json',
      success: function (res) {
        if (res.url) {
          downloadAPP(res.url);
        }
      }
    });
  }

  var os = getOS();

  if (os === 'mm') {
    $('#overlay').show();
  } else {
    $('#btnDownload').on('click', os === 'iOS' ? getiOS : getAndroid);
  }

});

window.downloadAPP = function (url) {
  location.href = url;
}
