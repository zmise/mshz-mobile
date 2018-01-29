
function formatDate(timestamp, fmt, humanized) {
  if (timestamp instanceof Date) {
    timestamp = timestamp.getTime();
  } else if (typeof timestamp == 'string') {
    timestamp = new Date(timestamp);
  }
  if (timestamp != null) {
    var localTime = new Date(timestamp + (new Date(timestamp).getTimezoneOffset() - -480) * 60 * 1000);
    // get the date from client side, but it may not be the same as the date from server side
    var today = new Date();
    var o = {
      'M+': localTime.getMonth() + 1,
      'd+': localTime.getDate(),
      'h+': localTime.getHours(),
      'm+': localTime.getMinutes(),
      's+': localTime.getSeconds()
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (localTime.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
      }
    }
    return fmt;
  } else {
    return '';
  }
}

module.exports = {
  formatDate: formatDate
};
