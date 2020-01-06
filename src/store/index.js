import Vue from 'vue'
import Vuex from 'vuex'
import {getStore} from '../utils'
import * as types from './mutation-types'
import Cookies from 'js-cookie'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
let userName = Cookies.get('info') ? JSON.parse(Cookies.get('info')).account : ''
let userHeadUrl = Cookies.get('info') ? JSON.parse(Cookies.get('info')).head_url : ''
const store = new Vuex.Store({
  state: {
    user_name: userName,
    user_headUrl: userHeadUrl,
    language: 0,
    screenWidth: getStore('screenWidth'),
    login_info: false,
    isActive: true,
    sureActive: '',
    showLogin: false,
    timeOut: false,
    buyCoin: false,
    newsCount: 0,
    articleEditorFlag: false,
    theme: 'simplicity-black',
    login_status: false
  },
  getters: {
    language: state => {
      return state.language
    },
    screenWidth: state => {
      return state.screenWidth
    },
    isActive: state => {
      return state.isActive
    }
  },
  actions: {
    setScreenwidth ({ commit }, payload) {
      commit(types.SET_SCREEN_WIDTH, payload)
    },
    ToggleSideBar ({ commit }, payload) {
      commit(types.TOGGLE_SIDEBAR, payload)
    }
  },
  mutations: {
    [types.CHANGE_LANGUAGE] (state, payload) {
      state.language = payload
    },
    [types.SET_SCREEN_WIDTH] (state, payload) {
      state.screenWidth = payload
    },
    [types.TOGGLE_SIDEBAR] (state, payload) {
      state.isActive = !state.isActive
    },
    flagActive (state, type) {
      state.sureActive = type
    },
    flagLogin (state, type) {
      state.showLogin = type
    },
    flagTime (state, type) {
      state.timeOut = type
    },
    flagBuyCoin (state, type) {
      state.buyCoin = type
    },
    flagLoginStatus (state, type) {
      state.login_status = type
    },
    newsCountData (state, type) {
      state.newsCount = type
    },
    flagUserName (state, type) {
      state.user_name = type
    },
    flagUserHeadUrl (state, type) {
      state.user_headUrl = type
    },
    flagLoginInfo (state, type) {
      state.login_info = type
    },
    flagArticleEditor (state, type) {
      state.articleEditorFlag = type
    },
    flagTheme (state, type) {
      state.theme = type
    }
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

export default store
