
import axios from 'axios'
import store from '../store/index'
import Cookies from 'js-cookie'
import weui from 'weui.js'
import router from '../router'
import 'weui'
import qs from 'qs'
let ax = axios.create({
  baseURL: '/',
  withCredentials: true, // 跨域携带证书
  timeout: 30000,
  headers: {
    'content-type': 'application/json;charset=UTF-8'
  }
})
let fileStream = axios.create({
  baseURL: '/',
  withCredentials: false, // 跨域携带证书
  timeout: 50000,
  headers: {
    'content-type': 'application/json;charset=UTF-8'
  },
  responseType: 'blob'
})
function system () {
  var u = navigator.userAgent
  if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
    return 'Android'
  } else if (u.indexOf('iPhone') > -1) {
    return 'iPhone'
  } else if (u.indexOf('Windows Phone') > -1) {
    return 'windows'
  }
}

const itr = (type, url, params) => {
  if (typeof params !== 'object') {
    params = {}
  }
  let arg = qs.stringify(params)
  if (Object.keys(params).length > 0) {
    url = (type === 'get') ? url + '?' + arg : url
  }

  return ax[type](url, params)
}
const streamItr = (type, url, params) => {
  if (typeof params !== 'object') {
    params = {}
  }
  let arg = qs.stringify(params)
  if (Object.keys(params).length > 0) {
    url = (type === 'get') ? url + '?' + arg : url
  }

  return fileStream[type](url, params)
}

const base = (type, url, params, loadingFlag, loadingText) => {
  if (loadingFlag) {
    var loading = weui.loading(loadingText, {className: 'custom-classname'})
  }
  return new Promise((resolve, reject) => {
    itr(type, url, params)
      .then(response => {
        if (response.data.status === 2999 || response.data.status === 2998) {
          store.commit('flagLogin', true)
          store.commit('flagTime', true)
          store.commit('flagArticleEditor', true)
          store.commit('flagLoginInfo', false)
          Cookies.set('info', '', -1)
          if (system() === 'iPhone') {
            if (window.openIniOS) {
              weui.dialog({
                content: '请登录APP',
                className: 'custom-classname',
                buttons: [{
                  label: '关闭',
                  onClick: function () {}
                }]
              })
            } else {
              store.commit('flagBuyCoin', true)
            }
          } else if (system() === 'Android') {
            if (window.android) {
              if (window.android.openInAndroid) {
                weui.dialog({
                  content: '请登录APP',
                  className: 'custom-classname',
                  buttons: [{
                    label: '关闭',
                    onClick: function () {}
                  }]
                })
              }
            } else {
              store.commit('flagBuyCoin', true)
            }
          } else {
            store.commit('flagBuyCoin', true)
          }
        } else if (response.data.status === 3998) {
          router.replace('/nopassage')
        } else {
          store.commit('flagTime', false)
          store.commit('flagArticleEditor', false)
          resolve(response.data)
        }
        if (loadingFlag) {
          loading.hide()
        }
      })
      .catch(error => {
        reject(error.data)
      })
  })
}

const baseStream = (type, url, params, loadingFlag, loadingText) => {
  if (loadingFlag) {
    var loading = weui.loading(loadingText, {className: 'custom-classname'})
  }
  return new Promise((resolve, reject) => {
    streamItr(type, url, params)
      .then(response => {
        if (response.data.status === 2999 || response.data.status === 2998) {
          store.commit('flagLogin', true)
          store.commit('flagTime', true)
          store.commit('flagArticleEditor', true)
          store.commit('flagLoginInfo', false)
          Cookies.set('info', '', -1)
          if (system() === 'iPhone') {
            if (window.openIniOS) {
              weui.dialog({
                content: '请登录APP',
                className: 'custom-classname',
                buttons: [{
                  label: '关闭',
                  onClick: function () {}
                }]
              })
            } else {
              store.commit('flagBuyCoin', true)
            }
          } else if (system() === 'Android') {
            if (window.android) {
              if (window.android.openInAndroid) {
                weui.dialog({
                  content: '请登录APP',
                  className: 'custom-classname',
                  buttons: [{
                    label: '关闭',
                    onClick: function () {}
                  }]
                })
              }
            } else {
              store.commit('flagBuyCoin', true)
            }
          } else {
            store.commit('flagBuyCoin', true)
          }
        } else if (response.data.status === 3998) {
          router.replace('/nopassage')
        } else {
          store.commit('flagTime', false)
          store.commit('flagArticleEditor', false)
          resolve(response.data)
        }
        if (loadingFlag) {
          loading.hide()
        }
      })
      .catch(error => {
        reject(error.data)
      })
  })
}

export const g = (url, params, loadingFlag, loadingText) => {
  return base('get', url, params, loadingFlag, loadingText)
}

export const p = (url, params, loadingFlag, loadingText) => {
  return base('post', url, params, loadingFlag, loadingText)
}
// 是因为 post 和 put 第二个参数是data，所以可以直接在第二个参数的位置写上数据，
// 后台可以访问到,而delete第二个参数是 config ，所以要通过 config 里面的 data 来传参，所以应该这样写：axios.delete('/api',{data:{id:1}})
export const d = (url, params, loadingFlag, loadingText) => {
  return base('delete', url, {data: params}, loadingFlag, loadingText)
}

export const u = (url, params, loadingFlag, loadingText) => {
  return base('put', url, params, loadingFlag, loadingText)
}
export const pa = (url, params, loadingFlag, loadingText) => {
  return base('patch', url, loadingFlag, loadingText)
}

export const op = (url, params, loadingFlag, loadingText) => {
  return base('options', url, params, loadingFlag, loadingText)
}

export const gstream = (url, params, loadingFlag, loadingText) => {
  return baseStream('get', url, params, loadingFlag, loadingText)
}
