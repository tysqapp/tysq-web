<template>
  <el-dialog
    class="forbid_dialog"
    title="禁止评论"
    :visible.sync="forbidVisible"
    width="30%"
    @close="close_forbid"
  >
    <p><span class="forbid_account_name">{{account_name}}</span>禁止在以下模块评论或者回复(不勾选,则允许评论)</p>
    <div class="forbid_content mb-20" v-for="(item,index) in categorys" :key="index">
      <div class="forbid_first p-10">
        <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checkAll" @change="handleCheckAllChange(item,$event)"><span class="first-category">{{item.category_name}}</span></el-checkbox>
      </div>
      <div class="p-10 forbid_second" v-if="item.sub_category&&item.sub_category.length>0">
        <el-checkbox-group v-model="item.checkedCategorys"  @change="handleCheckedCitiesChange(item,$event)">
          <el-checkbox v-for="(city,index1) in item.sub_category" :label="city.category_id" :key="index1">{{city.category_name}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button type="primary" class="forbid_save" @click="save_forbid">保存</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'forbid_comments',
  props: {
    commentator_categorys: {
      type: Array,
      required: true
    },
    modalForbidShow: Boolean,
    account_id: Number,
    from_scource: String,
    account_name: String
  },
  data () {
    return {
      forbidVisible: false,
      categorys: []
    }
  },
  created () {

  },
  mounted () {
  },
  watch: {
    commentator_categorys (val) {
      if (val) {
        this.categorys = val
      } else {
        this.categorys = []
      }
    },
    modalForbidShow (val) {
      if (val) {
        this.forbidVisible = val
      } else {
        this.forbidVisible = false
      }
    }
  },
  methods: {
    close_forbid () {
      this.$emit('update:modalForbidShow', false)
    },
    save_forbid () {
      let postJson = {}
      let categoryIds = []
      postJson.account_id = this.account_id
      this.categorys.forEach(item => {
        if (item.sub_category && item.sub_category.length > 0) {
          if (item.checkAll) {
            let obj = {}
            obj.parent_id = item.category_id
            obj.sub_id = item.checkedCategorys
            categoryIds.push(obj)
          } else {
            if (item.checkedCategorys.length > 0) {
              let obj = {}
              obj.parent_id = 0
              obj.sub_id = item.checkedCategorys
              categoryIds.push(obj)
            }
          }
        } else {
          if (item.checkAll) {
            let obj = {}
            obj.parent_id = item.category_id
            obj.sub_id = null
            categoryIds.push(obj)
          }
        }
      })

      if (categoryIds.length > 0) {
        postJson.category_ids = categoryIds
      }
      this.http.forbidComment(postJson).then(res => {
        if (res.status === 0) {
          this.$toast('保存成功', 2000, 'common')
          this.$emit('update:modalForbidShow', false)
          if (this.from_scource === 'moderComment') {
            this.$parent.getBanListData()
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    handleCheckAllChange (item) {
      item.checkedCategorys = item.checkAll ? item.sub_category.map(c => c.category_id) : []
      item.isIndeterminate = false
    },
    handleCheckedCitiesChange (item) {
      let checkedCount = item.checkedCategorys.length
      if (item.checkAll) {
        if (checkedCount !== item.sub_category.length) {
          item.checkAll = false
          item.isIndeterminate = false
        }
      }
    }
  }
}
</script>

<style scoped>
  .forbid_first{
    background-color: #EAF0FE;
  }
  .forbid_account_name{
    color: #409EFF
  }
  .forbid_second{
    border: 1px solid #EAF0FE;
  }
  .forbid_save{
    background-color: #409eff;
    padding: 10px 40px;
  }
  .first-category{
    color:#606266;
    font-size: 14px;
    font-weight: bold;
  }
</style>
<style>
  .forbid_dialog .el-dialog{
    min-width: 350px;
  }
  .forbid_dialog .el-dialog__header {
    background: #409eff;
    padding: 15px 20px;
  }
  .forbid_dialog .el-dialog__title {
    font-size: 16px;
    color: #ffffff;
  }
  .forbid_dialog .el-dialog__headerbtn .el-dialog__close{
    color: #fff;
  }
  .forbid_dialog .el-dialog__footer{
    text-align: center;
  }
  .forbid_dialog .el-dialog__body{
    padding: 15px 20px 0 20px;
  }
</style>
