
var invalidSession = false;

// setup the default parameter for all of the ajax requests
$.ajaxSetup({
  cache: false,
  xhrFields: {
    withCredentials: true
  },
  statusCode: {
    404: function () {
      console.log('页面被外星人偷走了，特攻队正在追赶中');
      return false;
    },
    500: function () {
      console.log('系统出了点儿问题，攻城狮正在修复中，敬请谅解');
      return false;
    },
    502: function () {
      console.log('网络貌似卡壳了，工程抢修队正在赶来');
      return false;
    }
  }
});
// whenever an ajax request completes with an error, check the xhr status;
$(document).off('ajaxError').on('ajaxError', function (res, xhr) {
  if (xhr.status == 0) {
    return;
  } else if (xhr.status == 401 && !invalidSession) {
    invalidSession = !0;
    window.sessionStorage.setItem('lastLocation', location.href);
    location.replace(location.pathname.indexOf('/user/') > -1 ? '/user/login.html' : '/');
  }
});
// abort the all the ajax requests when the session is expired.
$.ajaxPrefilter(function (options, originalOptions, xhr) {
  if (invalidSession) {
    xhr.abort();
  } else if (options.robot) {
    xhr.setRequestHeader('X-Robot', true);
  }
});
$(document).off('ajaxComplete').on('ajaxComplete', function (e, req, options) {
  if (!req.responseText) {
    return false;
  }
  var data = JSON.parse(req.responseText);
  if (data.code === 'EXXXX') {
    window.sessionStorage.setItem('lastLocation', location.href);
    location.replace(location.pathname.indexOf('/user/') > -1 ? '/user/login.html' : '/');
  }
});
