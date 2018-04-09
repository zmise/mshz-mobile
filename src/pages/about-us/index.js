require('./index.scss');
require('../../assets/js/analytics.js');

require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');
var record = require('../../assets/js/record'); //判断无痕模式


$(function () {
  record.setSessionRecord('lastLocation', location.href, true);

  $('#back').on('click', function (e) {

    e.stopPropagation();
    e.preventDefault();
    history.go(-1);
  });

});
