module.exports = {
  setSessionRecord: function (key, value, boolean) {
    if (typeof sessionStorage === 'object') {
      try {
        window.sessionStorage.setItem(key, value);
      } catch (e) {
        if (boolean) {
          alert('您处于无痕浏览，无法为您保存。请切换浏览模式');
        }
      }
    }
  },
  getSessionRecord: function (key, boolean) {
    if (typeof sessionStorage === 'object') {
      try {
        window.sessionStorage.getItem(key);
      } catch (e) {
        if (boolean) {
          alert('您处于无痕浏览，无法为您保存。请切换浏览模式');
        }
      }
    }
  },
  removeSessionRecord: function (key, boolean) {
    if (typeof sessionStorage === 'object') {
      try {
        window.sessionStorage.removeItem(key);
      } catch (e) {
        if (boolean) {
          alert('您处于无痕浏览，无法为您保存。请切换浏览模式');
        }
      }
    }
  },
  setLocalRecord: function (key, value, boolean) {
    if (typeof localStorage === 'object') {
      try {
        window.localStorage.setItem(key, value);
      } catch (e) {
        if (boolean) {
          alert('您处于无痕浏览，无法为您保存。请切换浏览模式');
        }
      }
    }
  },
  getLocalRecord: function (key, boolean) {
    if (typeof localStorage === 'object') {
      try {
        window.localStorage.getItem(key);
      } catch (e) {
        if (boolean) {
          alert('您处于无痕浏览，无法为您保存。请切换浏览模式');
        }
      }
    }
  },
  removeLocalRecord: function (key, boolean) {
    if (typeof localStorage === 'object') {
      try {
        window.localStorage.removeItem(key);
      } catch (e) {
        if (boolean) {
          alert('您处于无痕浏览，无法为您保存。请切换浏览模式');
        }
      }
    }
  },

}