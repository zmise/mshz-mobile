require('./index.scss');
require('../../assets/js/analytics.js');

require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');
require('../../assets/js/record'); //判断无痕模式


$(function () {
  window.sessionStorage.setItem('lastLocation', location.href);

  $('#back').on('click', function (e) {

    e.stopPropagation();
    e.preventDefault();
    history.go(-1);
  });

});
