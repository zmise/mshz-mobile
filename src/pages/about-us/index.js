require('./index.scss');

require('../../assets/js/plugins.js');
require('../../assets/js/navigate.js');


$(function () {
  var loginInfo = JSON.parse(window.sessionStorage.getItem('loginInfo'));
  if (loginInfo) {
    $('#menu').removeClass('icon-gerenzhongxin').addClass('icon-daohanglancaidan').attr('href', 'javascript:;');
  }
});
