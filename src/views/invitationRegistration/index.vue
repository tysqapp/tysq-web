<template>
  <div class="invitaton-box">
    <header class="invitaton-header"><router-link to="/home"><img :src="invitatonLogo_src" width="auto" height="auto" alt=""></router-link></header>
    <div class="register-box">
      <div class="item-title"><strong>{{inviteInfo.referrer}}</strong>邀请您注册，</div>
      <div class="item-title">注册后可得{{inviteInfo.invite_score}}积分哦！</div>
      <div class="register-form gold-invite-table">
        <el-form :model="ruleFormJoin" :rules="rulesJoin" ref="ruleFormJoin" label-width="0"  @submit.native.prevent>
          <el-form-item label="" prop="email">
            <el-input v-model="ruleFormJoin.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input :type='type' v-model="ruleFormJoin.password" autocomplete="off" placeholder="请输入密码，不少于6位"><i @click="toggleEye" slot="suffix" class="el-input__icon fa" :class="{'fa-eye-slash': isClose,'fa-eye':isOpen}"></i></el-input>
          </el-form-item>
          <el-form-item label="" prop="captcha" class="base_64">
            <el-input type="text" v-model="ruleFormJoin.captcha" autocomplete="off" placeholder="请输入验证码" @keyup.enter.native="submitFormJoin('ruleFormLogin')"><a slot="suffix"><img width="100" height="35" :src="picImg" alt="图片验证码" class="picImg" @click="getPiceData()"></a></el-input>
          </el-form-item>
          <el-form-item class="agree">
            <el-checkbox v-model="checked" label="我已阅读并同意"></el-checkbox>
            <router-link class="text-primary" to="/personal/getpassword">《{{agreement}}》</router-link>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitFormJoin('ruleFormJoin')" :disabled="!checked||!ruleFormJoin.password||!ruleFormJoin.email||!ruleFormJoin.captcha">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-dialog
        :title="``"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        @close="closeDialog()"
        >
        <p class="fs-24 text-333 send-score-title">注册成功！<br>
          验证邮箱可获得{{activate_email_score}}积分哦！</p>
        <div class="secord">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" status-icon label-width="0" class="demo-ruleForm" @submit.native.prevent>
            <div  class="mb-15">
              <p class="text-333 fs-16"><span>{{ruleForm.email}}</span></p>
            </div>
            <div  class="mb-15">
              <el-form-item prop="captcha">
                <el-input  placeholder="请输入邮箱验证码" v-model="ruleForm.captcha"  @keyup.enter.native="login('ruleForm')" :maxlength="6">
                  <span slot="suffix" class="sendMessage" @click="sendMessage" v-if="flag">发送验证码</span>
                  <span slot="suffix" class="sendtime" v-if="!flag">{{seconds}}s后重新发送</span>
                </el-input>
              </el-form-item>
            </div>
            <el-button type="primary" class="identi-button" @click="login('ruleForm')">认证</el-button>
            <el-button type="text" @click="closeDialog">跳过，以后再说</el-button>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
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
      type: 'password',
      picImg: '',
      agreement: window.GlodConfig.agreement,
      activate_email_score: '',
      inviteInfo: {},
      invitatonLogo_src: window.GlodConfig.invitatonLogo_src,
      isClose: true,
      isOpen: false,
      ruleFormJoin: {
        email: '',
        password: ''
      },
      ruleFormLogin: {
        account: '',
        password: ''
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
      checked: true,
      account_info: {},
      dialogVisible: false,
      flag: true,
      minutes: 0,
      seconds: 60,
      ruleForm: {
        email: '',
        captcha_id: '',
        captcha: ''
      },
      rules: {
        captcha: [
          {required: true, message: '请输入验证码', trigger: 'blur'}
        ]

      }
    }
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
  created () {
    function GetLocalParameters () {
      var name, value
      var str = location.href // 取得整个地址栏
      var num = str.indexOf('?')
      str = str.substr(num + 1) // 取得所有参数   stringvar.substr(start [, length ]

      var arr = str.split('&') // 各个参数放到数组里
      for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf('=')
        if (num > 0) {
          name = arr[i].substring(0, num)
          value = arr[i].substr(num + 1)
          this[name] = value
        }
      }
    }
    let obj = new GetLocalParameters()
    this.ruleFormJoin.referral_code = obj.code
    this.ruleFormJoin.type = Number(obj.type)
    this.ruleFormJoin.client_type = Number(obj.client_type)
    this.http.getInviteLink({referral_code: obj.code}).then(res => {
      if (res.status === 0) {
        this.inviteInfo = res.data
      } else {
        this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
      }
    })
  },
  mounted () {
    this.getPiceData()
  },
  methods: {
    handleLogin () {
      this.$router.push({path: '/login'})
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
    getPiceData () {
      this.http
        .picBase64({captcha_type: 'register'})
        .then(res => {
          if (res.status === 0) {
            this.picImg = res.data.captcha_base64
            this.ruleFormJoin.captcha_id = res.data.captcha_id
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
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
    loginData () {
      this.http
        .userLogin(this.ruleFormLogin)
        .then(res => {
          if (res.status === 0) {
            this.account_info.account = res.data.account_info.account
            this.account_info.head_url = res.data.account_info.head_url
            this.account_info.account_id = res.data.account_info.account_id
            this.account_info.email = res.data.account_info.email
            this.account_info.isLogin = true
            this.dialogVisible = true
            this.Cookies.set('info', JSON.stringify(this.account_info), {expires: 1})
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
            this.ruleForm.email = this.ruleFormJoin.email
            this.ruleFormLogin.account = this.ruleFormJoin.email
            this.ruleFormLogin.password = this.ruleFormJoin.password
            this.activate_email_score = res.data.activate_email_score
            this.loginData()
          } else {
            this.getPiceData()
            this.ruleFormJoin.captcha = ''
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    },
    login (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postData()
        } else {
          return false
        }
      })
    },
    sendMessage () {
      // 邮箱验证码
      if (this.ruleForm.email && this.Email(this.ruleForm.email)) {
        this.timer()
        this.http
          .getCaptcha({email: this.ruleForm.email, type: 'bindEmail'})
          .then(res => {
            if (res.status === 0) {
              this.$toast('验证码已发送邮箱', 2000, 'error')
              this.ruleForm.captcha_id = res.data.captcha_id
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
    // 邮箱认证
    postData () {
      if (this.ruleForm.captcha) {
        this.http
          .bindEmail(this.ruleForm)
          .then(res => {
            if (res.status === 0) {
              this.$toast('认证成功', 2000, 'success')
              this.$router.replace('/home')
            } else {
              this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
            }
          })
      } else {
        this.$toast('请输入邮箱验证码', 2000, 'error')
      }
    },
    closeDialog () {
      this.$router.replace('/home')
    }
  }
}
</script>

<style scoped>
  .invitaton-box{
    position: relative;
    width: 100%;
    min-height: 100%;
    background: #25303f url('../../assets/invitaton/web-invitaton-bg.jpg') repeat-y center 0;
    background-size: 100% 100%;
    background-attachment: fixed;
    padding-top: 160px;
    padding-bottom: 75px;
    min-height: 100vh;
    overflow: hidden;
  }
  .invitaton-header{
    height: 80px;
    line-height: 80px;
    text-align: center;
    background: #051528;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 200;
  }
  .invitaton-header img{
    height: 52px;
    width: auto;
  }
  .register-box{
    background: url('../../assets/invitaton/invitation.png') no-repeat center 0;
    width: 100%;
    max-width: 1000px;
    min-height: 1000px;
    margin: 0 auto;
    border-radius: 20px;
    padding: 80px 300px;
  }
  .item-title{
    font-size: 38px;
    color: #c59b56;
  }
  .register-form{
    max-width: 400px;
    margin: 0 auto;
    padding-top: 50px;
  }
  .register-form .el-button{
    width: 100%;
    padding: 20px 20px;
    background: #c59b56;
    border-color: #c59b56;
    font-size: 18px;
  }
  .register-form .is-disabled{
    background: #f4cb89;
    border-color: #f4cb89;
  }
  .send-score-title{
    margin-bottom: 50px;
  }
  .identi-button{
    width: 100%;
  }
  @media only screen and (max-width: 768px){
    .invitaton-header{
      height: 46px;
      line-height: 46px;
    }
    .invitaton-header img{
      height: 26px;
    }
    .invitaton-box{
      background: #25303f url('../../assets/invitaton/mobile-invitaton-bg.jpg') no-repeat center 0;
      background-size: 100% 100%;
      background-attachment: fixed;
      padding-top: 80px;
      padding-left: 0px;
      padding-right: 0px;
      height: calc(100vh - 0px);
    }
    .register-box{
      background: url('../../assets/invitaton/mobile-invitation.png') no-repeat center 0;
      background-size: 100% auto;
      width: 100%;
      max-width: 1000px;
      min-height: 600px;
      margin: 0 auto;
      padding: 20px 62px;
    }
    .item-title{
      font-size: 18px;
    }
    .send-score-title{
      font-size: 20px;
      margin-bottom: 20px;
    }
    .register-form{
      padding-top: 20px;
    }
    .register-form .el-button{
      width: 100%;
      margin-top: 0px;
      padding: 12px 20px;
      background: #c59b56;
      border-color: #c59b56;
      font-size: 14px;
    }
    .agree{
      word-break: break-all;
    }
  }
  @media only screen and (max-width: 360px){
    .item-title{
      font-size: 16px;
    }
  }
  @media only screen and (max-width: 320px){
    .item-title{
      font-size: 14px;
    }
    .register-box{
      min-height: 600px;
      margin: 0 auto;
      padding: 20px 50px;
    }
  }
</style>

<style>
  .invitaton-box .el-checkbox{
    margin-right: 0;
  }
  .invitaton-box .el-dialog{
    max-width: 520px;
    border-radius: 10px;
  }
  .invitaton-box .el-dialog__body{
    padding: 15px 60px;
    padding-bottom: 36px;
  }
  .invitaton-box .el-dialog .el-input .el-input__inner {
    border-top: none;
    border-right: none;
    border-left: none;
    border-radius: 0;
  }
  .invitaton-box .el-input .el-input__inner{
    height: 45px;
    line-height: 45px;
  }
  .invitaton-box .el-input .picImg{
    margin-top: 2px;
  }
  @media only screen and (max-width: 768px){
    .invitaton-box .el-dialog__body{
      padding: 15px 15px;
      padding-bottom: 36px;
    }
    .invitaton-box .el-input .el-input__inner{
      height: 40px;
      line-height: 40px;
    }
    .invitaton-box .el-input .picImg{
      margin-top: 0px;
    }
    .agree .el-form-item__content{
      line-height: 18px;
    }
    .agree .el-checkbox__label{
      padding-left: 5px;
    }
  }
  @media only screen and (max-width: 320px){
    .invitaton-box .el-form-item{
      margin-bottom: 12px;
    }
    .invitaton-box .el-input .el-input__inner{
      height: 40px;
      line-height: 40px;
    }
    .invitaton-box .el-input .picImg{
      margin-top: 0px;
    }
    .agree .el-form-item__content{
      line-height: 18px;
      font-size: 12px;
    }
    .agree .el-checkbox__label{
      padding-left: 5px;
      font-size: 12px;
    }
  }
</style>
