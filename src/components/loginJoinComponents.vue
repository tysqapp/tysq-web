<template>
    <div class="buy_coin">
      <!--login dialog-->
      <el-dialog title="登录" :visible.sync="loginFormVisible" :close-on-click-modal="false" @close="closeDialog('ruleFormLogin')">
        <el-form :model="ruleFormLogin" :rules="rulesLogin" ref="ruleFormLogin" label-width="0" class="login-ruleForm"  @submit.native.prevent>
          <el-form-item label="" prop="account">
            <!--<el-input v-model="ruleFormLogin.account" placeholder="请输入邮箱"></el-input>-->
            <el-autocomplete
              v-model="ruleFormLogin.account"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入账号"
              @select="handleSelect"
              @input.native="handleSearch('login')"
            ></el-autocomplete>

          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input :type='type' v-model="ruleFormLogin.password" autocomplete="off" placeholder="输入密码" @keyup.enter.native="submitFormLogin('ruleFormLogin')"><i @click="toggleEye" slot="suffix" class="el-input__icon fa" :class="{'fa-eye-slash': isClose,'fa-eye':isOpen}"></i></el-input>
          </el-form-item>
          <el-form-item label="" prop="captcha" v-if="isShow">
            <el-input type="text" v-model="ruleFormLogin.captcha" autocomplete="off" placeholder="请输入验证码" @keyup.enter.native="submitFormLogin('ruleFormLogin')"><a slot="suffix"><img width="100" height="40" :src="picImg" alt="图片验证码" class="picImg" @click="getPiceData()"></a></el-input>
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
          <el-form-item label="" prop="referral_code">
            <el-input type="text" v-model="ruleFormJoin.referral_code" autocomplete="off"  placeholder="如有邀请码,请输入邀请码,选填项" @keyup.enter.native="submitFormJoin('ruleFormJoin')">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="checked" label="我已阅读并同意"></el-checkbox>
            <a href="javascript:void(0);" class="text-999">《用户注册协议》</a>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitFormJoin('ruleFormJoin')" :disabled="!checked||!ruleFormJoin.password||!ruleFormJoin.email">注册</el-button>
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
    </div>
</template>

<script>
import store from '../store/index'
import diglogComponents from './diglogComponents'
export default {
  name: 'loginJoinComponents',
  components: {
    'diglog-components': diglogComponents
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
    const validateNumber = (rule, value, callback) => {
      if (value) {
        if (isNaN(Number(value))) {
          callback(new Error('请输入数字'))
        } else {
          if (value.length < 6) {
            callback(new Error('邀请码不能少于6位'))
          } else {
            callback()
          }
        }
      } else {
        callback()
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
      },
      ruleFormLogin: {
        account: '',
        password: ''
      },
      ruleFormJoin: {
        email: '',
        password: ''
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
        referral_code: [
          { required: false, validator: validateNumber, trigger: 'blur' }
        ]
      }
    }
  },
  inject: ['reload'],
  computed: {
    getbuyCoin () {
      return this.$store.state.buyCoin
    }
  },
  watch: {
    getbuyCoin (val) {
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
    loadAll () {
      return [
        {'value': this.ruleFormLogin.account.replace('@', '') + '@163.com'},
        {'value': this.ruleFormLogin.account.replace('@', '') + '@126.com'},
        {'value': this.ruleFormLogin.account.replace('@', '') + '@sina.com'},
        {'value': this.ruleFormLogin.account.replace('@', '') + '@yeah.com'},
        {'value': this.ruleFormLogin.account.replace('@', '') + '@sohu.com'},
        {'value': this.ruleFormLogin.account.replace('@', '') + '@qq.com'},
        {'value': this.ruleFormLogin.account.replace('@', '') + '@Gmail.com'},
        {'value': this.ruleFormLogin.account.replace('@', '') + '@139.com'},
        {'value': this.ruleFormLogin.account.replace('@', '') + '@189.com'},
        {'value': this.ruleFormLogin.account.replace('@', '') + '@hotmail.com'}
      ]
    },
    loadAll1 () {
      return [
        {'value': this.ruleFormJoin.email.replace('@', '') + '@163.com'},
        {'value': this.ruleFormJoin.email.replace('@', '') + '@126.com'},
        {'value': this.ruleFormJoin.email.replace('@', '') + '@sina.com'},
        {'value': this.ruleFormJoin.email.replace('@', '') + '@yeah.com'},
        {'value': this.ruleFormJoin.email.replace('@', '') + '@sohu.com'},
        {'value': this.ruleFormJoin.email.replace('@', '') + '@qq.com'},
        {'value': this.ruleFormJoin.email.replace('@', '') + '@Gmail.com'},
        {'value': this.ruleFormJoin.email.replace('@', '') + '@139.com'},
        {'value': this.ruleFormJoin.email.replace('@', '') + '@189.com'},
        {'value': this.ruleFormJoin.email.replace('@', '') + '@hotmail.com'}
      ]
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
            this.loginFormVisible = false
            this.account_info.account = res.data.account_info.account
            this.account_info.head_url = res.data.account_info.head_url
            this.account_info.account_id = res.data.account_info.account_id
            this.account_info.email = res.data.account_info.email
            this.account_info.isLogin = true
            this.Cookies.set('info', JSON.stringify(this.account_info), {expires: 1})
            store.commit('flagLogin', false)
            if (hastip) {
              this.$toast('登陆成功', 2000, 'common')
              this.reload()
            }
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
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    },
    skip () {
      this.verifyVisible = false
    },
    closeDialog (formRule) {
      store.commit('flagBuyCoin', false)
      this.$refs[formRule].clearValidate()
      this.$refs[formRule].resetFields()
      if (formRule === 'ruleEmailForm') {
        this.verifyVisible = false
      }
    }
  }
}
</script>
<style>
  .nav-item.search .el-input input{
    padding-right: 30px;
  }
  .buy_coin .el-autocomplete{width: 100%}.main-header-box .el-autocomplete{width: 100%}
  .buy_coin .el-dialog .el-input .el-input__inner{
    border-top: none;
    border-right: none;
    border-left: none;
    border-radius: 0;
  }
  .buy_coin .el-dialog{
    max-width: 500px;
  }
  .login-ruleForm .el-button{
    width: 100%;
  }
</style>
