<template>
  <div class="main-header-box">
    <header class="main-header visible">
      <div class="container">
        <a href="/" class="logo"><img src="../assets/logo/logo.png" width="70" height="57"  class="logo-img"></a>
        <nav class="main-nav">
          <ul class="nav-list">
            <li class="main-nav-list">
              <ul class="phone-hide">
                <li class="nav-item link-item" v-for="(item,index) in nav_one"  :class="[nav_index==index?'active':'']" @click="goPage(item,index,'nav')" :key="index">{{item.name}}</li>
              </ul>
            </li>
            <li class="nav-item submit"><span @click="editArticle">写文章</span></li>
            <li class="nav-item logined phone_info" v-if="account_info.isLogin">
              <el-dropdown>
                <span class="el-dropdown-link">
                  <img src="../assets/person-face02.jpg" class="userImg" alt="">
                  <span class="user-name float-right" :title='account_info.account'>{{account_info.account}}</span>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <router-link to="/personal/getpassword"><el-dropdown-item>修改登陆密码</el-dropdown-item></router-link>
                  <router-link to="/personal/mySet"><el-dropdown-item>修改个人资料</el-dropdown-item></router-link>
                  <router-link to="/personal/mySet"><el-dropdown-item>我的网盘</el-dropdown-item></router-link>
                  <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </li>
            <li class="nav-item phone_info auth" v-else>
              <span class="login" @click="handleLogin">登录</span>
              <span class="register" @click="handleJoin">注册</span>
            </li>
          </ul>
        </nav>
      </div>
    </header>
    <div class="phone-nav">
    <ly-tab
      @change="goPage"
      :items="nav_one"
      :options="options"
    >
    </ly-tab>
    <div class="phone_el-icon-edit" v-if="account_info.isLogin">
    <el-dropdown>
                <span class="el-dropdown-link">
                  <img src="../assets/person-face02.jpg" class="userImgPhone" alt="">
                  <!--<span class="user-name float-right" :title='account_info.account'>{{account_info.account}}</span>-->
                </span>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/personal/getpassword"><el-dropdown-item>写文章</el-dropdown-item></router-link>
          <router-link to="/personal/getpassword"><el-dropdown-item>修改登陆密码</el-dropdown-item></router-link>
          <router-link to="/personal/mySet"><el-dropdown-item>修改个人资料</el-dropdown-item></router-link>
          <router-link to="/personal/mySet"><el-dropdown-item>我的网盘</el-dropdown-item></router-link>
          <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
    </div>
   <span class="phone_el-icon-edit" v-else @click="handleLogin">
      登录
    </span>
    </div>
    <nav class="category-nav nav">
      <ul>
        <li :class="[index==sub_nav_index?'active':'']" v-for="(item,index) in sub_nav" :key="index" @click="goPage(item,index,'sub_nav')"><span>{{item.name}}</span></li>
      </ul>
    </nav>
    <!--login dialog-->
    <el-dialog title="登录" :visible.sync="loginFormVisible" :close-on-click-modal="false" @close="closeDialog('ruleFormLogin')">
      <el-form :model="ruleFormLogin" :rules="rulesLogin" ref="ruleFormLogin" label-width="0" class="login-ruleForm">
        <el-form-item label="" prop="account">
          <!--<el-input v-model="ruleFormLogin.account" placeholder="请输入邮箱"></el-input>-->
          <el-autocomplete
            v-model="ruleFormLogin.account"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入账号"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input :type='type' v-model="ruleFormLogin.password" autocomplete="off" placeholder="输入密码"><i @click="toggleEye" slot="suffix" class="el-input__icon fa" :class="{'fa-eye-slash': isClose,'fa-eye':isOpen}"></i></el-input>
        </el-form-item>
        <el-form-item label="" prop="" v-show="isShow">
          <el-input type="text" v-model="ruleFormLogin.captcha" autocomplete="off" placeholder="请输入验证码"><a slot="suffix"><img width="100" height="40" :src="picImg" alt="图片验证码" class="picImg" @click="getPiceData()"></a></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitFormLogin('ruleFormLogin')" :disabled="!ruleFormLogin.password||!ruleFormLogin.account">登录</el-button>
        </el-form-item>
        <el-form-item class="forget-pass">
          <span class="pull-left text-999">没有账号？<a href="javascript:;" class="text-primary" @click="handleJoin">注册</a></span>
          <span class="pull-right text-primary" @click="setPassword">忘记密码？</span>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--login dialog-->
    <!--join dialog-->
    <el-dialog title="注册" :visible.sync="joinFormVisible" :close-on-click-modal="false" @close="closeDialog('ruleFormJoin')">
      <el-form :model="ruleFormJoin" :rules="rulesJoin" ref="ruleFormJoin" label-width="0" class="join-ruleForm">
        <el-form-item label="" prop="email">
          <el-autocomplete
            v-model="ruleFormJoin.email"
            :fetch-suggestions="querySearchAsync1"
            placeholder="请输入邮箱"
            @select="handleSelect2"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input :type='type' v-model="ruleFormJoin.password" autocomplete="off" placeholder="输入密码"><i @click="toggleEye" slot="suffix" class="el-input__icon fa" :class="{'fa-eye-slash': isClose,'fa-eye':isOpen}"></i></el-input>
        </el-form-item>
        <el-form-item label="" prop="captcha">
          <el-input type="text" v-model="ruleFormJoin.captcha" autocomplete="off" placeholder="输入验证码">
            <span v-if="flag" @click="sendCode" class="sendMessage"  slot="suffix">发送验证码</span>
            <span v-if="!flag" class="sendtime" slot="suffix">{{seconds}}s后重新发送</span>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="checked" label="我已阅读并同意"></el-checkbox>
          <router-link class="text-999" to="/personal/getpassword">《用户注册协议》</router-link>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitFormJoin('ruleFormJoin')" :disabled="!checked||!ruleFormJoin.password||!ruleFormJoin.email||!ruleFormJoin.captcha">注册</el-button>
        </el-form-item>
        <el-form-item>
          <a href="javascript:;" class="text-primary" @click="handleLogin">已有账号,登录</a>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--join dialog-->
  </div>

</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'header',
  data () {
    const validateEmail = (rule, value, callback) => {
      if (value) {
        if (value.indexOf('@') > -1) {
          this.restaurants = this.loadAll()
          callback()
        } else {
          if (!this.Email(value)) {
            callback(new Error('输入邮箱错误'))
          } else {
            callback()
          }
        }
      } else {
        callback(new Error('请输入邮箱'))
      }
    }
    const validateEmail1 = (rule, value, callback) => {
      if (value) {
        if (value.indexOf('@') > -1) {
          this.restaurants1 = this.loadAll1()
          callback()
        } else {
          if (!this.Email(value)) {
            callback(new Error('输入邮箱错误'))
          } else {
            callback()
          }
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
      showSearch: false,
      restaurants: [],
      restaurants1: [],
      search: '',
      isShow: false,
      picImg: '',
      type: 'password',
      flag: true,
      minutes: 0,
      seconds: 60,
      isClose: true,
      isOpen: false,
      loginFormVisible: false,
      joinFormVisible: false,
      checked: true,
      formparams: {
        category_id: 0
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
      account_info: {},
      ruleFormLogin: {
        account: '',
        password: ''
      },
      ruleFormJoin: {
        email: '',
        password: '',
        captcha: '',
        captcha_id: ''
      },
      rulesLogin: {
        account: [
          { required: true, validator: validateEmail, trigger: 'change' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      rulesJoin: {
        email: [
          { required: true, validator: validateEmail1, trigger: 'change' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  inject: ['reload'],
  computed: {
    ...mapGetters([
    ])
  },
  watch: {
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
    editArticle () {
      this.$router.push({path: '/articleEditor'})
    },
    loadAll () {
      return [
        { 'value': this.ruleFormLogin.account + '163.com' },
        { 'value': this.ruleFormLogin.account + '126.com' },
        { 'value': this.ruleFormLogin.account + 'sina.com' },
        { 'value': this.ruleFormLogin.account + 'yeah.net' },
        { 'value': this.ruleFormLogin.account + 'sohu.com' },
        { 'value': this.ruleFormLogin.account + 'sogou.com' },
        { 'value': this.ruleFormLogin.account + 'qq.com' },
        { 'value': this.ruleFormLogin.account + 'Gmail.com' },
        { 'value': this.ruleFormLogin.account + '139.com' },
        { 'value': this.ruleFormLogin.account + '189.com' },
        { 'value': this.ruleFormLogin.account + 'hotmail.com' }
      ]
    },
    loadAll1 () {
      return [
        { 'value': this.ruleFormJoin.email + '163.com' },
        { 'value': this.ruleFormJoin.email + '126.com' },
        { 'value': this.ruleFormJoin.email + 'sina.com' },
        { 'value': this.ruleFormJoin.email + 'yeah.net' },
        { 'value': this.ruleFormJoin.email + 'sohu.com' },
        { 'value': this.ruleFormJoin.email + 'sogou.com' },
        { 'value': this.ruleFormJoin.email + 'qq.com' },
        { 'value': this.ruleFormJoin.email + 'Gmail.com' },
        { 'value': this.ruleFormJoin.email + '139.com' },
        { 'value': this.ruleFormJoin.email + '189.com' },
        { 'value': this.ruleFormJoin.email + 'hotmail.com' }
      ]
    },
    goPage (item, index, category) {
      if (category === 'sub_nav') {
        this.sub_nav_index = index
        this.formparams.category_id = item.id
        this.getArticleLists(this.formparams)
      } else {
        this.nav_index = index
        this.sub_nav = item.sub_categories
        this.formparams.category_id = item.id
        this.getArticleLists(this.formparams)
      }
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
      this.ruleFormLogin.account = item.value
    },
    handleSelect2 (item) {
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
    sendCode () {
      if (this.ruleFormJoin.email && this.Email(this.ruleFormJoin.email)) {
        this.timer()
        this.http
          .getCaptcha({email: this.ruleFormJoin.email, type: 'register'})
          .then(res => {
            if (res.status === 0) {
              this.ruleFormJoin.captcha_id = res.data.captcha_id
            } else {
              this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
            }
          })
      } else {
        this.$toast('请输入正确的邮箱', 2000, 'error')
      }
    },
    // 倒计时
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
    },
    getPiceData () {
      this.http
        .picBase64({captcha_type: 'login'})
        .then(res => {
          if (res.status === 0) {
            this.picImg = res.data.captcha_base64
            this.ruleFormLogin.captcha_id = res.data.captcha_id
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
            if (hastip) {
              this.$toast('登陆成功', 2000, 'common')
            }
            this.loginFormVisible = false
            this.account_info.account = res.data.account_info.account
            this.account_info.isLogin = true
            this.Cookies.set('info', JSON.stringify(this.account_info), {expires: 1})
            this.reload()
          } else if (res.status === 2997 || res.status === 2996) {
            this.isShow = true
            this.getPiceData()
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    },
    joinData () {
      this.http
        .userRegister(this.ruleFormJoin)
        .then(res => {
          if (res.status === 0) {
            this.$toast('注册成功', 2000, 'common')
            this.ruleFormLogin.account = this.ruleFormJoin.email
            this.ruleFormLogin.password = this.ruleFormJoin.password
            this.loginData(false)
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    },
    logout () {
      this.http
        .userLogout({})
        .then(res => {
          if (res.status === 0) {
            this.$toast('退出成功', 2000, 'common')
            window.sessionStorage.clear()
            this.reload()
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    },
    getCategory () {
      this.http.userCategory().then(res => {
        if (res.status === 0) {
          // 手动写死一个推荐
          let obj = {icon_url: '', id: 0, name: '推荐', note: '', parent_id: '', sort: 0, status: 1, sub_categories: null}
          res.data.category_info.unshift(obj)
          this.nav_one = res.data.category_info
          this.sub_nav = res.data.category_info[0].sub_categories
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    closeDialog (formRule) {
      this.$refs[formRule].clearValidate()
      this.$refs[formRule].resetFields()
    }
  },
  created () {
    this.getCategory()
    // this.getArticleLists(this.formparams)
  },
  mounted () {
    if (this.Cookies.get('info')) {
      if (JSON.parse(this.Cookies.get('info')).isLogin) {
        this.account_info.isLogin = JSON.parse(this.Cookies.get('info')).isLogin
        this.account_info = JSON.parse(this.Cookies.get('info'))
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
    border-bottom: 1px solid #e5e5e5;
    z-index: 250;
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
  .phone-hide {
    display: flex;
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
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .nav-item.active{
    color: #fff;
    font-size: 16px;
  }
  .nav-item.link-item{
    padding: 0 16px;
    height: 60px;
  }
  .nav-item{
    color: #607393;
    font-size: 14px;
  }
  .nav-item:hover{
    color: #fff;
    font-size: 16px;
  }
  .nav-item.search {
    flex: 1 1 auto;
    justify-content: flex-end;
    cursor: auto;
  }
  .nav-item.search span{
    position: absolute;
    right: 16px;
    top: 30px;
    cursor: pointer;
  }
  .nav-item.submit {
    color: #598cf2;
    position: relative;
  }
  .nav-item.submit span{
    display: inline-block;
    width: 80px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    background-color: #dee8fc;
    border-radius: 30px;
    font-size: 14px;
  }
  .nav-item.auth{
    color: #598cf2;
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
    line-height: 40px;
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
  @media (max-width: 768px) {
      .main-header{
        display: none;
      }
       .main-header-box{
         height:auto;
       }
        .phone-nav{
         display: block;
          height: 65px;
          background-color: #252932
         }
  }
  @media (max-width: 980px){
    .container {
      width: 96%;
    }
    .nav-item.link-item{
      padding: 0 10px;
    }
  }
  @media (max-width: 700px){
    .nav-item.search {
      display: none;
    }
  }
</style>
<style>
  .nav-item.search .el-input input{
    padding-right: 30px;
  }
  .ly-tab{
    width:86%;
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
    color:#607393 ;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  }
  .ly-tab-list{
    padding: 12px 8px!important;
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
  .el-autocomplete{width: 100%}
</style>
