<template>
  <div class="container main-container get_way">
    <div class="view welcome-view">
      <div class="welcome-context">
        <div class="invite-box">
          <div class="invite-info-box">
            <div class="type-title clearfix gold"><h2 class="pull-left title">您已成功邀请了{{tableData.length}}人</h2></div>
            <div class="gold-invite-table">
              <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                  prop="email"
                  label="邮箱"
                  align="center"
                  width="">
                </el-table-column>
                <el-table-column
                  prop="created_at"
                  label="注册日期"
                  align="center"
                  width="">
                </el-table-column>
              </el-table>
              <div class="box-pagination" v-if="total>10">
                <el-pagination
                  background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[5, 10, 20, 30]"
                  :page-size="size"
                  :total="total"
                  layout="total, sizes, prev, pager, next, jumper"
                >
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClipboardDemo',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      total: 30,
      size: 10
    }
  },
  computed: {
  },
  mounted () {
    this.getData({size: 10})
  },
  methods: {
    // 复制
    getData (params) {
      this.http.getFriends(params).then(res => {
        if (res.status === 0) {
          this.total = res.data.total_num
          if (res.data.referral_list) {
            res.data.referral_list.forEach(item => {
              item.created_at = this.getTime(item.created_at)
            })
            this.tableData = res.data.referral_list
          } else {
            this.tableData = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    // 页码
    handleSizeChange (val) {
      this.size = val
      this.currentPage = 1
      this.getData({size: this.size})
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getData({size: this.size, start: (Number(val) - 1) * this.size})
    }
  }
}
</script>

<style scoped>
  .main-container>.view{
    width: 100%;
  }
  .invite-banner img{
    width: 100%;
    height: auto;
  }
  @media only screen and (max-width: 768px){
    .share-erm img{
      width: 100px;
      height: 100px;
    }
    .invite-type-box .copy-btn{
      padding: 10px 15px;
      margin-left: 10px;
    }
    .invite-type-box h4 > span{
      margin-right: 10px;
    }
    .invite-type-box p{
      padding-left: 25px;
    }
    .invite-box{
      border-radius: 0;
    }
  }
</style>
<style>
  .get_way .el-dialog__header {
    border-bottom: 1px solid #ddd;
  }
  .get_way .el-dialog__body{
    padding-top: 10px;
  }
  .get_way .el-dialog{
    width: 800px;
  }
  @media only screen and (max-width: 768px) {
    .get_way .el-dialog {
      width: 86%;
    }
  }
</style>
