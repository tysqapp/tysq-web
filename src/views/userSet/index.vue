<template>
  <div class="container main-container">
    <div class="view welcome-view">
      <div class="welcome-context">
        <div class="set-info-box border-radius-4">
          <div class="head-title">账号与密码</div>
          <div class="set-info">
            <el-form :label-position="labelPosition" label-width="70px" :model="formLabelAlign">
              <el-row :gutter="0">
                <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16">
                  <el-form-item label="账号">
                    <el-input v-model="formLabelAlign.email" readonly></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" v-if="email_status===-1">
                  <div v-show="!emailShow" class="edit-btn text-primary text-right">
                    <span @click="editThis('emailShow')" class="email-yanzheng">验证邮箱,送500积分<i class="el-icon-arrow-down"></i></span>
                    <span @click="editThis('emailShow')" class="email-yanzheng-phone">验证邮箱<i class="el-icon-arrow-down"></i></span>
                  </div>
                  <div v-if="emailShow" class="edit-btn text-primary text-right">
                    <span @click="save('emailShow')">收起 <i class="el-icon-arrow-up"></i></span>
                  </div>
                </el-col>
              </el-row>
              <el-form v-if="emailShow" :model="ruleEmailForm" :rules="ruleEmail" ref="ruleEmailForm" class="set-pass">
                <el-row :gutter="0">
                  <el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
                    <el-form-item label="" prop="captcha">
                      <el-input  placeholder="请输入邮箱验证码" v-model="ruleEmailForm.captcha"  @keyup.enter.native="submitEmail('ruleEmailForm')" :maxlength="6">
                        <span slot="suffix" class="sendMessage" @click="sendMessage" v-if="flag">获取验证码</span>
                        <span slot="suffix" class="sendtime" v-if="!flag">{{seconds}}s后重新发送</span>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="0">
                  <el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
                    <el-form-item>
                      <el-button type="primary" @click="submitEmail('ruleEmailForm')">确定</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <el-row :gutter="0">
                <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
                  <el-form-item label="密码">
                    <el-input v-model="formLabelAlign.text" readonly type="text"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                  <div v-show="!isShow" class="edit-btn text-primary text-right">
                    <span @click="editThis">修改 <i class="el-icon-arrow-down"></i></span>
                  </div>
                  <div v-if="isShow" class="edit-btn text-primary text-right">
                    <span @click="save">收起 <i class="el-icon-arrow-up"></i></span>
                  </div>
                </el-col>
              </el-row>
              <el-form v-if="isShow" :model="ruleForm" :rules="rules" ref="ruleForm" class="set-pass">
                <el-row :gutter="0">
                  <el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
                    <el-form-item label="" prop="old_password">
                      <el-input :type='type' v-model="ruleForm.old_password" placeholder="输入旧密码"><i @click="toggleEye()" slot="suffix" class="el-input__icon fa" :class="{'fa-eye-slash': isClose,'fa-eye':isOpen}"></i></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="0">
                  <el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
                    <el-form-item label="" prop="new_password">
                      <el-input :type='type' v-model="ruleForm.new_password" placeholder="请输入新密码，不少于6位"><i @click="toggleEye" slot="suffix" class="el-input__icon fa" :class="{'fa-eye-slash': isClose,'fa-eye':isOpen}"></i></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="0">
                  <el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
                    <el-form-item label="" prop="sure_password">
                      <el-input :type='type' v-model="ruleForm.sure_password" placeholder="请再次输入新密码，不少于6位"><i @click="toggleEye" slot="suffix" class="el-input__icon fa" :class="{'fa-eye-slash': isClose,'fa-eye':isOpen}"></i></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="0">
                  <el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
                    <el-form-item>
                      <el-button type="primary" @click="onSubmit('ruleForm')">提交</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'userSet',
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (value.length < 6) {
          callback(new Error('密码不能低于6位'))
        } else {
          if (this.ruleForm.surePassword !== '') {
            this.$refs.ruleForm.validateField('surePassword')
          }
          callback()
        }
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.new_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      labelPosition: 'left',
      formLabelAlign: {
        email: '',
        text: '已设置'
      },
      email_status: -1,
      type: 'password',
      flag: true,
      minutes: 0,
      seconds: 60,
      emailShow: false,
      isShow: false,
      isClose: true,
      isOpen: false,
      ruleForm: {
        old_password: '',
        new_password: '',
        sure_password: ''
      },
      ruleEmailForm: {
        email: '',
        captcha: ''
      },
      ruleEmail: {
        captcha: [
          {required: true, message: '请输入邮箱验证码', trigger: 'blur'}
        ]
      },
      rules: {
        old_password: [
          {required: true, message: '请输入原密码', trigger: 'blur'}
        ],
        new_password: [
          {required: true, validator: validatePass, trigger: 'blur'}
        ],
        sure_password: [
          {required: true, validator: validatePass2, trigger: 'blur'}
        ]
      }
    }
  },
  inject: ['reload'],
  computed: {
  },
  mounted () {
    this.getEmalStatus()
  },
  methods: {
    toggleEye () {
      this.isOpen = !this.isOpen
      this.isClose = !this.isClose
      if (this.isOpen === true) {
        this.type = 'text'
      } else {
        this.type = 'password'
      }
    },
    getEmalStatus () {
      this.http.userInfo().then(res => {
        if (res.status === 0) {
          this.email_status = res.data.account_info.email_status
          this.formLabelAlign.email = res.data.account_info.email
          this.ruleEmailForm.email = res.data.account_info.email
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postData()
          this.reload()
        } else {
          return false
        }
      })
    },
    submitEmail (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.http.bindEmail(this.ruleEmailForm).then(res => {
            if (res.status === 0) {
              this.$toast('验证成功', 2000, 'common')
              this.emailShow = !this.emailShow
              this.getEmalStatus()
            } else {
              this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
            }
          })
        } else {
          return false
        }
      })
    },
    sendMessage () {
      this.timer()
      this.http
        .getCaptcha({email: this.formLabelAlign.email, type: 'bindEmail'})
        .then(res => {
          if (res.status === 0) {
            this.$toast('验证码已发送邮箱', 2000, 'common')
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
    postData () {
      this.http
        .changePassword(this.ruleForm)
        .then(res => {
          if (res.status === 0) {
            this.$toast('密码设置成功', 2000, 'common')
            this.save()
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    },
    editThis (params) {
      if (params === 'emailShow') {
        this.emailShow = !this.emailShow
      } else {
        this.isShow = !this.isShow
      }
    },
    save (params) {
      if (params === 'emailShow') {
        this.emailShow = !this.emailShow
      } else {
        this.isShow = !this.isShow
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .main-container>.view{
    width: 100%;
  }
  .set-info-box{
    background: #ffffff;
  }
  .head-title{
    padding: 30px 30px;
    font-size: 20px;
    border-bottom: 1px solid #e5e5e5;
  }
  .set-info{
    padding: 50px 0 200px 0;
    max-width: 580px;
    margin: 0 auto;
  }
  .edit-btn{
    line-height: 40px;
    cursor: pointer;
  }
  .set-pass{
    border-radius: 4px;
    background: #f7f7f7;
    border: 1px solid #e5e5e5;
    padding: 25px 50px;
  }
  .set-pass .el-button{
    width: 100%;
  }
  .set-pass .fa{
    cursor: pointer;
    margin-right: 0;
  }
  .set-info .email-yanzheng-phone{
    display: none;
  }
  @media only screen and (max-width: 768px) {
    .set-info{
      padding: 10px 10px;
    }
    .set-info .email-yanzheng-phone{
      display: inline-block;
    }
    .set-info .email-yanzheng{
      display: none;
    }
    .set-pass{
      padding: 15px 20px;;
    }
  }
</style>
<style>
  .set-info .el-form-item__label{
    color: #999999;
  }
  .set-info .el-input__inner{
    border: none 0;
  }
</style>
