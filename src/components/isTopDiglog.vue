
<template>
  <el-dialog class="top-dialog" title="置顶" :visible.sync="topVisible" @close="hideDiglog('form')">
    <el-form label-width="90px">
      <el-form-item label="置顶排序：" prop="top_position">
        <el-input v-model.number="top_num"  oninput="value=value.replace(/[^\d]/g,'')"></el-input>
      </el-form-item>
    </el-form>
    <div class="top-dialog-p">
      <p class="text-999">1、请输入置顶文章的排序，数字越大的排在前面；</p>
      <p class="text-999">2、输入0代表取消置顶；</p>
      <p class="text-999">3、只能输入0和正整数;</p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary top-save" @click="submit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'isTopDiglog',
  props: {
    modalTopShow: Boolean,
    articleId: String,
    topNum: Number
  },
  data () {
    return {
      topVisible: false,
      top_num: 0
    }
  },
  mounted () {},
  methods: {
    hideDiglog () {
      this.$emit('update:modalTopShow', false)
    },
    submit () {
      if (this.top_num === '') {
        this.$toast('请输入你要设置的正整数', 2000, 'error')
      } else {
        this.http.setTopArticle(this.articleId, {top_position: this.top_num}).then(res => {
          if (res.status === 0) {
            if (res.data.success === true) {
              this.topVisible = false
            }
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
      }
    }
  },
  watch: {
    modalTopShow (val) {
      if (val) {
        this.topVisible = val
      } else {
        this.topVisible = false
      }
    },
    topNum (val) {
      if (val) {
        this.top_num = val
      } else {
        this.top_num = 0
      }
    }
  },
  created () {}
}
</script>
<style scoped>
  .top-dialog .el-form{
    max-width: 300px;
  }
  .top-dialog-p{
    padding: 0 15px;
  }
  .top-save{
    width: 140px;
    text-align: center;
  }
</style>
<style>
  .top-dialog .el-dialog{
    max-width: 480px;
  }
  .top-dialog .el-dialog__body{
    padding: 20px 20px;
    color: #333333;
  }
  .top-dialog .el-dialog__header {
    background: #409eff;
    padding: 15px 20px;
  }
  .top-dialog .el-dialog__title {
    font-size: 16px;
    color: #ffffff;
  }
  .top-dialog .el-dialog__headerbtn .el-dialog__close{
    color: #fff;
  }
  .top-dialog .el-dialog__footer{
    text-align: center;
  }
</style>
