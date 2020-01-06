
<template>
  <el-dialog class="review_dialog" title="审核" :visible.sync="reviewVisible" width="30%"  @close="close_review('checkForm')">
    <el-form ref="checkForm" :rules="checkFormRules" :model="checkForm" label-width="110px">
      <el-form-item label="审核结果"  prop="status">
        <el-radio-group v-model="checkForm.status" @change="chooseType(checkForm.status)">
          <el-radio :label="item.value" v-for="(item,index) in typeList" :key="index">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="驳回原因" prop="reason" v-if="isShow">
        <el-input type="textarea" v-model="checkForm.reason"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary review_save" @click="checkSubmit('checkForm')">保存</el-button>
      </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'review_article',
  props: {
    modalReviewShow: Boolean,
    articleId: String
  },
  inject: ['reload'],
  data () {
    return {
      reviewVisible: false,
      isShow: false,
      checkFormRules: {
        reason: [
          { required: true, message: '请输入驳回原因', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择可点击', trigger: 'change' }
        ]
      },
      typeList: [
        {label: '通过', value: 1},
        {label: '驳回', value: -2}
      ],
      checkForm: {
        status: '',
        reason: ''
      }
    }
  },
  created () {
    console.log()
  },
  watch: {
    modalReviewShow (val) {
      if (val) {
        this.reviewVisible = val
      } else {
        this.reviewVisible = false
      }
    }
  },
  methods: {
    close_review (formName) {
      this.$refs[formName].resetFields()
      this.$emit('update:modalReviewShow', false)
    },
    checkSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.checkForm.article_id = this.articleId
          this.http.reviewArticle(this.checkForm).then(res => {
            if (res.status === 0) {
              this.$emit('update:modalReviewShow', false)
              this.$refs[formName].resetFields()
              this.reload()
            } else {
              this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    chooseType (type) {
      if (type === 1) {
        this.isShow = false
        delete this.checkForm.reason
      } else {
        this.isShow = true
      }
    }
  }
}
</script>

<style scoped>
  .review_save{
    background-color: #409eff;
    padding: 10px 40px;
  }
</style>
<style>
  .review_dialog .el-dialog{
    min-width:350px;
  }
  .review_dialog .el-dialog__header {
    background: #409eff;
    padding: 15px 20px;
  }
  .review_dialog .el-dialog__title {
    font-size: 16px;
    color: #ffffff;
  }
  .review_dialog .el-dialog__headerbtn .el-dialog__close{
    color: #fff;
  }
  .review_dialog .el-dialog__footer{
    text-align: center;
  }
  .review_dialog .el-dialog__body{
    padding: 15px 20px 0 20px;
  }
  .review_dialog .el-textarea{
   width: 80%;
  }
  .review_dialog .el-textarea .el-textarea__inner{
    min-height: 80px!important;
  }
</style>
