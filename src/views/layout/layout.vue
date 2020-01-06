<template>
  <div class="app-wrapper">
    <div class="main-header-box">
      <header class="main-header visible">
        <div class="container">
          <a href="javascript:;"  class="logo" @click="go_home_category"><img :src="logo_src" width="70" height="57"  class="logo-img"></a>
          <nav class="main-nav">
            <ul class="nav-list">
              <li class="main-nav-list" v-if="theme_flag">
                <ul class="phone-hide">
                  <li class="nav-item-10" v-for="(item,index) in nav_one"  :class="[nav_index==index?'active':'']" @click="goPage(item,index,'nav')" :key="index">{{item.name}}</li>
                </ul>
              </li>
              <li v-if="!theme_flag">
                <el-input
                  placeholder="请输入内容"
                  v-model="search_input"
                  class="input-search-select" >
                  <el-select v-model="search_select" slot="prepend" style="width: 75px">
                    <el-option v-for="item in search_options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                  <i class="el-icon-search" slot="suffix"></i>
                </el-input>
              </li>
              <li class="nav-item submit"><span @click="judgement">写文章</span></li>
              <li class="nav-item search"><router-link to="/search"><i class="el-icon-search"></i></router-link></li>
              <li class="nav-item news" v-if="account_info.isLogin">
              <router-link to="/news">
                <el-badge :value="unread"  :max="99" class="item el-badge-message">
                  <span class="message-icon"><i class="el-icon-message-solid"></i></span>
                </el-badge>
              </router-link>
              </li>
              <li class="nav-item logined phone_info" v-if="account_info.isLogin">
                <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <img :src="account_info.head_url?account_info.head_url:model_url" class="userImg" alt="头像">
                  <span class="user-name float-right" :title='account_info.account'>{{account_info.account}}</span>
                </span>
                  <el-dropdown-menu slot="dropdown">
                    <router-link to="/userInfo"><el-dropdown-item><i class="el-icon-s-home"></i>我的主页</el-dropdown-item></router-link>
                    <router-link to="/yunManage"><el-dropdown-item><i class="el-icon-upload"></i>我的网盘</el-dropdown-item></router-link>
                    <router-link to="/moderArticle" v-if="account_info.is_moderator"><el-dropdown-item><i class="el-icon-menu"></i>版主中心</el-dropdown-item></router-link>
                    <router-link to="/userSet"><el-dropdown-item><i class="el-icon-s-tools"></i>设置</el-dropdown-item></router-link>
                    <el-dropdown-item @click.native="logout"><i class="el-icon-s-unfold"></i>退出</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </li>
              <li class="nav-item phone_info auth" v-if="!account_info.isLogin">
                <span class="login" @click="handleLogin">登录</span>
                <span class="register" @click="handleJoin">注册</span>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <div class="phone-nav">
        <ly-tab
          v-model="selected_tab"
          @change="goPhonePage"
          :items="nav_one"
          :options="options"
        >
        </ly-tab>
        <div class="phone-nav-search"><router-link to="/search"><i class="el-icon-search"></i></router-link></div>
        <div class="phone_el-icon-edit" v-if="account_info.isLogin">
          <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <img :src="account_info.head_url?account_info.head_url:model_url" class="userImgPhone" alt="头像">
                  <!--<span class="user-name float-right" :title='account_info.account'>{{account_info.account}}</span>-->
                </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="judgement">写文章</el-dropdown-item>
              <router-link to="/news"><el-dropdown-item>我的消息</el-dropdown-item></router-link>
              <router-link to="/userInfo"><el-dropdown-item>我的主页</el-dropdown-item></router-link>
              <router-link to="/yunManage"><el-dropdown-item>我的网盘</el-dropdown-item></router-link>
              <router-link to="/moderArticle" v-if="account_info.is_moderator"><el-dropdown-item>版主中心</el-dropdown-item></router-link>
              <router-link to="/userSet"><el-dropdown-item>设置</el-dropdown-item></router-link>
              <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <span class="phone_el-icon-edit" v-else @click="handleLogin">
      登录
    </span>
      </div>
      <nav class="category-nav nav">
        <ul v-show="show_sub_nav">
          <li :class="[index==sub_nav_index?'active':'']" v-for="(item,index) in sub_nav" :key="index" @click="goPage(item,index,'sub_nav')"><span>{{item.name}}</span></li>
        </ul>
      </nav>
      <!--login dialog-->
      <el-dialog title="登录" :visible.sync="loginFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" @close="closeDialog('ruleFormLogin')">
        <el-form :model="ruleFormLogin" :rules="rulesLogin" ref="ruleFormLogin" label-width="0" class="login-ruleForm"  @submit.native.prevent>
          <el-form-item label="" prop="account">
            <!--<el-input v-model="ruleFormLogin.account" placeholder="请输入邮箱"></el-input>-->
            <el-autocomplete
              v-model="ruleFormLogin.account"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入账号"
              @select="handleSelect"
              :autofocus="true"
              autocomplete="on"
              @input.native="handleSearch('login')"
            ></el-autocomplete>

          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input :type='type' v-model="ruleFormLogin.password" autocomplete="on"  placeholder="输入密码" @keyup.enter.native="submitFormLogin('ruleFormLogin')"><i @click="toggleEye" slot="suffix" class="el-input__icon fa" :class="{'fa-eye-slash': isClose,'fa-eye':isOpen}"></i></el-input>
          </el-form-item>
          <el-form-item label="" prop="captcha" v-if="isShow">
            <el-input type="text" v-model="ruleFormLogin.captcha" autocomplete="on" placeholder="请输入验证码" @keyup.enter.native="submitFormLogin('ruleFormLogin')"><a slot="suffix"><img width="100" height="40" :src="picImg" alt="图片验证码" class="picImg" @click="getPiceData('login')"></a></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitFormLogin('ruleFormLogin')">登录</el-button>
          </el-form-item>
          <el-form-item class="forget-pass">
            <span class="pull-left text-999">没有账号？<a href="javascript:;" class="text-primary" @click="handleJoin">注册</a></span>
            <span class="pull-right text-primary" @click="setPassword">忘记密码？</span>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!--login dialog-->
      <!--join dialog-->
      <el-dialog title="注册" :visible.sync="joinFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" @close="closeDialog('ruleFormJoin')">
        <el-form :model="ruleFormJoin" :rules="rulesJoin" ref="ruleFormJoin" label-width="0" class="join-ruleForm"  @submit.native.prevent>
          <el-form-item label="" prop="email">
            <el-autocomplete
              v-model="ruleFormJoin.email"
              :fetch-suggestions="querySearchAsync1"
              placeholder="请输入邮箱"
              @select="handleSelect2"
              @input.native="handleSearch('join')"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input :type='type' v-model="ruleFormJoin.password" @keyup.enter.native="submitFormJoin('ruleFormJoin')" autocomplete="off" placeholder="输入密码"><i @click="toggleEye" slot="suffix" class="el-input__icon fa" :class="{'fa-eye-slash': isClose,'fa-eye':isOpen}"></i></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input type="text" v-model="ruleFormJoin.referral_code" autocomplete="off"  placeholder="如有邀请码,请输入邀请码,选填项" @keyup.enter.native="submitFormJoin('ruleFormJoin')">
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="captcha">
            <el-input type="text" v-model="ruleFormJoin.captcha" autocomplete="off" placeholder="请输入验证码" @keyup.enter.native="submitFormJoin('ruleFormLogin')"><a slot="suffix"><img width="100" height="40" :src="picJoinImg" alt="图片验证码" class="picImg" @click="getPiceData('register')"></a></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="checked" label="我已阅读并同意"></el-checkbox>
            <a :href="user_agreement" target="_blank" class="text-999">《用户协议》</a>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitFormJoin('ruleFormJoin')" :disabled="!checked||!ruleFormJoin.password||!ruleFormJoin.email||!ruleFormJoin.captcha">注册</el-button>
          </el-form-item>
          <el-form-item>
            <a href="javascript:void(0);" class="text-primary" @click="handleLogin">已有账号,登录</a>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!--join dialog-->
      <!--添加邮箱验证的-->
      <el-dialog
        :title="``"
        :visible.sync="verifyVisible"
        :close-on-click-modal="false"
        @close="closeDialog('ruleEmailForm')"
      >
        <p class="fs-24 text-333 send-score-title">注册成功！<br>
          验证邮箱可获得{{activate_email_score}}积分哦！</p>
        <div class="secord">
          <el-form :model="ruleEmailForm" :rules="rulesEmail" ref="ruleEmailForm"  label-width="0" class="demo-ruleForm" @submit.native.prevent>
            <div  class="mb-15">
              <p class="text-333 fs-16"><span>{{ruleEmailForm.email}}</span></p>
            </div>
            <div  class="mb-15">
              <el-form-item prop="captcha">
                <el-input  placeholder="请输入邮箱验证码" v-model="ruleEmailForm.captcha"  @keyup.enter.native="submitEmailForm('ruleEmailForm')" :maxlength="6">
                  <span v-if="flag" @click="sendCode" class="sendMessage"  slot="suffix">发送验证码</span>
                  <span v-if="!flag" class="sendtime" slot="suffix">{{seconds}}s后重新发送</span>
                </el-input>
              </el-form-item>
            </div>
            <el-button type="primary" class="identi-button" @click="submitEmailForm('ruleEmailForm')" :disabled="!ruleEmailForm.captcha">验证</el-button>
            <el-button type="text" @click="skip">跳过，以后再说</el-button>
          </el-form>
        </div>
      </el-dialog>
      <diglog-components :scene="text_tips" :modal-show.sync="modalShow"></diglog-components>
    </div>
    <!--main-->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!--main-->
    <a class="open-app" @click="openApp('tysqapp://')" href="javascript:;"><el-button type="primary" round>APP内打开</el-button></a>
    <right-panel>
      <settings/>
    </right-panel>
  </div>
</template>

<script>
import store from '../../store/index'
import RightPanel from '../../components/RightPanel'
import Settings from '../../components/Settings'
import diglogComponents from '../../components/diglogComponents'
export default {
  name: 'Header',
  components: {
    'diglog-components': diglogComponents,
    'right-panel': RightPanel,
    Settings
  },
  data () {
    const validateEmail = (rule, value, callback) => {
      if (value) {
        if (!this.Email(value)) {
          callback(new Error('输入邮箱错误'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入邮箱'))
      }
    }
    const validateEmail1 = (rule, value, callback) => {
      if (value) {
        if (!this.Email(value)) {
          callback(new Error('输入邮箱错误'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入邮箱'))
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (value.length < 6) {
          callback(new Error('密码不能低于6位'))
        } else {
          callback()
        }
      }
    }
    return {
      model_url: require('../../../static/images/toux.png'),
      theme_flag: true,
      search_input: '',
      search_select: 'title',
      search_options: [
        {label: '文章', value: 'title'},
        {label: '标签', value: 'label'},
        {label: '用户', value: 'user'}
      ],
      un_readTimer: '',
      selected_tab: 0,
      unread: null,
      text_tips: '',
      modalShow: false,
      logo_src: window.GlodConfig.logo_src,
      goHome: false,
      validateFlag: false,
      show_sub_nav: true,
      showSearch: false,
      restaurants: [],
      restaurants1: [],
      timeout: null,
      search: '',
      isShow: false,
      picImg: '',
      picJoinImg: '',
      type: 'password',
      flag: true,
      minutes: 0,
      seconds: 60,
      isClose: true,
      isOpen: false,
      verifyVisible: false,
      loginFormVisible: false,
      joinFormVisible: false,
      checked: true,
      activate_email_score: 0,
      formparams: {
        parent_id: -1
      },
      nav_index: 0,
      sub_nav_index: 0,
      nav_one: [],
      sub_nav: [],
      options: {
        activeColor: '#fff',
        labelKey: 'name',
        additionalX: 100
        // 可在这里指定labelKey为你数据里文字对应的字段
      },
      account_info: {
        account: '',
        head_url: '',
        account_id: '',
        email: '',
        isLogin: false
      },
      ruleFormLogin: {
        account: '',
        password: ''
      },
      ruleFormJoin: {
        email: '',
        password: '',
        referral_code: '',
        captcha: '',
        captcha_id: ''
      },
      ruleEmailForm: {
        email: '',
        captcha: '',
        captcha_id: ''
      },
      rulesLogin: {
        account: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      rulesEmail: {
        captcha: [
          { required: true, message: '请输入邮箱验证码', trigger: 'blur' }
        ]
      },
      rulesJoin: {
        email: [
          { required: true, validator: validateEmail1, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      user_agreement: ''
    }
  },
  inject: ['reload'],
  computed: {
    getLogin () {
      return this.$store.state.showLogin
    },
    getTheme () {
      return this.$store.state.theme
    },
    newsData () {
      return this.$store.state.newsCount
    },
    getLoginInfo () {
      return this.$store.state.login_info
    },
    get_user_name () {
      return this.$store.state.user_name
    },
    get_user_headUrl () {
      return this.$store.state.user_headUrl
    }
  },
  watch: {
    $route (to, from) {
      if (this.$route.path !== '/home') {
        if (this.$route.path === 'article/info') {

        } else {
          this.nav_index = null
        }
      }
      if (to.path === '/home') {
        this.show_sub_nav = true
      } else {
        this.show_sub_nav = false
      }
      if (to.path === '/personal/getpassword') {
        this.goHome = true
      } else {
        this.goHome = false
      }
    },
    ruleFormLogin (val) {
      console.log(val)
    },
    getTheme (val) {
      if (val) {
        if (val === 'sidebar_wrapper') {
          this.theme_flag = false
        } else {
          this.theme_flag = true
        }
      } else {
        this.theme_flag = true
      }
    },
    get_user_name (val) {
      if (val) {
        this.account_info.account = val
      } else {
        this.account_info.account = this.Cookies.get('info') ? JSON.parse(this.Cookies.get('info')).account : ''
      }
    },
    get_user_headUrl (val) {
      if (val) {
        this.account_info.head_url = val
      } else {
        this.account_info.head_url = this.Cookies.get('info') ? JSON.parse(this.Cookies.get('info')).head_url : ''
      }
    },
    newsData (val) {
      if (val) {
        this.unread = val
      } else {
        this.unread = null
      }
    },
    getLoginInfo (val) {
      this.account_info.isLogin = val
    },
    getLogin (val) {
      if (val) {
        this.handleLogin()
      }
    },
    second: {
      handler (newVal) {
        this.num(newVal)
      }
    },
    minute: {
      handler (newVal) {
        this.num(newVal)
      }
    }
  },
  methods: {
    handleSearch (flag) {
      if (flag === 'login') {
        if (this.ruleFormLogin.account.indexOf('@') > -1) {
          this.restaurants = this.loadAll()
        }
      } else {
        if (this.ruleFormJoin.email.indexOf('@') > -1) {
          this.restaurants1 = this.loadAll1()
        }
      }
    },
    go_home_category () {
      this.$router.push({path: '/home'})
      this.nav_index = 0
      this.sub_nav_index = 0
      this.sub_nav = []
      window.sessionStorage.clear()
    },
    judgement () {
      if (this.Cookies.get('info')) {
        if (JSON.parse(this.Cookies.get('info')).isLogin) {
          if (this.$route.path === '/article/info') {
            this.$router.push({path: '/articleEditor', query: {from_router: 'article_info'}})
          } else {
            this.$router.push({path: '/articleEditor'})
          }
        }
      } else {
        this.handleLogin()
      }
    },
    loadAll () {
      return [
        {'value': this.ruleFormLogin.account.replace('@', '') + '@qq.com'},
        {'value': this.ruleFormLogin.account.replace('@', '') + '@126.com'},
        {'value': this.ruleFormLogin.account.replace('@', '') + '@sina.com'},
        {'value': this.ruleFormLogin.account.replace('@', '') + '@yeah.com'},
        {'value': this.ruleFormLogin.account.replace('@', '') + '@sohu.com'},
        {'value': this.ruleFormLogin.account.replace('@', '') + '@163.com'},
        {'value': this.ruleFormLogin.account.replace('@', '') + '@Gmail.com'},
        {'value': this.ruleFormLogin.account.replace('@', '') + '@139.com'},
        {'value': this.ruleFormLogin.account.replace('@', '') + '@189.com'},
        {'value': this.ruleFormLogin.account.replace('@', '') + '@hotmail.com'}
      ]
    },
    loadAll1 () {
      return [
        {'value': this.ruleFormJoin.email.replace('@', '') + '@qq.com'},
        {'value': this.ruleFormJoin.email.replace('@', '') + '@126.com'},
        {'value': this.ruleFormJoin.email.replace('@', '') + '@sina.com'},
        {'value': this.ruleFormJoin.email.replace('@', '') + '@yeah.com'},
        {'value': this.ruleFormJoin.email.replace('@', '') + '@sohu.com'},
        {'value': this.ruleFormJoin.email.replace('@', '') + '@163.com'},
        {'value': this.ruleFormJoin.email.replace('@', '') + '@Gmail.com'},
        {'value': this.ruleFormJoin.email.replace('@', '') + '@139.com'},
        {'value': this.ruleFormJoin.email.replace('@', '') + '@189.com'},
        {'value': this.ruleFormJoin.email.replace('@', '') + '@hotmail.com'}
      ]
    },
    goPage (item, index, category) {
      this.sub_nav_index = 0
      this.formparams.category_id = 0
      window.sessionStorage.setItem('sub_nav_index', 0)
      if (category === 'sub_nav') {
        this.sub_nav_index = index
        this.formparams.category_id = item.id
        if (index !== 0) {
          this.formparams.sub_name = item.name
        } else {
          if (this.formparams.sub_name) {
            delete this.formparams.sub_name
          }
        }
        window.sessionStorage.setItem('sub_nav_index', index)
        window.sessionStorage.setItem('category_id', item.id)
      } else {
        this.nav_index = index
        this.sub_nav = item.subcategories
        this.formparams.parent_id = item.id
        if (index !== 0) {
          this.formparams.name = item.name
        } else {
          if (this.formparams.name) {
            delete this.formparams.name
          }
        }
        if (this.formparams.sub_name) {
          delete this.formparams.sub_name
        }
        window.sessionStorage.setItem('parent_id', item.id)
        window.sessionStorage.setItem('nav_index', index)
        if (index !== 0) {
          window.sessionStorage.setItem('nav_name', item.name)
        }
      }
      this.$router.push({path: '/home', query: this.formparams})
    },
    goPhonePage (item) {
      this.sub_nav_index = 0
      this.formparams.category_id = 0
      window.sessionStorage.setItem('sub_nav_index', 0)
      this.sub_nav = item.subcategories
      this.formparams.parent_id = item.id
      window.sessionStorage.setItem('sub_nav', JSON.stringify(this.sub_nav))
      window.sessionStorage.setItem('parent_id', item.id)
      window.sessionStorage.setItem('selected_tab', this.selected_tab)
      if (this.selected_tab !== 0) {
        this.formparams.name = item.name
        window.sessionStorage.setItem('nav_name', item.name)
      } else {
        if (this.formparams.name) {
          delete this.formparams.name
        }
      }
      if (this.formparams.sub_name) {
        delete this.formparams.sub_name
      }
      this.$router.push({path: '/home', query: this.formparams})
    },
    querySearchAsync (queryString, cb) {
      let restaurants = this.restaurants
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    querySearchAsync1 (queryString, cb) {
      let restaurants = this.restaurants1
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) {
      this.$refs.ruleFormLogin.clearValidate('account')
      this.ruleFormLogin.account = item.value
    },
    handleSelect2 (item) {
      this.$refs.ruleFormJoin.clearValidate('email')
      this.ruleFormLogin.email = item.value
    },
    submitFormLogin (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loginData(true)
        } else {
          return false
        }
      })
    },
    submitFormJoin (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.checked === true) {
            this.joinData()
          } else {
            this.$toast('点击同意协议', 2000, 'error')
            return false
          }
        } else {
          return false
        }
      })
    },
    submitEmailForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.http.bindEmail(this.ruleEmailForm).then(res => {
            if (res.status === 0) {
              this.$toast('验证成功', 2000, 'common')
              this.verifyVisible = false
            } else {
              this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
            }
          })
        } else {
          return false
        }
      })
    },
    sendCode () {
      this.timer()
      this.http
        .getCaptcha({email: this.ruleEmailForm.email, type: 'bindEmail'})
        .then(res => {
          if (res.status === 0) {
            this.ruleEmailForm.captcha_id = res.data.captcha_id
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    },
    num (n) {
      return n < 10 ? '0' + n : '' + n
    },
    timer () {
      var _this = this
      _this.flag = false
      var time = window.setInterval(function () {
        if (_this.seconds === 0 && _this.minutes !== 0) {
          _this.seconds = 59
          _this.minutes -= 1
        } else if (_this.minutes === 0 && _this.seconds === 0) {
          _this.seconds = 60
          _this.flag = true
          window.clearInterval(time)
        } else {
          _this.seconds -= 1
        }
      }, 1000)
    },
    toggleEye () {
      this.isOpen = !this.isOpen
      this.isClose = !this.isClose
      if (this.isOpen === true) {
        this.type = 'text'
      } else {
        this.type = 'password'
      }
    },
    setPassword () {
      if (!this.Email(this.ruleFormLogin.account)) {
        this.$router.push({path: '/personal/getpassword'})
      } else {
        this.$router.push({path: '/personal/getpassword', query: {account: this.ruleFormLogin.account}})
      }
      this.joinFormVisible = false
      this.loginFormVisible = false
    },
    handleLogin () {
      this.loginFormVisible = true
      this.joinFormVisible = false
    },
    handleJoin () {
      this.joinFormVisible = true
      this.loginFormVisible = false
      this.getPiceData('register')
    },
    getPiceData (captchaType) {
      this.http
        .picBase64({captcha_type: captchaType})
        .then(res => {
          if (res.status === 0) {
            if (captchaType === 'login') {
              this.picImg = res.data.captcha_base64
              this.ruleFormLogin.captcha_id = res.data.captcha_id
            } else {
              this.picJoinImg = res.data.captcha_base64
              this.ruleFormJoin.captcha_id = res.data.captcha_id
            }
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    },
    loginData (hastip) {
      this.http
        .userLogin(this.ruleFormLogin)
        .then(res => {
          if (res.status === 0) {
            this.unreadCount()
            // this.socketApi.createWebSocket()
            // this.getSocketToken()
            let _this = this
            _this.un_readTimer = setInterval(function () {
              if (_this.Cookies.get('info')) {
                _this.unreadCount()
              } else {
                clearInterval(_this.un_readTimer)
              }
            }, 60000)
            this.loginFormVisible = false
            this.account_info.account = res.data.account_info.account
            this.account_info.head_url = res.data.account_info.head_url ? res.data.account_info.head_url : ''
            this.account_info.account_id = res.data.account_info.account_id
            this.account_info.email = res.data.account_info.email
            this.account_info.is_moderator = res.data.account_info.is_moderator
            this.account_info.isLogin = true
            this.Cookies.set('info', JSON.stringify(this.account_info), {expires: 1})
            store.commit('flagLogin', false)
            store.commit('flagLoginInfo', true)
            store.commit('flagLoginStatus', false)
            if (hastip) {
              this.$toast('登录成功', 2000, 'common')
              if (this.$route.path === '/article/info' || this.$route.path === '/otherUserInfo' || this.$route.path === '/userInfo' || this.$route.path === '/integralDetailed' || this.$route.path === '/coinDetailed' || this.$route.path === '/yunManage' || this.$route.path === '/userSet') {
                this.reload()
              }
            }
          } else if (res.status === 2997 || res.status === 2996) {
            this.isShow = true
            this.getPiceData('login')
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          } else {
            this.getPiceData('login')
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    },
    getSocketToken () {
      this.http.scoketToken().then(res => {
        if (res.status === 0) {
          this.Cookies.set('token', res.data.token)
          this.socketApi.sendSock({code: 3, data: {token: res.data.token}})
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    joinData () {
      if (this.ruleFormJoin.referral_code) {
        this.ruleFormJoin.type = 1
      } else {
        if (this.ruleFormJoin.referral_code === '') {
          delete this.ruleFormJoin.referral_code
        }
      }
      this.http
        .userRegister(this.ruleFormJoin)
        .then(res => {
          if (res.status === 0) {
            this.ruleFormLogin.account = this.ruleFormJoin.email
            this.ruleFormLogin.password = this.ruleFormJoin.password
            this.ruleEmailForm.email = this.ruleFormJoin.email
            this.activate_email_score = res.data.activate_email_score
            this.joinFormVisible = false
            this.loginData(false)
            this.verifyVisible = true
          } else {
            this.ruleFormJoin.captcha = ''
            this.getPiceData('register')
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    },
    skip () {
      this.verifyVisible = false
    },
    logout () {
      this.http
        .userLogout()
        .then(res => {
          if (res.status === 0) {
            this.$toast('退出成功', 2000, 'common')
            store.commit('flagLoginInfo', false)
            store.commit('newsCountData', 0)
            store.commit('flagLoginStatus', true)
            this.Cookies.set('info', '', -1)
            this.Cookies.set('token', '', -1)
            if (this.un_readTimer) {
              clearInterval(this.un_readTimer)
            }
            if (this.$route.path !== '/home') {
              this.$router.push('/home')
              window.sessionStorage.setItem('nav_index', 0)
              window.sessionStorage.setItem('sub_nav_index', 0)
              this.reload()
            }
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    },
    getCategory () {
      this.http.userCategory().then(res => {
        if (res.status === 0) {
          if (res.data.category_info) {
            // 手动写死一个推荐
            let obj = {icon_url: '', id: -1, name: '推荐', note: '', parent_id: 0, sort: 0, status: 1, sub_categories: null}
            res.data.category_info.unshift(obj)
            this.nav_one = res.data.category_info
            let obj2 = {icon_url: '', id: 0, name: '全部', note: '', parent_id: -1, sort: 0, status: 1, sub_categories: null}

            res.data.category_info.forEach(item => {
              if (item.subcategories) {
                item.subcategories.unshift(obj2)
              }
            })
          }
          if (this.$route.path === '/home') {
            this.nav_postion(res.data)
          } else if (this.$route.path === '/article/info') {
            if (this.$route.query.from) {
              if (this.$route.query.from === 'list') {
                this.nav_postion(res.data)
              } else {
                this.nav_index = null
                this.sub_nav_index = null
              }
            } else {
              this.nav_index = null
              this.sub_nav_index = null
            }
          } else {
            this.nav_index = null
            this.sub_nav_index = null
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    nav_postion (navData) {
      if (document.body.clientWidth > 992) {
        this.nav_index = window.sessionStorage.getItem('nav_index') ? window.sessionStorage.getItem('nav_index') : 0
        this.sub_nav_index = window.sessionStorage.getItem('sub_nav_index') ? window.sessionStorage.getItem('sub_nav_index') : 0
        this.sub_nav = navData.category_info ? navData.category_info[this.nav_index].subcategories : []
      }
    },
    closeDialog (formRule) {
      store.commit('flagLogin', false)
      store.commit('flagArticleEditor', false)
      this.$refs[formRule].clearValidate()
      this.$refs[formRule].resetFields()
      if (formRule === 'ruleEmailForm') {
        this.verifyVisible = false
      } else if (formRule === 'ruleFormLogin') {
        if (!this.goHome) {
          if (this.$route.path === '/article/info') {
            if (!this.joinFormVisible) {
              this.closePage()
            }
          }
        }
      } else if (formRule === 'ruleFormJoin') {
        if (!this.goHome) {
          if (this.$route.path === '/article/info') {
            if (!this.loginFormVisible) {
              this.closePage()
            }
          }
        }
      }
    },
    closePage () {
      var userAgent = navigator.userAgent
      if (userAgent.indexOf('Firefox') !== -1 || userAgent.indexOf('Chrome') !== -1) {
        this.$router.push({path: '/home'})
        window.close()
      } else {
        window.opener = null
        window.open('', '_self')
        window.close()
      }
    },
    BrowserInfo () {
      var json = {
        userAgent: navigator.userAgent.toLowerCase(),
        isAndroid: Boolean(navigator.userAgent.match(/android/ig)),
        isIphone: Boolean(navigator.userAgent.match(/iphone|ipod/ig)),
        isIpad: Boolean(navigator.userAgent.match(/ipad/ig)),
        isWeixin: Boolean(navigator.userAgent.match(/MicroMessenger/ig))
      }
      return json
    },
    unreadCount () {
      this.http.getUnreadCount().then(res => {
        if (res.status === 0) {
          if (res.data.unread_count) {
            store.commit('newsCountData', res.data.unread_count)
          } else {
            this.unread = null
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    openApp (openUrl) {
      var browser = this.BrowserInfo()
      if (browser.isAndroid) {
        var ifr = document.createElement('iframe')
        ifr.src = openUrl
        ifr.style.display = 'none'
      } else if (browser.isIphone) {
        window.location.href = openUrl
      }
      const initialTime = new Date()
      let counter = 0
      let waitTime = 0
      const checkOpen = setInterval(() => {
        counter++
        waitTime = new Date() - initialTime
        if (waitTime > 2500) {
          clearInterval(checkOpen)
        }
        if (counter < 100) return
        const hide = document.hidden || document.webkitHidden
        if (!hide) {
          // alert('请下载APP')
          window.location.href = window.GlodConfig.download_src
        }
      }, 20)
      if (browser.isAndroid) {
        document.body.appendChild(ifr)
        setTimeout(function () {
          document.body.removeChild(ifr)
        }, 2000)
      }
    }
  },
  created () {
    // this.$toast('你好的撒娇打撒十大的撒大苏打的撒旦撒旦', 500000, 'error')
    this.getCategory()
    if (document.body.clientWidth < 992) {
      this.sub_nav_index = window.sessionStorage.getItem('sub_nav_index') ? window.sessionStorage.getItem('sub_nav_index') : 0
      this.selected_tab = window.sessionStorage.getItem('selected_tab') ? Number(window.sessionStorage.getItem('selected_tab')) : 0
      this.sub_nav = window.sessionStorage.getItem('sub_nav') ? JSON.parse(window.sessionStorage.getItem('sub_nav')) : []
    }
    if (this.Cookies.get('info')) {
      this.unreadCount()
      let _this = this
      _this.un_readTimer = setInterval(function () {
        if (_this.Cookies.get('info')) {
          _this.unreadCount()
        } else {
          clearInterval(_this.un_readTimer)
        }
      }, 60000)
    }
  },
  mounted () {
    this.user_agreement = this.http.userAgreementLink
    if (this.Cookies.get('info')) {
      store.commit('flagLoginInfo', true)
      // 屏蔽socket
      // this.unreadCount()
      this.account_info = JSON.parse(this.Cookies.get('info'))
      if (JSON.parse(this.Cookies.get('info')).is_moderator) {
        this.account_info.is_moderator = JSON.parse(this.Cookies.get('info')).is_moderator
      }
      // 屏蔽socket
      // if (!this.socketApi.websock) {
      //   this.socketApi.createWebSocket()
      //   this.socketApi.sendSock({code: 2, data: {token: this.Cookies.get('token')}})
      // }
    }
    this.ruleFormJoin.referral_code = this.Cookies.get('referral_code') ? this.Cookies.get('referral_code') : ''
    if (window.sessionStorage.getItem('category_id') !== undefined) {
      this.formparams.category_id = window.sessionStorage.getItem('category_id')
    }
    if (window.sessionStorage.getItem('parent_id') !== undefined) {
      this.formparams.parent_id = window.sessionStorage.getItem('parent_id')
    }
    if (window.sessionStorage.getItem('nav_name') !== undefined) {
      this.formparams.name = window.sessionStorage.getItem('nav_name')
    }
    if (this.$route.path === '/home') {
      this.show_sub_nav = true
    } else {
      this.show_sub_nav = false
    }
  }
}
</script>
<style scoped>
  .message-icon{
    font-size:20px;
  }
  .container{
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    height: 100%;
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 1200px;
  }
  .main-header-box{
    position: relative;
    background-color: #ffffff;
    max-width: 1200px;
    margin: 0 auto;
  }
  .main-header{
    height: 80px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    transition: all .2s;
    transform: translate3d(0,-100%,0);
    background-color: #252932;
    background-size: 100% 100%;
    border-bottom: 1px solid #e5e5e5;
    z-index:1000;
  }
  .main-header.visible {
    transform: translateZ(0);
  }
  .main-header .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  .logo {
    min-width: 70px;
    margin-right: 20px;
  }
  .main-nav {
    height: 100%;
    flex: 1 0 auto;
  }
  .nav-list {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    height: 100%;
    margin: 0;
  }
  .main-nav-list {
    display: flex;
    flex: 1 1 auto;
  }
  .phone-hide{
    max-width: 790px;
  }
  .nav-item-10{
    display: inline-block;
    padding: 5px 12px;
    color: #9fadc2;
    font-size: 18px;
    cursor: pointer;
  }
  .nav-item-10:hover{
    color: #fff;
    font-weight: bold;
  }
  .nav-item-10.active{
    color: #fff;
    font-weight: bold;
  }
  .nav-item {
    position: relative;
    cursor: pointer;
  }
  .nav-item {
    color: #71777c;
    padding: 0 12px;
    font-size: 20px;
    margin: 0;
    height: 100%;
    display: inline-block;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .nav-item.active{
    color: #fff;
  }
  .nav-item.link-item{
    padding: 0 16px;
    height: 60px;
    line-height: 60px;
  }
  .nav-item{
    color: #9fadc2;
    font-size: 14px;
  }
  .nav-item:hover{
    color: #fff;
  }
  .nav-item.search {
    height: 60px;
    line-height: 60px;
    font-size: 20px;
  }
  .nav-item.search a:hover{
    color: #ffffff;
  }

  .nav-item.news {
    height: 60px;
    line-height: 54px;
    font-size: 20px;
  }
  .nav-item.news a:hover{
    color: #ffffff;
  }
  .nav-item.menu{
    height: 60px;
    line-height: 60px;
  }
  .nav-item.submit {
    height: 60px;
    line-height: 60px;
  }
  .nav-item.logined{
    height: 60px;
    line-height: 60px;
  }
  .nav-item.submit span{
    display: inline-block;
    width: 80px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    background-color: #2f3f59;
    color: #ffffff;
    border-radius: 30px;
    font-size: 14px;
  }
  .nav-item.submit span:hover{
    background-color: #dee8fc;
    color: #598cf2;
  }
  .nav-item.auth{
    color: #598cf2;
    height: 60px;
    line-height: 60px;
  }
  .nav-item.auth span{
    display: inline-block;
    margin: 0 10px;
    font-size: 16px;
  }
  .userImg{
    width: 40px;
    height: 40px;
    border-radius: 20px;
    vertical-align: middle;
    margin: 0px 12px
  }
  .userImgPhone{
    width:30px;
    height:30px;
    border-radius: 15px;
    vertical-align: middle;
  }
  .user-name{
    display: inline-block;
    max-width: 80px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    line-height: 60px;
    color: #9fadc2;
  }
  .login-ruleForm .fa,.join-ruleForm .fa{
    cursor: pointer;
    margin-right: 0;
  }
  .forget-pass{
    text-align: right;
    line-height: 20px;
    margin-bottom: 15px;
  }
  .forget-pass span{
    cursor: pointer;
  }
  .join-ruleForm .el-button{
    width: 100%;
  }
  .phone-nav{
    display: none;
  }
  .category-nav {
    margin-top: 90px;
    background-color: #f7f7f7;
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  .category-nav ul li{
    float: left;
    margin: 5px 10px;
  }
  .category-nav ul li span{
    display: block;
    min-width: 82px;
    text-align: center;
    padding: 6px 12px;
    background: #ffffff;
    border-radius: 4px;
    cursor: pointer;
    color: #666666;
  }
  .identi-button{
    width: 100%;
  }
  .category-nav ul li.active span{
    background: #d7e2f6;
    color: #598cf2;
  }
  @media (max-width:992px) {
    .main-header{
      display: none;
    }
    .main-header-box{
      height:auto;
    }
    .category-nav{
      margin-top: 5px;
    }
    .category-nav ul li{
      margin: 5px
    }
    .category-nav ul li span{
      border-radius:30px!important;
      padding: 4px 0px!important;
    }
    .main-container > .view {
      margin-top: 5px;
    }
    .category-nav{
      margin-bottom: 5px;
    }
    .phone-nav{
      display: block;
      height: 65px;
      background-color: #252932
    }
  }
  @media (max-width: 980px)and (min-width:770px){
    .container {
      width: 96%;
    }
    .nav-item.link-item{
      padding: 0 10px;
    }
  }
  .login-ruleForm .fa,.join-ruleForm .fa{
    cursor: pointer;
    margin-right: 0;
  }
  .forget-pass{
    text-align: right;
    line-height: 20px;
    margin-bottom: 15px;
  }
  .forget-pass span{
    cursor: pointer;
  }
  .join-ruleForm .el-button{
    width: 100%;
  }
  .open-app{
    display: none;
    position: fixed;
    left: 50%;
    margin-left: -58px;
    bottom: 10vh;
    z-index: 999;
  }
  @media only screen and (max-width: 768px) {
    .open-app{
      display: block;
    }
  }
</style>
<style>
  .nav-item.search .el-input input{
    padding-right: 30px;
  }
  .el-badge-message .el-badge__content.is-fixed{
    padding:1px 3px;
    top:23px;
    right:13px;
  }
  .el-badge-message .el-badge__content{
    background-color: #FE0002;
    padding: 0px;
    line-height: 15px;
  }
  .ly-tab{
    width:76%;
    height: 100%;
    display: inline-block;
  }
  .ly-tabbar{
    height: 100%;
    background-color:rgba(0,0,0,0)!important;
    border-bottom:none!important;
    box-shadow:none!important;
  }
  .ly-tab-item{
    color:#9fadc2 ;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  }
  .ly-tab-list{
    padding: 12px 8px!important;
  }
  .phone-nav .phone-nav-search{
    width: 8%;
    text-align: center;
    font-size: 18px;
    display: inline-block;
    color: #fff;
  }
  .phone-nav .phone-nav-search i{
    margin-right: 0;
  }
  .phone-nav .phone_el-icon-edit{
    width:12%;
    display: inline-block;
    text-align: center;
    color: #fff;
  }
  .phone-nav .phone_write{
    display: inline-block;
    font-size: 20px;
    color:#dee8fc;
  }
  .main-header-box .el-autocomplete{width: 100%}.main-header-box .el-autocomplete{width: 100%}
  .main-header-box .el-dialog .el-input .el-input__inner{
    border-top: none;
    border-right: none;
    border-left: none;
    border-radius: 0;
  }
  .main-header-box .el-dialog{
    max-width: 500px;
  }
  .login-ruleForm .el-button{
    width: 100%;
  }
  .login-ruleForm .el-input__suffix,.join-ruleForm .el-input__suffix{
    right: 0px;
  }
  .input-search-select.el-input--suffix .el-input__suffix{
    line-height: 40px;
  }
</style>
