<template>
  <div class="container main-container">
    <div class="view welcome-view">
      <div class="welcome-context">
        <div class="invite-box">
          <div class="invite-info-box">
            <div class="type-title clearfix gold"><h2 class="pull-left title">积分概况</h2> </div>
            <div class="gold-coin-box clearfix">
              <div class="pull-left coin-number-box">
                <p class="coin-title">当前总积分:</p>
                <span class="coin-number">{{score_sum}}</span>
              </div>
              <div class="pull-left exchange-btn">
                <a target="_blank"  :href="buy_points"><el-button>购买积分</el-button></a>
              </div>
             <a class="coin-notes" target="_blank"  :href="explain_guide">积分说明</a>
            </div>
            <div class="type-title clearfix gold"><h2 class="pull-left title">积分订单
              <i class="icon-question pt-10">
                <div class="hover-box">
                  <p>1.订单只有两种状态:'待支付'和'已支付'</p>
                  <p>2.下单后(或支付后),订单状态显示'待支付',待商家确认收到支付金额后,才会变成'已支付'</p>
                  <p>3.状态变为'已支付',其购买的积分才会显示在积分明细,且添加到账户余额</p>
                  <p>注:为方便商家尽快确认收款信息,支付后请点击'已支付'按钮</p>
                </div>
              </i>
            </h2>
            </div>
            <div class="gold-invite-table">
              <el-form ref="ruleForm" :label-position="labelPosition" :model="form" label-width="80px">
                <el-form-item label="订单状态:" prop="status" class="pull-right">
                  <el-select v-model="form.order_status" placeholder="状态类型" @change="choiceStatus" clearable>
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
                  prop="amount"
                  label="购买积分数"
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
                    <span>{{scope.row.status===1?'待支付':scope.row.status===2?'已支付,待到账':scope.row.status===3?'已支付':scope.row.status===4?'已取消':scope.row.status===5?'已过期':''}}</span>
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
            <div class="type-title clearfix gold"><h2 class="pull-left title">积分明细</h2></div>
            <div class="gold-invite-table">
              <el-table
                :data="tableDetail"
                border
                style="width: 100%">
                <el-table-column
                  prop="created_at"
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
                  prop="amount"
                  label="变动数量"
                  align="center"
                  width="">
                </el-table-column>
                <el-table-column
                  prop="expired_at"
                  label="有效期"
                  align="center"
                  width="">
                </el-table-column>
              </el-table>
              <div class="box-pagination" v-if="totalDetail>10">
                <el-pagination
                  background
                  @size-change="handleSizeDetail"
                  @current-change="handleCurrentDetail"
                  :current-page="currentPageDetail"
                  :page-sizes="[5, 10, 20, 30]"
                  :page-size="sizeDetail"
                  :total="totalDetail"
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
  data () {
    return {
      buy_points: '',
      explain_guide: '',
      tableOrder: [],
      tableDetail: [],
      labelPosition: 'right',
      score_sum: 0,
      form: {},
      statusType: [
        {label: '全部', value: 0},
        {label: '待支付', value: 1},
        {label: '已支付', value: 3}
      ],
      currentPageDetail: 1,
      totalDetail: 0,
      sizeDetail: 10,
      currentPageOrder: 1,
      totalOrder: 0,
      sizeOrder: 10
    }
  },
  computed: {
  },
  mounted () {
    this.buy_points = this.http.buyScoreLink
    this.explain_guide = this.http.explainGuideLink(0)
    this.getOrder({size: 10})
    this.getDeatil({size: 10})
  },
  methods: {
    getOrder (params) {
      this.http.scoreOrder(params).then(res => {
        if (res.status === 0) {
          this.totalOrder = res.data.total_num
          if (res.data.scoresorder_list) {
            res.data.scoresorder_list.forEach(item => {
              item.created_at = this.getTime(item.created_at)
            })
            this.tableOrder = res.data.scoresorder_list
          } else {
            this.tableOrder = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    getDeatil (params) {
      this.http.scoreDetail(params).then(res => {
        if (res.status === 0) {
          this.totalDetail = res.data.total_num
          this.score_sum = res.data.score_sum
          if (res.data.scoredetail_list) {
            res.data.scoredetail_list.forEach(item => {
              item.created_at = this.getTime(item.created_at)
              item.expired_at = item.expired_at > 0 ? this.getTime(item.expired_at, true) : ''
              item.amount = item.amount > 0 ? '+' + item.amount : item.amount
            })
            this.tableDetail = res.data.scoredetail_list
          } else {
            this.tableDetail = []
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    choiceStatus () {
      this.currentPageOrder = 1
      if (this.form.order_status === '') {
        this.getOrder({order_status: 0})
      } else {
        this.getOrder({order_status: this.form.order_status})
      }
    },
    handleSizeOrder (val) {
      this.sizeOrder = val
      this.currentPageOrder = 1
      this.form.size = val
      if (this.form.order_status) {
        this.getOrder({size: val, order_status: this.form.order_status})
      } else {
        this.getOrder({size: val})
      }
    },
    handleCurrentOrder (val) {
      this.currentPageOrder = val
      this.form.start = (Number(val) - 1) * this.sizeOrder
      if (this.form.order_status === null) {
        delete this.form.order_status
        this.getOrder(this.form)
      } else {
        this.getOrder(this.form)
      }
    },
    handleSizeDetail (val) {
      this.sizeDetail = val
      this.currentPageDetail = 1
      this.getDeatil({size: val})
    },
    handleCurrentDetail (val) {
      this.currentPageDetail = val
      this.getDeatil({size: this.sizeDetail, start: (Number(val) - 1) * this.sizeDetail})
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
    top: -155px;
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
    cursor: pointer;
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
  @media screen and (max-width: 768px){
    .gold-coin-box .coin-number-box{
      min-width: auto;
    }
    .exchange-btn{
      margin-top: 40px;
      margin-left: 20px;
    }
    .icon-question .hover-box {
      max-width: 100%;
    }
  }
</style>
<style>
  .invite-box .el-dialog{
    max-width: 800px;
  }
  .invite-box .el-dialog__body{
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
  }
</style>
