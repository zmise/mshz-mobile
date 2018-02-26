require('./index.scss');
require('../../assets/js/analytics.js');

require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');


$(function () {

  $('#back').on('click', function (e) {

    e.stopPropagation();
    e.preventDefault();
    history.go(-1);
  });

});
