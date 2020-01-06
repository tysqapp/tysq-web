/**
 *  设置localStorage
 */
export const setStore = (name, val, time) => {
  window.localStorage.setItem(name, val)
}

export const getStore = (name) => {
  return window.localStorage.getItem(name)
}
export function hasClass (ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}
export function addClass (ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}
export function removeClass (ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}
export default {
  getTime (nS, boolean) {
    if (!nS) {
      return
    }
    let date = new Date(parseInt(nS * 1000))
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
  },
  formatToBeforeTime (datetime) {
    // 小于等于10分钟的显示 刚刚 <60*10*1000 = 6e5
    // 1小时内显示 X分钟前 <60*60*1000 = 3.6e6
    // 1天内显示 X小时前 <24*60*60*1000 = 8.64e7
    // 1月内显示 X天前 <30*24*60*60*1000 = 2592000000 = 2.592e9
    // 1月后显示 X个月前 <12*30*24*60*60*1000 = 24.592e9
    // 超过1年的显示 X年前 >12*30*24*60*60*1000 = 24.592e9
    let between = (new Date().getTime() - new Date(datetime * 1000).getTime())
    if (between > 0) {
      if (between < 6e5) {
        return `刚刚`
      }
      if (between < 3.6e6) {
        let mm = parseInt(between / 6e4)
        return `${mm}分钟前`
      }
      if (between < 8.64e7) {
        let HH = parseInt(between / 3.6e6)
        return `${HH}小时前`
      }
      if (between < 2.592e9) {
        let dd = parseInt(between / 8.64e7)
        return `${dd}天前`
      }
      if (between < 24.592e9) {
        let mm = parseInt(between / 2.592e9)
        return `${mm}月前`
      }
      if (between > 24.592e9) {
        let yy = parseInt(between / 24.592e9)
        return `${yy}年前`
      }
    } else {
      return `刚刚`
    }
  },
  formatSeconds (value) {
    let secondTime = parseInt(value)// 秒
    let minuteTime = 0// 分
    let hourTime = 0// 小时
    if (secondTime > 60) { // 如果秒数大于60，将秒数转换成整数
    // 获取分钟，除以60取整数，得到整数分钟
      minuteTime = parseInt(secondTime / 60)
      // 获取秒数，秒数取佘，得到整数秒数
      secondTime = parseInt(secondTime % 60)
      // 如果分钟大于60，将分钟转换成小时
      if (minuteTime > 60) {
      // 获取小时，获取分钟除以60，得到整数小时
        hourTime = parseInt(minuteTime / 60)
        // 获取小时后取佘的分，获取分钟除以60取佘的分
        minuteTime = parseInt(minuteTime % 60)
      }
    }
    let result = '' + parseInt(secondTime)
    if (parseInt(secondTime) < 10) {
      result = '0' + parseInt(secondTime)
    }

    if (minuteTime > 0) {
      if (minuteTime < 10) {
        result = '0' + parseInt(minuteTime) + ':' + result
      } else {
        result = '' + parseInt(minuteTime) + ':' + result
      }
    }
    if (hourTime > 0) {
      if (hourTime < 10) {
        result = '0' + parseInt(hourTime) + ':' + result
      } else {
        result = '' + parseInt(hourTime) + ':' + result
      }
    }
    return result
  },
  transformByte (fileByte) {
    var size = ''
    if (fileByte < 0.1 * 1024) {
      // 如果小于0.1KB转化成B
      size = fileByte.toFixed(2) + 'B'
    } else if (fileByte < 0.1 * 1024 * 1024) {
      // 如果小于0.1MB转化成KB
      size = (fileByte / 1024).toFixed(2) + 'KB'
    } else if (fileByte < 0.1 * 1024 * 1024 * 1024) {
      // 如果小于0.1GB转化成MB
      size = (fileByte / (1024 * 1024)).toFixed(2) + 'MB'
    } else {
      // 其他转化成GB
      size = (fileByte / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
    }
    var sizestr = size + ''
    var len = sizestr.indexOf('.')
    var dec = sizestr.substr(len + 1, 2)
    if (dec === '00') {
      // 当小数点后为00时 去掉小数部分
      return sizestr.substring(0, len) + sizestr.substr(len + 3, 2)
    }
    return sizestr
  },
  transforNumber (readNum) {
    var size = ''
    if (readNum < 10000) {
      size = readNum
    } else if (readNum > 10000) {
      size = (readNum / 10000).toFixed(1) + '万+'
    }
    var sizestr = size + ''
    var len = sizestr.indexOf('.')
    var dec = sizestr.substr(len + 1, 1)
    if (dec === '0') {
      // 当小数点后为0时 去掉小数部分
      return sizestr.substring(0, len) + sizestr.substr(len + 2, 2)
    }
    return sizestr
  }
}
