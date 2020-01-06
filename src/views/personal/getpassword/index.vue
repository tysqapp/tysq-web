<template>
  <div class="container main-container">
    <div class="view welcome-view">
      <div class="welcome-context">
        <!-- el-main -->
        <div class="get-pass-box">
          <div class="get-pass-step">
            <!--v-if="isTrue"-->
            <div class="step">
              <h3 class="fs-18">找回密码</h3>
              <p class="text-999 mb-15">验证码将会发送至你的邮箱</p>
              <el-form
                :model="ruleFormEmail"
                :rules="ruleEmail"
                ref="ruleFormEmail"
                label-width=""
                class="pass-ruleForm"
              >
                <el-form-item label="" prop="email">
                  <el-input
                    v-model="ruleFormEmail.email"
                    placeholder="请输入邮箱"
                  ></el-input>
                </el-form-item>
                <el-form-item label="" prop="captcha">
                  <el-input type="text" v-model="ruleFormEmail.captcha" autocomplete="off" placeholder="输入验证码">
                    <span v-if="flag" @click="sendCode" class="sendMessage" slot="suffix">发送验证码</span>
                    <span v-if="!flag" class="sendtime" slot="suffix">{{seconds}}s后重新发送</span>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleFormEmail');"
                  >下一步</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <!-- el-main -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    var validateEmail = (rule, value, callback) => {
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
    var validatePass = (rule, value, callback) => {
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
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleFormEmail.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      flag: true,
      minutes: 0,
      seconds: 60,
      type: 'password',
      isClose: true,
      isOpen: false,
      // 表单
      ruleFormEmail: {
        email: this.$route.query.account ? this.$route.query.account : ''
      },
      ruleEmail: {
        email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
        captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        password: [{ required: true, validator: validatePass, trigger: 'blur' }],
        checkPass: [{ required: true, validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  computed: {
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.getEmailverify()
        } else {
          return false
        }
      })
    },
    getEmailverify () {
      this.http.getverify(this.ruleFormEmail).then(res => {
        if (res.status === 0) {
          this.$router.push({path: '/personal/GetpasswordTwo', query: this.ruleFormEmail})
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
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
    sendCode () {
      if (this.ruleFormEmail.email && this.Email(this.ruleFormEmail.email)) {
        this.timer()
        this.http
          .getCaptcha({email: this.ruleFormEmail.email, type: 'resetPassword'})
          .then(res => {
            if (res.status === 0) {
              this.$toast('验证码已发邮箱，请查收', 2000, 'common')
              this.ruleFormEmail.captcha_id = res.data.captcha_id
            } else {
              this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
            }
          })
      } else {
        this.$toast('请输入正确的邮箱', 2000, 'error')
      }
    },
    putData () {
      this.http
        .getPassword(this.ruleFormEmail)
        .then(res => {
          if (res.status === 0) {

          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    }
  }
}
</script>

<style scoped>
  .view{
    width: 100%
  }
  .get-pass-box {
    max-width: 1024px;
    margin: 0 auto;
  }
  .get-pass-step {
    padding: 50px 20px;
    background: #ffffff;
    margin-bottom: 20px;
  }
  .step {
    max-width: 400px;
    margin: 0 auto;
  }
  .step .el-button {
    width: 100%;
  }
  .pass-ruleForm .fa{
    cursor: pointer;
    margin-right: 0;
  }
</style>
<style>
.step .el-input .el-input__inner {
  border-top: none;
  border-right: none;
  border-left: none;
  border-radius: 0;
}
</style>
