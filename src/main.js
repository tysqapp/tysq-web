// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import Cookies from 'js-cookie'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css' // this css must import if you use hidden style class.
import 'normalize.css'
import 'font-awesome/css/font-awesome.css'
import './styles/index.scss' // global css
import './styles/theme.css'// theme css
import store from './store'
import * as http from '@/api/http' // 全局封装的http请求。
// import * as socketApi from '@/api/socket' // 全局封装的scoket请求。
import * as forTime from './utils/index'
import FastClick from 'fastclick'
import {ChineseName, phoneNumber, flexNumber, userNumber1, userNumber2, intNumber, intFloat, addressEmail, isWscnEmail, intzeroNumber, twoDouble, Email} from './utils/validate' // 验证引入
import {actionApp} from './utils/common'
import App from './App'
import router from './router'
import uploader from 'vue-simple-uploader'
import LyTab from 'ly-tab'
import toastRegistry from './components/vueToast/index'
import 'jquery'
Vue.use(uploader)
Vue.use(LyTab)
Vue.use(toastRegistry)
// 表单验证方法的使用
Vue.prototype.ChineseName = ChineseName// 中文名字
Vue.prototype.phoneNumber = phoneNumber// 手机号码
Vue.prototype.flexNumber = flexNumber// 座机电话号码
Vue.prototype.userNumber1 = userNumber1// 15位身份证
Vue.prototype.userNumber2 = userNumber2// 18位身份证
Vue.prototype.isWscnEmail = isWscnEmail// 是否是公司邮箱
Vue.prototype.addressEmail = addressEmail// 地址邮编
Vue.prototype.Email = Email// 邮箱
Vue.prototype.actionApp = actionApp// 判断是否在app内
// Vue.prototype.chineseEnglish=chineseEnglish;//只能中文英文，不能单独的数字，字母，可以是单独的汉字
Vue.prototype.intFloat = intFloat// 只能输入正整数和两位有效小数
// Vue.prototype.stringChinese=stringChinese;//只能纯数字和中文
Vue.prototype.intNumber = intNumber// 只能输入正整数
Vue.prototype.twoDouble = twoDouble// 只能输入整数以及两位有效小数
Vue.prototype.intzeroNumber = intzeroNumber// 只能输入整数以及两位有效小数
// Vue.prototype.alidateURL=validateURL;//合法url
// Vue.prototype.validateLowerCase=validateLowerCase//小写字母;
// Vue.prototype.validateKey=validateKey;//验证key
// Vue.prototype.validateUpperCase=validateUpperCase;//大写字母
// Vue.prototype.validatAlphabets=validatAlphabets;//大小写字母

Vue.config.productionTip = false
Vue.prototype.http = http// 全局封装的http请求挂载在Vue原型对象上面。
Vue.prototype.getTime = forTime.default.getTime
Vue.prototype.formatToBeforeTime = forTime.default.formatToBeforeTime
Vue.prototype.transformByte = forTime.default.transformByte
Vue.prototype.formatSeconds = forTime.default.formatSeconds
Vue.prototype.transforNumber = forTime.default.transforNumber
Vue.prototype.Cookies = Cookies
// Vue.prototype.socketApi = socketApi

Vue.use(ElementUI)

Vue.directive('unmodel', {
  bind (el, binding, node) {
    binding.value && node.componentInstance && node.componentInstance.$off('input')// 尝试批量取消，但是失败了..
  }
})
document.addEventListener('DOMContentLoaded', function () {
  FastClick.attach(document.body)
}, false)

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    if (to.path === '/home') {
      if (to.query.name) {
        if (to.query.name && to.query.sub_name) {
          document.title = to.query.name + '-' + to.query.sub_name + '-' + to.meta.title
        } else {
          document.title = to.query.name + '-' + to.meta.title
        }
      } else {
        document.title = to.meta.title
      }
    } else {
      document.title = to.meta.title
    }
  }
  if (to.path !== '/home' && to.path !== '/articleEditor' && to.path !== '/article/info') {
    clearSessionStorage('parent_id')
    clearSessionStorage('category_id')
    clearSessionStorage('nav_index')
    clearSessionStorage('sub_nav_index')
    clearSessionStorage('category_info_id')
  }
  next()
})

function clearSessionStorage (params) {
  if (window.sessionStorage.getItem(params)) {
    window.sessionStorage.removeItem(params)
  }
}
router.afterEach((to, from) => {
  /* 路由发生变化修改页面title */
  if (document.getElementById('analytics_js')) {
    document.body.removeChild(document.getElementById('analytics_js'))
  }
  let script = document.createElement('script')
  script.src = 'static/analytics.js'
  script.id = 'analytics_js'
  document.body.append(script)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
