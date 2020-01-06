<template>
  <!-- el-main -->
  <div class="right-examine-box">
    <h2>文章审核列表</h2>
    <div class="examine-tab">
      <ul class="clearfix tab-nav-ul">
        <li
          class="tab-nav-li"
          :class="{ active: active1 }"
          @click="changeFileStatus1();"
        >
          <span>{{ `待审核(${toExamineNumber})` }}</span>
        </li>
        <li
          class="tab-nav-li"
          :class="{ active: active2 }"
          @click="changeFileStatus2();"
        >
          <span>{{ `全部(${allExamineNumber})` }}</span>
        </li>
      </ul>
      <div class="examine-box">
        <el-form ref="ruleForm" :label-position="labelPosition" :model="form" label-width="70px" class="search-form">
          <el-row :gutter="10">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="padding-40">
              <el-form-item label="标题" align="left" prop="title">
                <el-input v-model="form.title"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="padding-40">
              <el-form-item label="版块" align="left" prop="parent_id">
                <el-col :span="11" style="padding: 0!important">
                  <el-select v-model="form.parent_id" placeholder="选择一级分类" @change="go_subNav" clearable>
                    <el-option :label="item.name" :value="item.id" v-for="(item,index) in nav" :key="index"></el-option>
                  </el-select>
                </el-col>
                <el-col class="line text-center" :span="2">-</el-col>
                <el-col :span="11" style="padding: 0!important">
                  <el-select v-model="form.category_id" placeholder="选择二级分类" clearable>
                    <el-option :label="item.name" :value="item.id" v-for="(item,index) in sub_nav" :key="index"></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="padding-40">
              <el-form-item label="提交日期">
                <el-col :span="11" style="padding: 0!important">
                  <el-form-item label-width="0" prop="start_time">
                    <el-date-picker
                      v-model="form.start_time"
                      type="date"
                      placeholder="开始日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col class="line text-center" :span="2">-</el-col>
                <el-col :span="11" style="padding: 0!important">
                  <el-form-item label-width="0" prop="end_time">
                    <el-date-picker
                      v-model="form.end_time"
                      type="date"
                      placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="padding-40">
              <el-form-item label="发布人" align="left" prop="author">
                <el-input v-model="form.author"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="padding-40" v-if="active2">
              <el-form-item label="状态" align="left" prop="status">
                <el-select v-model="form.status" placeholder="请选择状态">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="padding-40" v-if="active2">
              <el-form-item label="置顶" align="left" prop="is_top">
                <el-select v-model="form.is_top" placeholder="请选择状态" clearable>
                  <el-option v-for="item in optionsTop" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label-width="50">
                <el-button type="primary" @click="onSubmit">搜索</el-button>
                <el-button type="warning" @click="clearSubmit('ruleForm')">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="examine-list" v-show="active1">
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              prop="title"
              label="文章标题"
              width="" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.title}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="版块"
              width="120"
              align="center">
              <template slot-scope="scope">
                <p>{{scope.row.first_category}}</p>
                <p>{{scope.row.sub_category}}</p>
              </template>
            </el-table-column>
            <el-table-column
              label="发布人"
              width="100" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.author}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="提交审核时间"
              width="110"
              align="center">
              <template slot-scope="scope">
                <span>{{scope.row.updated_at}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
              width="90"
              align="center">
              <template slot-scope="scope">
                <span>{{scope.row.status_name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              width="120"
              label="操作"
              align="center">
              <template slot-scope="scope">
                <router-link :to="path+scope.row.article_id"><el-button type="primary" plain size="small">查看详情</el-button></router-link>
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
              layout="total, prev, pager, next, jumper"
            >
            </el-pagination>
          </div>
        </div>
        <div class="examine-list" v-show="active2">
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              prop="title"
              label="文章标题"
              width="130" align="center">
              <template slot-scope="scope">
                <span class="is-top-sign" v-if="scope.row.top_position>0">置顶:{{scope.row.top_position}}</span><span>{{scope.row.title}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="版块"
              width="100"
              align="center">
              <template slot-scope="scope">
                <p>{{scope.row.first_category}}</p>
                <span>{{scope.row.sub_category}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="发布人"
              width="100" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.author}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="审核时间"
              width="110"
              align="center">
              <template slot-scope="scope">
                <span>{{scope.row.review_at}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="审核人"
              width="100" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.operator_name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
              width="90"
              align="center">
              <template slot-scope="scope">
                <span>{{scope.row.status_name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              width="200"
              label="操作"
              align="center">
              <template slot-scope="scope">
                <router-link :to="path+scope.row.article_id"><el-button type="primary" plain size="small">查看详情</el-button></router-link>
                <el-button type="primary" plain size="small" @click="setRules(scope.row.article_id)">设置</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="box-pagination">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="size"
              :total="total"
              layout="total, prev, pager, next, jumper"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <set-rules :modalSetShow.sync="setRulesShow"  :articleConfigs="articleConfigs" :articleId="article_id"></set-rules>
  </div>
  <!-- el-main -->
</template>

<script>
import setRules from '../../components/setRules'
export default {
  name: 'moderAricle',
  components: {
    'set-rules': setRules
  },
  data () {
    return {
      path: 'article/info?article_id=',
      active1: true,
      active2: false,
      toExamineNumber: 0,
      allExamineNumber: 0,
      labelPosition: 'right',
      oldform: {},
      form: {status: -1},
      nav: [],
      sub_nav: [],
      options: [
        {value: 0, label: '全部'},
        {value: 1, label: '已发布'},
        {value: -2, label: '审核驳回'},
        {value: -4, label: '已隐藏'},
        {value: -1, label: '待审核'}
      ],
      optionsTop: [
        {value: 1, label: '是'},
        {value: 2, label: '否'}
      ],
      tableData: [],
      setRulesShow: false,
      article_id: '',
      articleConfigs: [],
      // 页码
      total: 0,
      size: 10,
      currentPage: 1
    }
  },
  inject: ['reload'],
  computed: {},
  mounted () {
    this.geCategory()
    this.getArticlesListData({status: -1})
    this.getUnreadNumber({type: 'article'})
  },
  methods: {
    onSubmit () {
      this.currentPage = 1
      this.form.start = 0
      this.form.size = 10
      this.checkoutData()
    },
    clearSubmit (formName) {
      this.$refs[formName].resetFields()
      delete this.form.category_id
      if (this.active1 === true) {
        this.getArticlesListData({status: -1})
      } else {
        this.getArticlesListData({status: 0})
      }
    },
    checkoutData () {
      this.oldform = Object.assign({}, this.form)
      if (this.form.start_time) {
        this.form.start_time = new Date(this.form.start_time).getTime() / 1000
      } else {
        this.form.start_time = 0
      }
      if (this.form.end_time) {
        this.form.end_time = new Date(this.form.end_time).getTime() / 1000
      } else {
        this.form.end_time = 0
      }
      if (this.form.start_time && this.form.end_time) {
        if (this.form.start_time > this.form.end_time) {
          this.$toast('结束日期不能小于开始日期', 2000, 'error')
          this.form = this.oldform
          return false
        } else if (this.form.start_time === this.form.end_time) {
          this.form.end_time = this.form.end_time + 24 * 60 * 1000
        }
      }
      if (this.form.parent_id === '') {
        delete this.form.parent_id
      }
      if (this.form.category_id === '') {
        delete this.form.category_id
      }
      if (this.form.is_top === '') {
        delete this.form.is_top
      }
      if (this.active1) {
        this.form.status = -1
      }
      this.getArticlesListData(this.form)
    },
    go_subNav (value) {
      delete this.form.category_id
      this.sub_nav = []
      this.nav.forEach(item => {
        if (item.id === value) {
          if (item.subcategories) {
            this.sub_nav = item.subcategories
            return false
          }
        }
      })
    },
    geCategory (params) {
      this.http.userCategory(params).then(res => {
        if (res.status === 0) {
          if (res.data.category_info) {
            this.nav = res.data.category_info
          } else {
            this.nav = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    changeFileStatus1 () {
      this.form.status = -1
      this.active1 = true
      this.active2 = false
      this.form.start = 0
      this.checkoutData()
    },
    changeFileStatus2 () {
      this.form.status = 0
      this.active1 = false
      this.active2 = true
      this.form.start = 0
      this.checkoutData()
    },
    getArticlesListData (params) {
      this.http
        .reviewArticlesList(params)
        .then(res => {
          this.form = this.oldform
          if (res.status === 0) {
            this.total = res.data.articles_num
            if (res.data.review_articles && res.data.review_articles.length > 0) {
              res.data.review_articles.forEach(item => {
                item.updated_at = this.getTime(item.updated_at)
                if (item.review_at > 0) {
                  item.review_at = this.getTime(item.review_at)
                } else {
                  item.review_at = ''
                }
              })
              this.tableData = res.data.review_articles
            } else {
              this.tableData = []
            }
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    },
    getUnreadNumber (params) {
      this.http
        .getModerUnreadCount(params)
        .then(res => {
          if (res.status === 0) {
            this.toExamineNumber = res.data.count_info.unreviewed_count
            this.allExamineNumber = res.data.count_info.total_count
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    },
    setRules (id) {
      this.setRulesShow = true
      this.article_id = id
      this.getConfigsData({article_id: id})
    },
    getConfigsData (id) {
      this.http.getCoinConfigurations(id).then(res => {
        if (res.status === 0) {
          if (res.data.score_coin_configs) {
            this.articleConfigs = res.data.score_coin_configs
          } else {
            this.articleConfigs = []
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
      this.form.start = 0
      this.form.size = this.size
      this.checkoutData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.form.start = (Number(val) - 1) * this.size
      this.checkoutData()
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
  .examine-tab {
    background: #ffffff;
    padding: 20px 0;
    position: relative;
  }
  .examine-tab .tab-nav-ul {
    background: #ffffff;
    position: relative;
    border-bottom: 2px solid #e4e7ed;
  }
  .examine-tab .tab-nav-li {
    float: left;
    margin-right: 40px;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    font-size: 16px;
    color: #9fadc2;
    position: relative;
  }
  .examine-tab .tab-nav-li:before {
    content: "";
    width: 100%;
    position: absolute;
    bottom: -2px;
    left: 0;
    height: 2px;
    background-color: #598cf2;
    z-index: 1;
    -webkit-transition: -webkit-transform 0.3s
    cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: -webkit-transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    -webkit-transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    -webkit-transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    list-style: none;
    display: none;
  }
  .examine-tab .tab-nav-li.active {
    color: #598cf2;
  }
  .examine-tab .tab-nav-li.active:before {
    display: block;
  }
  .examine-tab .tab-nav-li span {
    cursor: pointer;
  }
  .is-top-sign{
    background: #2f9b50;
    display: inline-block;
    padding: 0px 10px;
    color: #ffffff;
    border-radius: 23px;
    margin-right: 5px;
    min-width: 60px;
    text-align: center;
    background: -webkit-linear-gradient(0deg, #049384,#92E1BE);
    background: -o-linear-gradient(0deg, #049384, #92E1BE);
    background: -moz-linear-gradient(0deg, #049384, #92E1BE);
    background: linear-gradient(0deg, #049384, #92E1BE);
  }
  @media only screen and (max-width: 1200px) {
  }
  @media only screen and (min-width: 768px) {
    .padding-40{
      padding-right: 45px!important;
    }
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
