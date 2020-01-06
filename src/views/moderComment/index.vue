<template>
    <!-- el-main -->
    <div class="right-examine-box">
      <h2>禁止评论列表</h2>
      <div class="examine-tab">
        <div class="examine-box">
          <el-form ref="ruleBanForm" :label-position="labelPosition" :model="banForm" label-width="70px" class="search-form">
            <el-row :gutter="10">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="padding-40">
                <el-form-item label="用户昵称" align="left" prop="title">
                  <el-input v-model="banForm.account"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label-width="0"  align="right">
                  <el-button type="primary" @click="banOnSubmit">搜索</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="examine-list">
            <el-table
              :data="commitListTableData"
              border
              style="width: 100%">
              <el-table-column
                prop="account"
                label="被禁止用户"
                width="120" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.account}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="禁止评论模块"
                width=""
                align="center">
                <template slot-scope="scope">
                  <p class="p-level" v-for="(item,index) in scope.row.category_list" :key="index"><span class="one-level">{{item.category_name}}：</span> <span class="two-level" v-for="(item1,index1) in item.sub_category" :key="index1">{{item1.category_name}}</span> </p>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                width="100"
                label="操作"
                align="center">
                <template slot-scope="scope">
                  <el-button type="primary" plain size="small" @click="seting(scope.row)">设置</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="box-pagination">
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
      <!--forbid-seting-->
      <forbid-seting :modalForbidShow.sync="forbidVisible" :account_id="commentId" :commentator_categorys="categorys" :account_name="accountName" :from_scource="fromScource"></forbid-seting>
      <!--forbid-seting-->
    </div>
    <!-- el-main -->
</template>

<script>
import forbidComments from '../../components/forbid_comments'
export default {
  name: 'moderComment',
  components: {
    'forbid-seting': forbidComments
  },
  data () {
    return {
      labelPosition: 'right',
      fromScource: 'moderComment',
      banForm: {},
      commitListTableData: [],
      category_list: [],
      forbidVisible: false,
      commentId: null,
      accountName: '',
      categorys: [],
      // 页码
      total: 0,
      size: 10,
      currentPage: 1
    }
  },
  inject: ['reload'],
  computed: {},
  mounted () {
    this.getBanListData()
  },
  methods: {
    getBanListData (params) {
      this.http
        .banCommitList(params)
        .then(res => {
          if (res.status === 0) {
            if (res.data.forbid_comment && res.data.forbid_comment.length > 0) {
              this.commitListTableData = res.data.forbid_comment
              this.total = res.data.total_num
            } else {
              this.commitListTableData = []
            }
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    },
    banOnSubmit () {
      this.getBanListData({account: this.banForm.account})
    },
    seting (v) {
      this.forbidVisible = true
      this.commentId = v.account_id
      this.accountName = v.account
      if (v.category_list) {
        this.has_forbid_categorys(v.category_list)
      } else {
        this.no_forbid_categorys()
      }
    },
    has_forbid_categorys (v) {
      this.http.moderatorCategorys().then(res => {
        if (res.status === 0) {
          if (res.data.categorys) {
            if (v) {
              v.forEach(item1 => {
                if (item1.category_id === 0) {
                  res.data.categorys.forEach(item => {
                    if (item1.position_id === item.category_id) {
                      item.isIndeterminate = false
                      item.checkAll = false
                      item.checkedCategorys = item1.sub_category.map(c => c.category_id)
                    }
                  })
                } else {
                  res.data.categorys.forEach(item => {
                    if (item1.category_id === item.category_id) {
                      item.isIndeterminate = false
                      item.checkAll = true
                      item.checkedCategorys = item1.sub_category ? item1.sub_category.map(c => c.category_id) : []
                    }
                  })
                }
              })
            }
            res.data.categorys.forEach(item => {
              if (!item.checkedCategorys) {
                item.isIndeterminate = false
                item.checkAll = false
                item.checkedCategorys = []
              }
            })
            this.categorys = res.data.categorys
          } else {
            this.categorys = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    no_forbid_categorys () {
      this.http.moderatorCategorys().then(res => {
        if (res.status === 0) {
          if (res.data.categorys) {
            res.data.categorys.forEach(item => {
              item.isIndeterminate = false
              item.checkAll = false
              item.checkedCategorys = []
            })
            this.categorys = res.data.categorys
          } else {
            this.categorys = []
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
      this.getBanListData({account: this.banForm.account, size: this.size})
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getBanListData({account: this.banForm.account, size: this.size, start: (val - 1) * this.size})
    }
  }
}
</script>

<style scoped>
  .right-examine-box{
    background-color: #FFFFFF;
    padding: 30px 30px;
    border-radius: 5px;
  }
  .right-examine-box h2{
    font-size: 20px;
    margin: 0;
  }
  .examine-box{
    padding: 25px 0;
  }
  .examine-box .p-level{
    background: #f7f7f7;
    border-radius: 4px;
    padding: 5px 10px;
    text-align: left;
  }
  .examine-box .one-level{
    padding-left: 10px;
    color: #333333;
    font-weight: 700;
    position: relative;
  }
  .examine-box .one-level:before{
    content: "";
    width: 4px;
    height: 14px;
    background: #598CF2;
    position: absolute;
    left: 0;
    top: 3px;
  }
  .examine-box .two-level{
    display: inline-block;
    background: #eaf1fe;
    border: 1px solid #598CF2;
    border-radius: 4px;
    color: #598cf2;
    padding: 5px 10px;
    margin: 5px 5px;
  }
  .search-form .el-col-11{
    padding-left: 0!important;
    padding-right: 0!important;
  }
  @media only screen and (min-width: 768px) {
    .padding-40{
      padding-right: 45px!important;
    }
  }
  @media only screen and (max-width: 1200px) {
  }
  @media only screen and (max-width: 768px) {

  }
</style>
<style>
  .search-form .el-date-editor.el-input, .search-form .el-date-editor.el-input__inner{
    width: 100%;
  }
  .search-form .el-select{
    width: 100%;
  }
  .examine-list table th{
    background-color: #eaf1fe;
    color: #9fadc2;
    border: none 0;
  }
</style>
