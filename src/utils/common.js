/**
 * 判断系统
 */

export function system () {
  var u = navigator.userAgent
  if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
    return 'Android'
  } else if (u.indexOf('iPhone') > -1) {
    return 'iPhone'
  } else if (u.indexOf('Windows Phone') > -1) {
    return 'windows'
  }
}
/**
 * 判断在不在app内
 * 调用方法
 */
export function isApp () {
  if (system() === 'iPhone') {
    if (window.openIniOS) {
      return true
    } else {
      return false
    }
  } else if (system() === 'Android') {
    if (window.openInAndroid) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

/**
 * app内不同的操作
 *
 */
export function actionApp (string, obj) {
  if (system() === 'iPhone') {
    if (window.openIniOS) {
      window.webkit.messageHandlers.comment_js_handel.postMessage({type: string, data: obj})
    } else {
      return 'windows'
    }
  } else if (system() === 'Android') {
    if (window.android) {
      if (window.android.openInAndroid) {
        window.android.fromHtml(string, JSON.stringify(obj))
      }
    } else {
      return 'windows'
    }
  } else {
    return 'windows'
  }
}

/**
 * 判断是否登录
 * userInfo  返回false  没有登录
 */

export function isLogin () {
  let UserInfo
  if (isApp()) {
    if (system() === 'Android') {
      UserInfo = window.UserInfo.getUserBean() ? JSON.parse(window.UserInfo.getUserBean()) : false
    } else {
      UserInfo = window.getIosUserDatas
    }
  }
  return UserInfo
}

export function getTime (nS, boolean) {
  if (!nS) {
    return
  }
  let date = new Date(parseInt(nS))
  let year = date.getFullYear()
  let mon = date.getMonth() + 1
  let day = date.getDate()
  let hours = date.getHours()
  let minu = date.getMinutes()
  let sec = date.getSeconds()
  if (mon < 10) {
    mon = '0' + mon
  };
  if (day < 10) {
    day = '0' + day
  };
  if (hours < 10) {
    hours = '0' + hours
  };
  if (minu < 10) {
    minu = '0' + minu
  };
  if (sec < 10) {
    sec = '0' + sec
  };
  if (boolean) {
    return year + '-' + mon + '-' + day
  } else {
    return year + '-' + mon + '-' + day + ' ' + hours + ':' + minu + ':' + sec
  }
}
