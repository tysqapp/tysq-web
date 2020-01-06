import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/layout'
import Home from '@/views/home/home'
import YunManage from '@/views/yunManage'
import UserInfo from '@/views/userInfo'
import OtherUserInfo from '@/views/otherUserInfo'
import ArticleInfo from '@/views/article/info'
import ArticleEditor from '@/views/articleEditor'
import Getpassword from '@/views/personal/getpassword'
import GetpasswordTwo from '@/views/personal/getpassword_two'
import nopassage from '@/views/nopassage'
import NotFound from '@/views/404'
import invitationRegistration from '@/views/invitationRegistration'
import InviteFriends from '@/views/inviteFriends'
import CoinDetailed from '@/views/coinDetailed'
import IntegralRank from '@/views/integralRank'
import IntegralDetailed from '@/views/integralDetailed'
import ModerLayout from '@/views/moderLayout'
import ModerArticle from '@/views/moderArticle'
import ModerComment from '@/views/moderComment'
import Accusation from '@/views/accusation'
import EditLayout from '@/views/editLayout'
import EditInfo from '@/views/editInfo'
import UserSet from '@/views/userSet'
import news from '@/views/news'
import Search from '@/views/search'
Vue.use(Router)
let responseText = $.getJSON({url: 'config/config.json', async: false}).responseText
window.GlodConfig = responseText !== '404 page not found' ? JSON.parse(responseText) : {title: '', icon_src: '', logo_src: '', invitatonLogo_src: '', footNote: '', fortheRecord: '', agreement: '', explain: '', download_src: ''}

// window.GlodConfig = {title: '', icon_src: '', logo_src: '', invitatonLogo_src: '', footNote: '', fortheRecord: '', agreement: '', explain: '', download_src: ''}

var linkEle = document.getElementById('link')
linkEle.href = window.GlodConfig.icon_src // 验证引入
export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '',
      name: 'Layout',
      component: Layout,
      redirect: 'home',
      children: [{
        path: 'home',
        name: 'Home',
        meta: {keepAlive: false, title: window.GlodConfig.title},
        component: Home
      }, {
        path: '/personal/getpassword',
        meta: {keepAlive: false, title: '找回密码-' + window.GlodConfig.title},
        name: 'getpassword',
        component: Getpassword
      }, {
        path: '/personal/GetpasswordTwo',
        name: 'GetpasswordTwo',
        meta: {keepAlive: false, title: '找回密码-' + window.GlodConfig.title},
        component: GetpasswordTwo
      }, {
        path: '/article/info',
        name: 'ArticleInfo',
        meta: {keepAlive: false},
        component: ArticleInfo
      }, {
        path: '/articleEditor',
        name: 'articleEditor',
        meta: {keepAlive: false, title: '写文章-' + window.GlodConfig.title},
        component: ArticleEditor
      }, {
        path: '/yunManage',
        name: 'yunManage',
        meta: {keepAlive: false, title: '我的云盘-' + window.GlodConfig.title},
        component: YunManage
      }, {
        path: '/userInfo',
        name: 'userInfo',
        meta: {keepAlive: false},
        component: UserInfo
      }, {
        path: '/otherUserInfo',
        name: 'otherUserInfo',
        meta: {keepAlive: false},
        component: OtherUserInfo
      }, {
        path: '/nopassage',
        name: 'nopassage',
        meta: {keepAlive: false},
        component: nopassage
      }, {
        path: '/inviteFriends',
        name: 'inviteFriends',
        meta: {keepAlive: false, title: '我的好友-' + window.GlodConfig.title},
        component: InviteFriends
      }, {
        path: '/coinDetailed',
        name: 'coinDetailed',
        meta: {keepAlive: false, title: '金币明细-' + window.GlodConfig.title},
        component: CoinDetailed
      }, {
        path: '/integralRank',
        name: 'integralRank',
        meta: {keepAlive: false},
        component: IntegralRank
      }, {
        path: '/integralDetailed',
        name: 'integralDetailed',
        meta: {keepAlive: false, title: '积分明细-' + window.GlodConfig.title},
        component: IntegralDetailed
      }, {
        path: '/news',
        name: 'news',
        meta: {keepAlive: false, title: '通知-' + window.GlodConfig.title},
        component: news
      }, {
        path: '/moderLayout',
        name: 'moderLayout',
        component: ModerLayout,
        redirect: 'moderArticle',
        children: [{
          path: '/moderArticle',
          name: 'moderArticle',
          meta: {keepAlive: false, title: '文章列表-' + window.GlodConfig.title},
          component: ModerArticle
        }, {
          path: '/accusation',
          name: 'accusation',
          meta: {keepAlive: false, title: '举报列表-' + window.GlodConfig.title},
          component: Accusation
        }, {
          path: '/moderComment',
          name: 'moderComment',
          meta: {keepAlive: false, title: '禁止评论列表-' + window.GlodConfig.title},
          component: ModerComment
        }]
      }, {
        path: '/editLayout',
        name: 'editLayout',
        component: EditLayout,
        redirect: 'editInfo',
        children: [{
          path: '/editInfo',
          name: 'editInfo',
          meta: {keepAlive: false, title: '个人资料-' + window.GlodConfig.title},
          component: EditInfo
        }, {
          path: '/userSet',
          name: 'userSet',
          meta: {keepAlive: false, title: '账号密码-' + window.GlodConfig.title},
          component: UserSet
        }]
      }, {
        path: '/search',
        name: 'search',
        meta: {keepAlive: false, title: '搜索-' + window.GlodConfig.title},
        component: Search
      }]
    },
    {
      path: '/i',
      name: 'invitationRegistration',
      meta: {keepAlive: false},
      component: invitationRegistration
    },
    {
      path: '*',
      name: 'notFound',
      component: NotFound
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
