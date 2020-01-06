<template>
  <div>
    <div class="right-jubao-box">
      <h2>举报</h2>
      <div class="examine-tab">
        <div class="examine-box">
          <el-form ref="ruleForm" :label-position="labelPosition" :model="form" label-width="70px" class="search-form">
            <el-row :gutter="10">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="padding-40">
                <el-form-item label="举报文章" align="left" prop="title">
                  <el-input v-model="form.title"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="padding-40">
                <el-form-item label="举报编号" align="left" prop="report_id">
                  <el-input v-model="form.report_id"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="padding-40">
                <el-form-item label="状态" align="left" prop="status">
                  <el-select v-model="form.status" placeholder="请选择状态">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="padding-40">
                <el-form-item label="举报日期">
                  <el-col :span="11" style="padding: 0!important">
                    <el-form-item label-width="0" prop="start_time">
                      <el-date-picker v-model="form.start_time" type="date" placeholder="开始时间"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col class="line text-center" :span="2">-</el-col>
                  <el-col :span="11" style="padding: 0!important">
                    <el-form-item label-width="0" prop="end_time">
                      <el-date-picker v-model="form.end_time" type="date" placeholder="结束时间"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label-width="50" style="margin-bottom: 0px">
                  <el-button type="primary" @click="onSubmit">搜索</el-button>
                  <el-button type="warning" @click="clearSubmit('ruleForm')">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
    <div class="jubao-box mt-15">
      <div>
        <el-button type="primary" @click="lotAccept">批量受理</el-button>
        <el-button type="warning" @click="lothandle">批量处理</el-button>
      </div>
      <div class="mt-25">
        <el-collapse  v-model="activeNames" v-for="(item, index) in collapseList" :key="index">
          <el-collapse-item :name="index">
            <template slot="title">
              <div class="pl-20 text-overflow-1" style="max-width: 90%;">
                <el-checkbox  :checked="item.checkAll" :value="item.checkAll"  @change="handleCheckAllChange(item,$event)"></el-checkbox>
                <span class="ml-15 jubao-first">被举报文章:</span><span class="passage_title" @click="open(item.report_list[0].article_id)" :title="`${item.report_list[0].title}`">《{{ item.report_list[0].title }}》</span>
              </div>
            </template>
            <el-row :gutter="10" v-for="(item1, index1) in item.report_list" :key="index1">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <div class="pl-20 jubao-title">
                    <el-checkbox  :checked="item1.checkedCities" :value="item1.checkedCities" @change="handleCheckedCitiesChange(item1,$event)"><span class="jubao-title-span">{{item1.type}}</span></el-checkbox>
                  <span class="passage_status ml-15">{{item1.status === 1 ? "待受理" : item1.status === 2 ? "处理中" : item1.status === 3 ? "处理完毕,有效举报" : item1.status === 4 ? "处理完毕,无效举报" : ""}}</span>
                </div>
                <div class="jubao-content">
                  <p>举报编号：{{ item1.report_number }}</p>
                  <p>举报时间：{{ item1.report_time }}</p>
                  <p>举报人：<span class="jubao_people">{{item1.account_name}}</span></p>
                </div>
                <div class="jubao-info">{{ item1.note }}</div>
                <div class="mt-20  mr-15 float-right jubao-operate">
                  <el-button v-if="item1.status === 1" round @click="accept(item1.report_id)">受理</el-button>
                  <el-button v-if="item1.status === 2" round @click="handle(item1.report_id)">处理</el-button>
                  <el-button v-if="item1.status === 2 || item1.status === 3 || item1.status === 4" round @click="checkRecordDialog(item1.report_id)">处理记录</el-button>
                </div>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <div class="no-passage" v-if="!collapseList.length"><p class="text-999 fs-14 text-center">亲，举报列表空空的哦！</p></div>
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
    <!--el-dialog-->
    <el-dialog class="review_dialog" :title="`处理(共${handleNumber}条举报)`" :visible.sync="handleVisible" @close="handlereview('checkForm')">
      <el-form ref="checkForm" :rules="checkFormRules" :model="checkForm" label-width="110px">
        <el-form-item label="处理结果" prop="handler_type">
          <el-radio-group v-model="checkForm.handler_type">
            <el-radio :label="item.value" v-for="(item, index) in typeList" :key="index">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input type="textarea" v-model="checkForm.note" placeholder="建议输入处理依据(选填项)" maxlength="100" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary review_save" @click="checkSubmit('checkForm')">保存</el-button>
      </span>
    </el-dialog>
    <!--el-dialog-->
    <!--el-dialog-->
    <el-dialog class="comment_delete" align="center" :visible.sync="acceptVisible">
      <h4 class="fs-18">受理（共{{acceptNumber}}条举报）</h4>
      <p>受理后，请核实举报内容，确定受理吗？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="acceptVisible = false;" class="el-button--text">关闭</el-button>
        <el-button @click="acceptSure(1, arrReportIds)" class="el-button--text">确 定</el-button>
      </span>
    </el-dialog>
    <!--el-dialog-->
    <!--el-dialog-->
    <el-dialog title="处理记录" :visible.sync="dialogRecordVisible" class="box-shadow dialog-record">
      <div class="dialog-body">
        <el-table border :data="gridData" style="width: 100%">
          <el-table-column prop="time" label="操作时间" width="104" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.time }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作人" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="操作类型" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.type }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="result" label="操作结果" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.result }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="note" label="备注" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.note }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="box-pagination">
          <el-pagination
            background
            @size-change="gridHandleSizeChange"
            @current-change="gridHandleCurrentChange"
            :current-page="gridCurrentPage"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="gridSize"
            :total="gridTotal"
            layout="total, sizes, prev, pager, next, jumper"
          >
          </el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer clearfix">
        <!--<el-button @click="dialogRecordVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="dialogRecordVisible = false">确 认</el-button>-->
      </div>
    </el-dialog>
    <!--el-dialog-->
  </div>
</template>

<script>
export default {
  name: 'moderAricle',
  components: {},
  data () {
    return {
      path: '#/article/info?article_id=',
      activeNames: [],
      dialogRecordVisible: false,
      labelPosition: 'right',
      options: [
        {value: 0, label: '全部'},
        {value: 1, label: '待受理'},
        {value: 2, label: '处理中'},
        {value: 3, label: '处理完毕,有效举报'},
        {value: 4, label: '处理完毕,无效举报'}
      ],
      oldform: {},
      form: {
      },
      checkFormRules: {
        handler_type: [{ required: true, message: '请选择可点击', trigger: 'change' }]
      },
      typeList: [
        { label: '有效举报', value: 2 },
        { label: '无效举报', value: 3 }
      ],
      collapseList: [],
      report_ids: [],
      arrReportIds: [],
      acceptVisible: false,
      handleVisible: false,
      acceptNumber: 0,
      handleNumber: 0,
      checkRecordId: null,
      gridData: [],
      checkForm: {},
      // 全选
      checkAll: false,
      resflag: false,
      checkedCities: [],
      // 页码
      total: 0,
      size: 10,
      currentPage: 1,
      gridTotal: 0,
      gridSize: 10,
      gridCurrentPage: 1
    }
  },
  inject: ['reload'],
  computed: {},
  created () {},
  mounted () {
    if (this.$route.query.report_id) {
      this.getReportsListData({report_id: this.$route.query.report_id})
    } else {
      this.getReportsListData()
    }
  },
  methods: {
    onSubmit () {
      this.checkoutData()
      let arr = []
      this.collapseList.forEach(function (item, index) {
        arr.push(index)
      })
      this.activeNames = arr
    },
    handlereview (formName) {
      this.$refs[formName].resetFields()
    },
    clearSubmit (formName) {
      this.$refs[formName].resetFields()
      this.getReportsListData({}, 'clear')
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
          this.$message.error('结束日期不能小于开始日期')
          this.form = this.oldform
          return false
        } else if (this.form.start_time === this.form.end_time) {
          this.form.end_time = this.form.end_time + 24 * 60 * 1000
        }
      }
      if (this.form.status === null) {
        delete this.form.parent_id
      }
      this.getReportsListData(this.form, 'clear')
    },
    getReportsListData (params, type) {
      this.http.getReportsList(params).then(res => {
        this.form = this.oldform
        if (this.$route.query.report_id) {
          if (!type) {
            this.form.report_id = this.$route.query.report_id
          }
        }
        if (res.status === 0) {
          this.total = res.data.total_number
          if (res.data.article_list) {
            res.data.article_list.forEach((item, index) => {
              this.activeNames.push(index)
              item.checkAll = false
              item.checkedElement = []
              if (item.report_list) {
                item.report_list.forEach(item1 => {
                  item1.report_time = this.getTime(item1.report_time)
                  item1.checkedCities = false
                })
              }
            })
            this.collapseList = res.data.article_list
          } else {
            this.collapseList = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    checkSubmit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.handleSure(this.checkForm)
        } else {
          return false
        }
      })
    },
    accept (params) {
      this.acceptVisible = true
      this.arrReportIds = []
      this.arrReportIds = [params]
      this.acceptNumber = [params].length
    },
    handle (params) {
      this.handleVisible = true
      this.checkForm.report_ids = []
      this.checkForm.report_ids = [params]
      this.handleNumber = [params].length
    },
    lotAccept () {
      this.arrReportIds = []
      this.collapseList.forEach(item => {
        item.report_list.forEach(item2 => {
          if (item2.status === 1) {
            item.checkedElement.forEach(item1 => {
              if (item1 === item2.report_id) {
                this.arrReportIds.push(item1)
              }
            })
          }
        })
      })
      this.acceptNumber = this.arrReportIds.length
      if (this.acceptNumber) {
        this.acceptVisible = true
      } else {
        this.$toast('请选择你要受理的文章', 2000, 'error')
      }
    },
    lothandle () {
      this.checkForm.report_ids = []
      this.collapseList.forEach(item => {
        item.report_list.forEach(item2 => {
          if (item2.status === 2) {
            item.checkedElement.forEach(item1 => {
              if (item1 === item2.report_id) {
                this.checkForm.report_ids.push(item1)
              }
            })
          }
        })
      })
      this.handleNumber = this.checkForm.report_ids.length
      if (this.handleNumber) {
        this.handleVisible = true
      } else {
        this.$toast('请选择你要处理的文章', 2000, 'error')
      }
    },
    acceptSure (type, id) {
      this.http.manageReports({ handler_type: type, report_ids: id }).then(res => {
        if (res.status === 0) {
          this.$toast('已成功受理', 2000, 'success')
          this.acceptVisible = false
          this.getReportsListData(this.form)
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    handleSure (params) {
      this.http.manageReports(params).then(res => {
        if (res.status === 0) {
          this.$toast('已成功处理', 2000, 'success')
          this.handleVisible = false
          this.getReportsListData(this.form)
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    checkRecordDialog (id) {
      this.checkRecordId = id
      this.dialogRecordVisible = true
      this.checkRecord(this.checkRecordId, {size: 10, start: 0})
    },
    checkRecord (id, params) {
      this.http.manageReportsRecord(id, params).then(res => {
        if (res.status === 0) {
          this.gridTotal = res.data.total_number
          if (res.data.report_operation_list) {
            this.gridData = res.data.report_operation_list
            res.data.report_operation_list.forEach(item => {
              item.time = this.getTime(item.time)
            })
          } else {
            this.gridData = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    open (item) {
      window.open(this.path + item, '_blank')
    },
    handleCheckAllChange (item) {
      for (let i = 0; i < this.collapseList.length; i++) {
        if (item.article_id === this.collapseList[i].article_id) {
          this.collapseList[i].checkAll = !this.collapseList[i].checkAll
          if (this.collapseList[i].checkAll) {
            this.collapseList[i].checkedElement = this.collapseList[i].report_list.map(c => c.report_id)
            this.collapseList[i].report_list.forEach(item1 => {
              item1.checkedCities = true
            })
          } else {
            this.collapseList[i].checkedElement = []
            this.collapseList[i].report_list.forEach(item1 => {
              item1.checkedCities = false
            })
          }
          break
        }
      }
    },
    handleCheckedCitiesChange (item) {
      for (let i = 0; i < this.collapseList.length; i++) {
        if (item.article_id === this.collapseList[i].article_id) {
          for (let j = 0; j < this.collapseList[i].report_list.length; j++) {
            if (item.report_id === this.collapseList[i].report_list[j].report_id) {
              this.collapseList[i].report_list[j].checkedCities = !this.collapseList[i].report_list[j].checkedCities
              if (this.collapseList[i].report_list[j].checkedCities) {
                this.collapseList[i].checkedElement.push(item.report_id)
              } else {
                this.collapseList[i].checkedElement.splice(this.collapseList[i].checkedElement.indexOf(item.report_id), 1)
              }
              if (this.collapseList[i].report_list.length === this.collapseList[i].checkedElement.length) {
                this.collapseList[i].checkAll = true
              } else {
                this.collapseList[i].checkAll = false
              }
              break
            }
          }
          break
        }
      }
    },
    handleSizeChange (val) {
      this.size = val
      this.currentPage = 1
      this.form.status = 0
      this.form.size = this.size
      this.getReportsListData(this.form)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.form.size = this.size
      this.form.start = (Number(val) - 1) * this.size
      this.getReportsListData(this.form)
    },
    gridHandleSizeChange (val) {
      this.gridSize = val
      this.gridCurrentPage = 1
      this.form.size = this.gridSize
      this.checkRecord(this.checkRecordId, {size: this.form.size})
    },
    gridHandleCurrentChange (val) {
      this.gridCurrentPage = val
      this.form.size = this.gridSize
      this.form.start = (Number(val) - 1) * this.gridSize
      this.checkRecord(this.checkRecordId, {start: (Number(val) - 1) * this.gridSize, size: this.gridSize})
    }
  }
}
</script>

<style scoped>
.review_save {
  background-color: #409eff;
  padding: 10px 40px;
}
.right-jubao-box {
  background-color: #ffffff;
  padding: 30px 30px 0px;
  border-radius: 5px;
}
.right-jubao-box h2 {
  font-size: 20px;
  margin: 0;
}
.right-jubao-box .examine-box {
  padding: 25px 0;
}
.right-jubao-box .examine-tab {
  background: #ffffff;
  position: relative;
}
.jubao-box {
  background-color: #fff;
  padding: 20px;
}
@media only screen and (min-width: 768px) {
  .padding-40 {
    padding-right: 45px !important;
  }
}
</style>
<style>
.search-form .el-date-editor.el-input,
.search-form .el-date-editor.el-input__inner {
  width: 100%;
}
.search-form .el-select {
  width: 100%;
}
.jubao-box .el-collapse-item__header {
  background-color: rgba(234, 241, 254, 1);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.jubao-box .el-collapse {
  border-top: none;
  border-bottom: none;
}
.jubao-box .el-collapse-item {
  margin: 10px 0px;
}
.jubao-box .el-collapse-item__wrap {
  border-left: 1px solid rgba(222, 232, 252, 1);
  border-right: 1px solid rgba(222, 232, 252, 1);
}
.jubao-box  .el-collapse-item__arrow{
  margin: 0 12px 0 auto;
}
.jubao-box .el-icon-arrow-right:before{
  display: inline-block;
  content: "";
  width: 15px;
  height: 8px;
  margin-bottom: 2px;
  background: url("../../assets/icon/icon-collapse-down.png") no-repeat 0 0;
}
.jubao-box .el-collapse-item__arrow.is-active{
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}
.jubao-box .passage_title {
  color: #409eff;
  font-size: 16px;
}
.jubao-box .passage_status {
  padding: 1px 3px;
  color: red;
  border-radius: 2px;
  border: 1px solid red;
}
.jubao-box .jubao-content {
  display: flex;
  justify-content: space-between;
  padding: 0px 45px;
}
.jubao-box .jubao-info {
  padding: 0px 45px;
}
.jubao-box .jubao-title {
  margin: 12px 0px 7px;
}
.jubao-box .jubao-title .el-checkbox-group {
  display: inline-block;
}
.jubao-box .jubao-title .jubao-title-span {
  font-size: 16px;
}
.jubao-box .jubao_people {
  color: #409eff;
}
.jubao-box .jubao-info {
  color: #999999;
}
.jubao-box .jubao-operate .el-button {
  padding: 7px 20px;
  border: 1px solid #409eff;
  color: #409eff;
}
.jubao-box .el-row {
  border-bottom: 1px solid rgba(222, 232, 252, 1);
  padding-bottom: 20px;
}
.jubao-box .el-collapse-item__content {
  padding-bottom: 0px;
}
.jubao-box .box-pagination {
  margin: 20px 0px 0px;
}
.review_dialog .el-dialog {
  max-width: 480px;
}
.review_dialog .el-dialog__header {
  background: #409eff;
  padding: 15px 20px;
}
.review_dialog .el-dialog__title {
  font-size: 16px;
  color: #ffffff;
}
.review_dialog .el-dialog__headerbtn .el-dialog__close {
  color: #fff;
}
.review_dialog .el-dialog__footer {
  text-align: center;
}
.review_dialog .el-dialog__body {
  padding: 15px 20px 0 20px;
}
.review_dialog .el-textarea {
  width: 80%;
}
.review_dialog .el-textarea .el-textarea__inner {
  min-height: 80px !important;
}
.comment_delete .el-dialog {
  max-width: 480px;
  border-radius: 4px;
}
.comment_delete .el-dialog__footer {
  height: 40px;
  background: #ffffff;
  padding: 0;
}
.comment_delete .el-dialog__footer .el-button {
  width: 50%;
  border: none;
  float: left;
  border-left: 1px solid #e5e5e5;
  border-radius: 0;
  position: relative;
}
.comment_delete .el-button + .el-button {
  margin-left: 0;
}
.comment_delete .el-dialog__body {
  border-bottom: 1px solid #e5e5e5;
  font-size: 16px;
}
.dialog-record .el-dialog {
  max-width: 1000px;
}
.dialog-record .el-dialog__body {
  padding-bottom: 0;
}
.dialog-record .el-dialog__header {
  background: #409eff;
  padding: 15px 20px;
}
.dialog-record .el-dialog__title {
  font-size: 16px;
  color: #ffffff;
}
.dialog-record .el-dialog__headerbtn .el-dialog__close {
  color: #ffffff;
}
.dialog-record .el-dialog table th {
  background-color: #eaf1fe;
  color: #9fadc2;
  border: none 0;
}
</style>
