<template>
  <div class="container main-container">
    <div class="view welcome-view">
      <div class="welcome-context">
        <!-- el-main -->
        <div class="get-pass-box">
          <div class="get-pass-step">
            <!--v-else-->
            <div class="step">
              <h3 class="fs-18">设置新密码</h3>
              <p class="text-999 mb-15">
                新密码应不少于6位
              </p>
              <p class="text-primary">邮箱：{{ruleFormEmail.email}}</p>
              <el-form
                :model="ruleFormEmail"
                :rules="ruleEmail"
                ref="ruleFormEmail"
                label-width=""
                class="pass-ruleForm"
              >
                <el-form-item label="" prop="new_password">
                  <el-input
                    :type='type'
                    v-model="ruleFormEmail.new_password"
                    autocomplete="off"
                    placeholder="请输入新密码"
                  ><i @click="toggleEye" slot="suffix" class="el-input__icon fa" :class="{'fa-eye-slash': isClose,'fa-eye':isOpen}"></i>
                  </el-input>
                </el-form-item>
                <el-form-item label="" prop="repeat_password">
                  <el-input
                    :type='type2'
                    v-model="ruleFormEmail.repeat_password"
                    autocomplete="off"
                    placeholder="再次输入新密码"
                  >
                    <i @click="toggleEye2" slot="suffix" class="el-input__icon fa" :class="{'fa-eye-slash': isClose2,'fa-eye':isOpen2}"></i>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="resetForm('ruleFormEmail');"
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
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (value.length < 6) {
          callback(new Error('密码不能低于6位'))
        } else {
          if (this.ruleFormEmail.repeat_password) {
            this.$refs.ruleFormEmail.validateField('repeat_password')
          }
          callback()
        }
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleFormEmail.new_password) {
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
      type2: 'password',
      isClose: true,
      isOpen: false,
      isClose2: true,
      isOpen2: false,
      // 表单
      ruleFormEmail: {
        email: this.$route.query.email ? this.$route.query.email : '',
        captcha: this.$route.query.captcha ? this.$route.query.captcha : '',
        captcha_id: this.$route.query.captcha_id ? this.$route.query.captcha_id : ''
      },
      ruleEmail: {
        new_password: [{ required: true, validator: validatePass, trigger: 'blur' }],
        repeat_password: [{ required: true, validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  inject: ['reload'],
  computed: {
  },
  methods: {
    resetForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.putData()
        } else {
          return false
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
            this.$toast('密码重置成功', 2000, 'common')
            this.$router.push({path: '/home'})
            window.sessionStorage.clear()
            this.reload()
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
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
    toggleEye2 () {
      this.isOpen2 = !this.isOpen2
      this.isClose2 = !this.isClose2
      if (this.isOpen2 === true) {
        this.type2 = 'text'
      } else {
        this.type2 = 'password'
      }
    }
  }
}
</script>

<style scoped>
  .view{
    width: 100%;
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
