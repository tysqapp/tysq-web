<template>
  <div class="container main-container">
    <div class="view welcome-view">
      <div class="welcome-context">
        <div class="invite-box">
          <div class="invite-info-box">
            <div class="type-title clearfix gold"><h2 class="pull-left title">金币概况</h2> </div>
            <div class="gold-coin-box clearfix">
              <div class="pull-left coin-number-box">
                <p class="coin-title">当前总金币:</p>
                <span class="coin-number">{{total_number}}</span>
                <span class="fs-16 mr-15 text-666">={{realVal}}元</span>
              </div>
              <div class="pull-left exchange-btn">
                <el-button @click="coinApply">金币提现</el-button>
                <a target="_blank" class="ml-10" :href="buy_coin"><el-button>购   买</el-button></a>
              </div>
              <a class="coin-notes" target="_blank" :href="explain_guide">金币说明</a>
            </div>
            <div class="type-title clearfix gold"><h2 class="pull-left title">提现记录</h2></div>
            <div class="gold-invite-table">
              <el-table
                :data="tableData1"
                border
                style="width: 100%">
                <el-table-column
                  prop="created_at"
                  label="时间"
                  align="center"
                  width="">
                  <template slot-scope="scope">
                    <span>{{scope.row.created_at}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="id"
                  label="流水号"
                  align="center"
                  width="">
                </el-table-column>
                <el-table-column
                  prop="coin_amount"
                  label="提现金币数量"
                  align="center"
                  width="">
                  <template slot-scope="scope">
                    <span>{{scope.row.coin_amount}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="btc_amount"
                  label="到账BTC数量"
                  align="center"
                  width="">
                  <template slot-scope="scope">
                    <span>{{scope.row.btc_amount}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="地址"
                  align="center"
                  width="260">
                  <template slot-scope="scope">
                    <span>{{scope.row.address}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="note"
                  label="备注"
                  align="center"
                  width="">
                  <template slot-scope="scope">
                    <span>{{scope.row.note}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="status"
                  label="状态"
                  align="center"
                  width="">
                  <template slot-scope="scope">
                    <span :class="[scope.row.status== 2?'text-gold':'']">
                    {{scope.row.status===1?'审核中':scope.row.status===2?'审核驳回':scope.row.status===3?'审核中':scope.row.status===4?'审核驳回':scope.row.status===5?'审核通过，待转账':scope.row.status===6?'审核通过，已转账':''}}
                      <i v-if="scope.row.status===2 && scope.row.reason" class="el-icon-question button-help" @click="getReason(scope.row.reason)"></i>
                  </span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="box-pagination" v-if="total2>10">
                <el-pagination
                  background
                  @size-change="handleSizeChangeRecord"
                  @current-change="handleCurrentChangeRecord"
                  :current-page="currentPage2"
                  :page-sizes="[5, 10, 20, 30]"
                  :page-size="size2"
                  :total="total2"
                  layout="total, sizes, prev, pager, next, jumper"
                >
                </el-pagination>
              </div>
            </div>
            <div class="type-title clearfix gold">
              <h2 class="pull-left title">购买记录
                <i class="icon-question pt-10">
                  <div class="hover-box">
                    <p>1、订单只有两种状态："待支付”和“已支付"。</p>
                    <p>2、下单后（或支付后）,订单状态显示"待支付",待商家确认收到支付金额后,才会变为"已支付"。</p>
                    <p>3、状态变为"已支付",其购买的金币才会显示在金币明细,且添加到金币账户余额。</p>
                    <p>注：为方便商家尽快确认收款信息,支付后请点击"已支付"按钮。</p>
                  </div>
                </i>
              </h2>
            </div>
            <div class="gold-invite-table">
              <el-form ref="ruleForm" :label-position="labelPosition" :model="form" label-width="80px">
                <el-form-item label="订单状态:" prop="status" class="pull-right">
                  <el-select v-model="form.status" placeholder="状态类型" @change="choiceStatus" clearable>
                    <el-option :label="item.label" :value="item.value" v-for="(item,index) in statusType" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <el-table
                :data="tableOrder"
                border
                style="width: 100%">
                <el-table-column
                  prop="created_at"
                  label="时间"
                  align="center"
                  width="">
                </el-table-column>
                <el-table-column
                  prop="order_id"
                  label="订单号"
                  align="center"
                  width="">
                </el-table-column>
                <el-table-column
                  prop="coin_amount"
                  label="购买金币数"
                  align="center"
                  width="">
                </el-table-column>
                <el-table-column
                  prop="price"
                  label="订单金额(CNY)"
                  align="center"
                  width="">
                </el-table-column>
                <el-table-column
                  label="订单状态"
                  align="center"
                  width="">
                  <template slot-scope="scope">
                    <span>{{scope.row.status===0?'待支付':scope.row.status===1?'已支付':''}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="box-pagination" v-if="totalOrder>10">
                <el-pagination
                  background
                  @size-change="handleSizeOrder"
                  @current-change="handleCurrentOrder"
                  :current-page="currentPageOrder"
                  :page-sizes="[5, 10, 20, 30]"
                  :page-size="sizeOrder"
                  :total="totalOrder"
                  layout="total, sizes, prev, pager, next, jumper"
                >
                </el-pagination>
              </div>
            </div>
            <div class="type-title clearfix gold"><h2 class="pull-left title">金币明细</h2></div>
            <div class="gold-invite-table">
              <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                  prop="time"
                  label="时间"
                  align="center"
                  width="">
                </el-table-column>
                <el-table-column
                  prop="action"
                  label="摘要"
                  align="center"
                  width="">
                </el-table-column>
                <el-table-column
                  prop="change_number"
                  label="金币数"
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
        <!--el-dialog-->
        <el-dialog
          title=""
          :visible.sync="dialogRejectVisible" align="center" class="reject-dialog">
          <div class="dialog-body">
            <div>
              <i class="el-icon-remove text-danger" style="font-size: 60px; margin-bottom: 20px"></i>
              <p class="fs-24">驳回原因:{{reason?reason:''}}</p>
            </div>
          </div>
        </el-dialog>
        <!--el-dialog-->
        <!--dialog-->
        <el-dialog title="" align="center" :visible.sync="dialogEmailVisible" class="box-shadow yz-email">
          <div class="dialog-body">
            <p class="text-center" style="line-height: 30px">
              <span class="fs-16">要先验证邮箱，才能提现哦！</span>
            </p>
          </div>
          <div slot="footer" class="dialog-footer clearfix">
            <el-button type="text" @click="dialogEmailVisible = false">取 消</el-button>
            <el-button type="text" @click="sureYz">去验证邮箱</el-button>
          </div>
        </el-dialog>
        <!--dialog-->
        <!--el-dialog-->
        <el-dialog title="提币" :visible.sync="dialogVisible" :close-on-click-modal="false" class="withdrawal-dialog">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  label-width="90px" class="demo-ruleForm">
            <el-form-item label="提现至" prop="">
              <span class="fs-18">BTC账户</span>
            </el-form-item>
            <el-form-item label="账户地址" prop="withdraw_url">
              <el-input v-model="ruleForm.withdraw_url"></el-input>
            </el-form-item>
            <el-form-item label="提币数量" prop="coin_amount">
              <el-input  v-model="ruleForm.coin_amount" placeholder="请输入提币数" @blur="InputNumber">
                <span slot="suffix" class="sendMessage" @click="submitAll">全部</span>
              </el-input>
              <div class="max-mout pt-10">
                <p class="tmount" v-if="ruleForm.coin_amount"> ≈{{amountInfo.amount}}BTC</p>
                <p class="tmount"><span >最大可提数量:</span> <span>{{total_number}}金币</span></p>
              </div>
            </el-form-item>
            <el-form-item label="验证码" prop="captcha">
              <el-input  placeholder="请输入邮箱验证码" v-model="ruleForm.captcha" :maxlength="6">
                <span slot="suffix" class="sendMessage" @click="sendMessage" v-if="flag">发送验证码</span>
                <span slot="suffix" class="sendtime" v-if="!flag">{{seconds}}s后重新发送</span>
              </el-input>
            </el-form-item>
            <el-form-item label="备注" prop="note" :maxlength="255">
              <el-input v-model="ruleForm.note"></el-input>
            </el-form-item>
            <el-form-item label="网络手续费" class="mb-0" v-if="ruleForm.coin_amount">
              <span>{{amountInfo.min_fee}}BTC</span>
            </el-form-item>
            <el-form-item label="到账数量" class="mb-0" v-if="ruleForm.coin_amount">
              <span>{{amountInfo.income_amount>=0?amountInfo.income_amount:0}}BTC</span>
            </el-form-item>
            <el-form-item label="注:" class="mb-0 notice">
              <p class="tmount">（1）汇率是一个波动的值，按提交申请时的汇率计算 </p>
              <p class="tmount">（2）网络手续费费率为0.5%，低于0.001BTC，则按0.001BTC收取</p>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" class="loginButton" @click="submitForm('ruleForm')" :disabled="!ruleForm.withdraw_url || !ruleForm.coin_amount || !ruleForm.captcha">提交</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!--el-dialog-->
        <!--el-dialog-->
        <el-dialog
          title="确认提现"
          :visible.sync="dialogSuretVisible" :close-on-click-modal="false" :before-close="handleClose" class="sure-dialog">
          <el-form :model="sureForm" ref="sureForm"  label-width="90px" class="sure-ruleForm">
            <el-form-item label="提现数量">
              <span>{{ruleForm.coin_amount}}</span>(≈{{sureForm.amount}}BTC)
            </el-form-item>
            <el-form-item label="网络手续费">
              <span>{{sureForm.min_fee}}BTC</span>
            </el-form-item>
            <el-form-item label="到账数量">
              <span>{{sureForm.income_amount}}BTC</span>
            </el-form-item>
          </el-form>
          <el-button type="primary" class="loginButton" @click="sure">确定提交</el-button>
        </el-dialog>
        <!--el-dialog-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    const validateMinamount = (rule, value, callback) => {
      if (value) {
        if (Number(value) <= 0) {
          callback(new Error('提币数量必须大于0'))
        } else if (Number(value) > Number(this.total_number)) {
          callback(new Error('提币数量不能大于提现额度' + this.total_number))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入提币数量'))
      }
    }
    return {
      rules: {
        withdraw_url: [
          { required: true, message: '请填写提币地址', trigger: 'blur' }
        ],
        coin_amount: [
          { required: true, validator: validateMinamount, trigger: 'change' }
        ],
        captcha: [
          {required: true, message: '请输入验证码', trigger: 'blur'}
        ]

      },
      ruleForm: {
        email: '',
        withdraw_url: '',
        coin_amount: '',
        captcha: '',
        captcha_id: '',
        note: ''
      },
      flag: true,
      minutes: 0,
      seconds: 60,
      amountInfo: {},
      buy_coin: '',
      explain_guide: '',
      sureForm: {},
      total_number: 0,
      realVal: 0,
      tableData: [],
      tableData1: [
        {time: ''}
      ],
      tableOrder: [],
      labelPosition: 'right',
      form: {},
      statusType: [
        {label: '全部', value: 0},
        {label: '待支付', value: 1},
        {label: '已支付', value: 2}
      ],
      reason: '',
      dialogEmailVisible: false,
      dialogRejectVisible: false,
      dialogVisible: false,
      dialogSuretVisible: false,
      currentPage: 1,
      total: 0,
      size: 10,
      currentPage2: 1,
      total2: 0,
      size2: 10,
      currentPageOrder: 1,
      totalOrder: 0,
      sizeOrder: 10
    }
  },
  inject: ['reload'],
  computed: {
  },
  mounted () {
    this.buy_coin = this.http.buyCoinLink
    this.explain_guide = this.http.explainGuideLink(2)
    this.getCoin({size: 10})
    if (this.Cookies.get('info')) {
      this.account_info = JSON.parse(this.Cookies.get('info'))
      this.ruleForm.email = this.account_info.email
    }
    this.getCoinList({size2: 10})
    this.getOrder({size: 10})
  },
  methods: {
    getCoin (params) {
      this.http.getCoinDetailed(params).then(res => {
        if (res.status === 0) {
          this.total_number = res.data.total_number
          this.realVal = parseFloat(res.data.total_number / 1000).toFixed(2)
          this.total = res.data.details_count
          if (res.data.details_info && res.data.details_info.length > 0) {
            res.data.details_info.forEach(item => {
              item.time = this.getTime(item.time)
              item.change_number = item.change_number > 0 ? '+' + item.change_number : item.change_number
            })
            this.tableData = res.data.details_info
          } else {
            this.tableData = []
          }
        } else {
          this.message.error('错误码' + res.status + ':' + res.reason)
        }
      })
    },
    coinApply () {
      if (Number(this.$route.query.id) === 1) {
        this.dialogVisible = true
        // this.getBtc({coin_amount: this.total_number})
      } else {
        this.dialogEmailVisible = true
      }
    },
    sureYz () {
      this.dialogEmailVisible = false
      this.$router.push({path: '/userSet'})
    },
    getBtc (params) {
      this.http.getBtc(params).then(res => {
        if (res.status === 0) {
          this.amountInfo = res.data
          this.amountInfo.min_fee = res.data.min_fee // 最小网络手续费
          this.amountInfo.income_amount = res.data.income_amount // 到账BTC数
          this.amountInfo.amount = res.data.withdraw_amount // 金币对应BTC总数量
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    updateGetBtc (params) {
      this.http.getBtc(params).then(res => {
        if (res.status === 0) {
          this.sureForm = res.data
          this.sureForm.income_amount = res.data.income_amount // 到账BTC数
          this.sureForm.amount = res.data.withdraw_amount // 金币对应BTC总数量
          if (this.sureForm.income_amount !== this.amountInfo.income_amount) {
            this.$toast('当前汇率已发生变化', 2000, 'warning')
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    InputNumber () {
      if (this.ruleForm.coin_amount) {
        this.getBtc({coin_amount: this.ruleForm.coin_amount})
      } else {
      }
    },
    submitAll () {
      if (this.total_number > 0) {
        this.ruleForm.coin_amount = this.total_number
        this.InputNumber()
      } else {
        this.$toast('您的可提现额度不足', 2000, 'error')
      }
    },
    sure () {
      this.ruleForm.coin_amount = Number(this.ruleForm.coin_amount)
      this.tbApply(this.ruleForm)
    },
    handleClose (done) {
      done()
      this.reload()
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.amountInfo.income_amount > 0) {
            this.updateGetBtc({coin_amount: this.ruleForm.coin_amount})
            this.dialogVisible = false
            this.dialogSuretVisible = true
          } else {
            this.$toast('到账数量需要大于0', 2000, 'error')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    tbApply (params) {
      this.http.postWithdraw(params).then(res => {
        if (res.status === 0) {
          this.$toast('提币申请已提交', 2000, 'success')
          this.dialogVisible = false
          this.reload()
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          this.dialogSuretVisible = false
          this.dialogVisible = true
          this.InputNumber()
        }
      })
    },
    getReason (reason) {
      this.dialogRejectVisible = true
      this.reason = reason
    },
    sendMessage () {
      // 邮箱验证码
      if (this.ruleForm.email && this.Email(this.ruleForm.email)) {
        this.timer()
        this.http
          .getCaptcha({email: this.ruleForm.email, type: 'drawCurrency'})
          .then(res => {
            if (res.status === 0) {
              this.$toast('验证码已发送邮箱', 2000, 'success')
              this.ruleForm.captcha_id = res.data.captcha_id
            } else {
              this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
            }
          })
      } else {
        this.$toast('请输入正确的邮箱', 2000, 'error')
      }
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
    getCoinList (params) {
      this.http.gettWithdrawList(params).then(res => {
        if (res.status === 0) {
          this.total2 = res.data.total_num
          if (res.data.withdraw_review_list && res.data.withdraw_review_list.length > 0) {
            res.data.withdraw_review_list.forEach(item => {
              item.created_at = this.getTime(item.created_at)
            })
            this.tableData1 = res.data.withdraw_review_list
          } else {
            this.tableData1 = []
          }
        } else {
          this.message.error('错误码' + res.status + ':' + res.reason)
        }
      })
    },
    getOrder (params) {
      this.http.coinOrder(params).then(res => {
        if (res.status === 0) {
          this.totalOrder = res.data.total
          if (res.data.coin_orders) {
            res.data.coin_orders.forEach(item => {
              item.created_at = this.getTime(item.created_at)
            })
            this.tableOrder = res.data.coin_orders
          } else {
            this.tableOrder = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    choiceStatus () {
      this.currentPageOrder = 1
      if (this.form.status === '') {
        this.getOrder({status: 0})
      } else {
        this.getOrder({status: this.form.status})
      }
    },
    // 页码
    handleSizeOrder (val) {
      this.sizeOrder = val
      this.currentPageOrder = 1
      this.form.size = val
      if (this.form.status) {
        this.getOrder({size: val, status: this.form.status})
      } else {
        this.getOrder({size: val})
      }
    },
    handleCurrentOrder (val) {
      this.currentPageOrder = val
      this.form.start = (Number(val) - 1) * this.sizeOrder
      if (this.form.status === null) {
        delete this.form.status
        this.getOrder(this.form)
      } else {
        this.getOrder(this.form)
      }
    },
    handleSizeChange (val) {
      this.size = val
      this.currentPage = 1
      this.getCoin({size: this.size})
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getCoin({size: this.size, start: (Number(val) - 1) * this.size})
      console.log(`当前页: ${val}`)
    },
    handleSizeChangeRecord (val) {
      this.size2 = val
      this.currentPage2 = 1
      this.getCoinList({size: this.size2})
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChangeRecord (val) {
      this.currentPage2 = val
      this.getCoinList({size: this.size2, start: (Number(val) - 1) * this.size2})
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style scoped>
  .main-container>.view{
    width: 100%;
  }
  .icon-question{
    display: inline-block;
    background: url("../../assets/help.png") no-repeat;
    width:18px;
    height: 18px;
    background-size: 100% 100%;
    position: relative;
    cursor: pointer;
  }
  .icon-question:hover{
    display: inline-block;
    background: url("../../assets/help_hover.png") no-repeat;
    width:18px;
    height: 18px;
    background-size: 100% 100%;
    position: relative;
  }
  .icon-question:hover .hover-box{
    display: block;
  }
  .icon-question .hover-box{
    display: none;
    width: 562px;
    position: absolute;
    left: -116px;
    top: -170px;
    background: #FFF;
    min-width: 150px;
    border: 1px solid #EBEEF5;
    border-radius: 8px;
    padding: 12px;
    z-index: 2000;
    color: #606266;
    line-height: 1.4;
    font-style: normal;
    text-align: justify;
    font-size: 14px;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    word-break: break-all;
  }
  .icon-question .hover-box:after{
    content: "";
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    border-width: 6px;
    bottom: -6px;
    left: 118px;
    border-bottom-width: 0;
    border-top-color: #fff;
  }
  .gold-coin-box{
    position: relative;
    background-color: #f7f7f7;
    border: 1px solid #e5e5e5;
    padding: 25px 35px;
    margin-bottom: 30px;
  }
  .gold-coin-box .coin-number-box{
    min-width: 300px;
  }
  .gold-coin-box .coin-title{
    font-size: 16px;
  }
  .gold-coin-box .coin-notes{
    position: absolute;
    right: 35px;
    top: 25px;
    font-size: 16px;
    color: #c59b56;
  }
  .gold-coin-box .coin-number{
    font-size: 30px;
    color: #c59b56;
  }
  .exchange-btn .el-button{
    background-color: #c59b56;
    color: #ffffff;
  }
  .exchange-btn .el-button:hover{
    background-color: #c59649
  }
  .button-help{
    font-size: 20px;
    cursor: pointer;
  }
  .demo-ruleForm{
    max-width: 500px;
    margin: 0 auto;
  }
  .max-mout .tmount{
    line-height: 20px;
    color: #999999;
  }
  .notice{
    margin-bottom: 30px;
  }
  .notice .tmount{
    line-height: 20px;
    color: #999999;
  }
  .loginButton{ width: 100%}
  .sure-ruleForm{
    max-width: 500px;
    margin: 0 auto;
    margin-bottom: 50px;
  }
  .sure-dialog .loginButton{
    display: block;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
  .yz-email .el-dialog__footer .el-button{
    width: 50%;
    float: left;
    border-right: 1px solid #e5e5e5;
    padding: 22px 20px;
    position: relative;
    border-radius: 0;
  }
  .yz-email .el-button+.el-button{
    margin-left: 0;
  }
  @media screen and (max-width: 768px){
    .gold-coin-box .coin-number-box{
      min-width: auto;
    }
    .exchange-btn{
      margin-top: 40px;
      margin-left: 20px;
    }
  }
</style>
<style>
  .notice .el-form-item__label{
    line-height: 20px;
  }
  .reject-dialog .el-dialog{
    max-width: 480px;
  }
  .withdrawal-dialog .el-dialog{
    max-width: 800px;
  }
  .sure-dialog .el-dialog{
    max-width: 660px;
  }
  .withdrawal-dialog .el-dialog__header {
    background: #409eff;
    padding: 15px 20px;
  }
  .sure-dialog .el-dialog__header {
    background: #409eff;
    padding: 15px 20px;
  }
  .withdrawal-dialog .el-dialog__title {
    font-size: 16px;
    color: #ffffff;
  }
  .reject-dialog .el-dialog__body{
    padding: 40px 20px;
  }
  .sure-dialog .el-dialog__title {
    font-size: 16px;
    color: #ffffff;
  }
  .withdrawal-dialog .el-dialog__headerbtn .el-dialog__close {
    color: #ffffff;
  }
  .sure-dialog .el-dialog__headerbtn .el-dialog__close {
    color: #ffffff;
  }
  .sure-dialog .el-form-item{
    margin-bottom: 10px;
  }
  .sure-dialog .el-form-item__label{
    color: #999999;
  }
  .yz-email .el-dialog{
    max-width: 480px;
    border-radius: 5px;
    overflow: hidden;
  }
  .yz-email .el-dialog__footer{
    padding: 0;
    border-top: 1px solid #e5e5e5;
  }
</style>
