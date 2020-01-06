import Cookies from 'js-cookie'
import * as http from './http'
import store from '../store/index'
var websock = null
var lockReconnect = false
var wsUrl = process.env.API_ROOT + '/notify/ws'
var tt

function createWebSocket () {
  try {
    if ('WebSocket' in window) {
      websock = new WebSocket(wsUrl)
    } else {
      alert('您的浏览器不支持websocket协议,建议使用新版谷歌、火狐等浏览器，请勿使用IE10以下浏览器，360浏览器请使用极速模式，不要使用兼容模式！"')
    }
    initWebSocket()
  } catch (e) {
    console.log('catch')
    reconnect(wsUrl)
  }
}
function initWebSocket () {
  websock.onmessage = function (e) {
    websocketonmessage(e)
  }
  websock.onclose = function (e) {
    websocketclose(e)
  }
  websock.onopen = function () {
    websocketOpen()
  }
  websock.onerror = function () {
    console.log('WebSocket连接发生错误')
    reconnect(wsUrl)
  }
}
function reconnect (url) {
  if (Cookies.get('info')) {
    if (lockReconnect) {
      return
    };
    lockReconnect = true
    tt && clearTimeout(tt)
    tt = setTimeout(function () {
      createWebSocket(url)
      http.scoketToken().then(res => {
        if (res.status === 0) {
          sendSock({code: 3, data: {token: res.data.token}})
        }
      })
      lockReconnect = false
    }, 4000)
  } else {
    return false
  }
}
function sendSock (agentData) {
  if (websock.readyState === websock.OPEN) {
    websocketsend(agentData)
  } else if (websock.readyState === websock.CONNECTING) {
    setTimeout(function () {
      sendSock(agentData)
    }, 1000)
  } else {
    setTimeout(function () {
      sendSock(agentData)
    }, 1000)
  }
}
function websocketonmessage (e) {
  let res = JSON.parse(e.data)
  if (res.code === 4) {
    store.commit('newsCountData', res.unread)
  }
  heartCheck.start()
}
function websocketsend (agentData) {
  websock.send(JSON.stringify(agentData))
}
function websocketclose (e) {
  console.log('connection closed (' + e.code + ')')
  reconnect(wsUrl)
}
function websocketOpen (e) {
  console.log('连接成功')
  heartCheck.start()
}
var heartCheck = {
  timeout: 3000,
  timeoutObj: null,
  serverTimeoutObj: null,
  start: function () {
    console.log('start')
    var self = this
    this.timeoutObj && clearTimeout(this.timeoutObj)
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
    this.timeoutObj = setTimeout(function () {
      websocketsend({code: 1, data: null})
      self.serverTimeoutObj = setTimeout(function () {
        websock.close()
      }, self.timeout)
    }, this.timeout)
  }
}

export {
  createWebSocket,
  websock,
  sendSock
}
