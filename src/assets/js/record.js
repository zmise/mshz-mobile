// 检测是否是无痕模式 sessionStorage是否处理  try catch语法降级处理
try {
  sessionStorage.setItem('1-1-1-1', 1);
} catch (e) {
  alert('您处于无痕浏览，无法为您保存。请切换浏览模式');
  sessionStorage.setItem = function (a, b) {
  }
  sessionStorage.getItem = function (a, b) {
  }
  sessionStorage.removeItem = function (a, b) {
  }
  localStorage.setItem = function (a, b) {
  }
  localStorage.getItem = function (a, b) {
  }
  localStorage.removeItem = function (a, b) {
  }
}

