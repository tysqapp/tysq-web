<template>
  <el-dialog title="登录" :visible.sync="dialogFormVisible">
    <el-form :model="ruleFormLogin" :rules="rulesLogin" ref="ruleFormLogin" label-width="" class="demo-ruleForm">
      <el-form-item label="" prop="phone">
        <el-input v-model.number="ruleFormLogin.phone" placeholder="输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="" prop="pass">
        <el-input type="password" v-model="ruleFormLogin.pass" autocomplete="off" placeholder="输入密码"></el-input>
      </el-form-item>
      <el-form-item class="forget-pass">
        <a href="javascript:;" class="text-primary">忘记密码？</a>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleFormLogin')">登录</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('ruleFormLogin')">注册</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入正确手机号'))
        } else {
          if (value < 18) {
            callback(new Error('手机号格式不对'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error('密码错误!'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: true,
      ruleFormLogin: {
        phone: '',
        pass: ''
      },
      rulesLogin: {
        pass: [
          { validator: validatePass, trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        phone: [
          { validator: validatePhone, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([

    ])

  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  mounted () {

  }
}
</script>

<style scoped>
  .forget-pass{
    text-align: right;
    line-height: 20px;
    margin-bottom: 15px;
  }
  .el-button{
    width: 100%;
  }
</style>
<style>
  .el-dialog .el-input .el-input__inner{
    border-top: none;
    border-right: none;
    border-left: none;
    border-radius: 0;
  }
</style>
