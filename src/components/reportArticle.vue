
<template>
  <el-dialog class="report-dialog" :title="`我要举报《${articleTitle}》`" :visible.sync="reportVisible"  @close="report_review('checkForm')">
    <el-form ref="checkForm" :rules="checkFormRules" :model="checkForm" label-width="110px">
      <el-form-item label="类型"  prop="report_type">
        <el-radio-group v-model="checkForm.report_type">
          <el-radio :label="item.label" v-for="(item,index) in typeList" :key="index">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <el-input type="textarea" v-model="checkForm.note" placeholder="详细说明（必填）" maxlength="150" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary reports-save" @click="reportVisible = false">取消</el-button>
      <el-button type="primary reports-save" @click="checkSubmit('checkForm')" :disabled="forbid">举报</el-button>
      </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'reportArticle',
  props: {
    modalReportShow: Boolean,
    articleId: String,
    articleTitle: String
  },
  data () {
    return {
      forbid: false,
      reportVisible: false,
      isShow: false,
      checkFormRules: {
        report_type: [
          { required: true, message: '请选择可点击', trigger: 'change' }
        ],
        note: [
          { required: true, message: '请输入举报原因', trigger: 'blur' }
        ]
      },
      typeList: [
        {label: '广告或垃圾信息', value: '1'},
        {label: '涉嫌侵权', value: '2'},
        {label: '低质问题', value: '3'},
        {label: '其他', value: '4'}
      ],
      checkForm: {
        report_type: '',
        note: ''
      }
    }
  },
  created () {
    console.log()
  },
  watch: {
    modalReportShow (val) {
      if (val) {
        this.reportVisible = val
      } else {
        this.reportVisible = false
      }
    }
  },
  methods: {
    report_review (formName) {
      this.$refs[formName].resetFields()
      this.$emit('update:modalReportShow', false)
    },
    checkSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.forbid = true
          this.checkForm.id = this.articleId
          this.http.postReportsArticle(this.checkForm).then(res => {
            this.forbid = false
            if (res.status === 0) {
              this.$emit('update:modalReportShow', false)
              this.$refs[formName].resetFields()
              this.$toast('举报成功,等待版主处理！', 2000, 'common')
            } else {
              this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  .reports-save{
    background-color: #409eff;
    padding: 10px 40px;
  }
  .report-dialog .el-radio{
    padding-bottom: 10px;
    width: 50%;
    margin-right: 0;
    padding-right: 15px;
  }
  @media only screen and (max-width: 768px){
    .report-dialog .el-radio{
      width: 100%;
    }
  }
</style>
<style>
  .report-dialog .el-dialog{
    max-width: 600px;
  }
  .report-dialog .el-dialog__header {
    background: #409eff;
    padding: 15px 20px;
  }
  .report-dialog .el-dialog__title {
    font-size: 16px;
    color: #ffffff;
  }
  .report-dialog .el-dialog__headerbtn .el-dialog__close{
    color: #fff;
  }
  .report-dialog .el-dialog__footer{
    text-align: center;
  }
  .report-dialog .el-dialog__body{
    padding: 30px 20px 0 20px;
  }
  .report-dialog .el-textarea{
    width: 80%;
  }
  .report-dialog .el-form-item__label{
    line-height: normal;
  }
  .report-dialog .el-textarea .el-textarea__inner{
    min-height: 80px!important;
  }
</style>
