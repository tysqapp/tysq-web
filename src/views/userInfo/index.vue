<template>
  <div class="container main-container">
    <div class="view welcome-view">
      <div class="welcome-context">
        <div class="user-info-head clearfix mt-30">
          <div class="avatar-uploader">
            <div class="upload">
              <img :src="imageUrl?imageUrl:useradimg" class="avatar">
            </div>
          </div>
          <div class="set-info-other">
            <div class="info-p clearfix">
              <div class="float-left">
                <span class="name">{{formLabelAlign.name}}</span>
                <a :href="explain_guide" target="_blank"><img :src="gradeImg" alt="等级" class="trade-img"></a>
              </div>
              <div class="float-right">
                <router-link to="/editInfo">
                  <el-button type="primary" plain class="edit-btn-big">编辑个人资料</el-button>
                  <el-button type="primary" size="small" plain class="edit-btn-small">编辑</el-button>
                </router-link>
              </div>
            </div>
            <p style="word-break: break-all">
              <span class="text-999">{{account_info.career}}</span>
              <span v-if="account_info.career" class="line text-999 ml-5 mr-5">|</span>
              <span class="text-999">{{account_info.trade}}</span>
              <span v-if="account_info.trade" class="line text-999 ml-5 mr-5">|</span>
              <span class="text-999">{{account_info.home_address}}</span>
            </p>
            <p style="word-break: break-all"><span class="text-999">{{account_info.personal_profile}}</span></p>
          </div>
        </div>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" class="col-pull-right">
            <div class="user-info-item border-radius-4 mobile-info">
              <ul>
                <li class="clearfix exchange-btn2 icon-integral">
                  <p class="clearfix line-height">
                    <span class="pull-left fs-16">积分：<span class="strong fs-18">{{asset.score}}</span></span>
                    <router-link to="/integralDetailed" class="pull-right"> <span class="text-999">详情<i class="el-icon-arrow-right"></i></span></router-link>
                    <a  class="pull-right mr-10" target="_blank" :href="buy_points"><el-button>购买-升级</el-button></a>
                  </p>
                  <p><span class="mr-10 text-666">可获相应等级</span><img :src="gradeImg" alt="等级" class="mb-5"></p>
                </li>
                <li class="clearfix exchange-btn icon-coin exchange-btn2">
                  <p class="clearfix line-height">
                    <span class="pull-left fs-16 mr-10">金币：<span class="strong fs-18">{{asset.hot_coin}}</span></span>
                    <span class="pull-right text-999" @click="goDetail" style="cursor: pointer">详情<i class="el-icon-arrow-right"></i></span>
                    <a class="pull-right mr-10" target="_blank" :href="buy_coin"><el-button>购买</el-button></a>
                    <span class="pull-right mr-10"><el-button @click="toMoney">提币</el-button></span>
                  </p>
                  <p><span class="mr-10 text-666">={{asset.realVal}}元</span></p>
                </li>
                <li class="clearfix exchange-btn icon-friend">
                  <p class="clearfix line-height">
                    <span class="pull-left fs-16 mr-10">已邀请好友：<span class="strong fs-18">{{asset.invited}}</span></span>
                    <router-link to="/inviteFriends" class="pull-right"> <span class="text-999">详情<i class="el-icon-arrow-right"></i></span></router-link>
                    <a class="pull-right mr-10" :href="go_invite" target="_blank"><el-button>去邀请</el-button></a>
                  </p>
                </li>
              </ul>
            </div>
            <div class="user-info-item border-radius-4 pc-info">
              <ul>
                <li class="clearfix exchange-btn2 icon-integral">
                  <p class="clearfix"><span class="strong pull-left fs-20">积分</span> <router-link to="/integralDetailed" class="pull-right"> <span class="text-999 fs-16">详情<i class="el-icon-arrow-right"></i></span></router-link></p>
                  <p class="clearfix"><span class="strong fs-24">{{asset.score}}</span></p>
                  <p><span class="fs-16 mr-15 text-666">可获相应等级</span><img :src="gradeImg" alt="等级" class="mb-5"></p>
                </li>
                <li class="clearfix exchange-btn2 text-center"><a target="_blank" :href="buy_points"><el-button>购买-升级</el-button></a></li>
              </ul>
            </div>
            <div class="user-info-item border-radius-4 pc-info">
              <ul>
                <li class="clearfix exchange-btn icon-coin">
                  <p class="clearfix"><span class="strong pull-left fs-20">金币</span><span class="pull-right text-999 fs-16" @click="goDetail" style="cursor: pointer">详情<i class="el-icon-arrow-right"></i></span></p>
                  <p class="clearfix"><span class="strong fs-24">{{asset.hot_coin}}</span></p>
                  <p><span class="fs-16 mr-15 text-666">={{asset.realVal}}元</span></p>
                </li>
                <li class="clearfix exchange-btn text-center exchange-btn2"><el-button class="mr-5" @click="toMoney">提币</el-button> <a target="_blank" class="ml-5" :href="buy_coin"><el-button>购买</el-button></a></li>
              </ul>
            </div>
            <div class="user-info-item border-radius-4 pc-info">
              <ul>
                <li class="clearfix exchange-btn icon-friend">
                  <p class="clearfix"><span class="strong pull-left fs-20">已邀请好友</span> <router-link to="/inviteFriends" class="pull-right"> <span class="text-999 fs-16">详情<i class="el-icon-arrow-right"></i></span></router-link></p>
                  <p class="clearfix"><span class="strong fs-24">{{asset.invited}}</span></p>
                </li>
                <li class="clearfix exchange-btn text-center"><a :href="go_invite" target="_blank"><el-button>去邀请</el-button></a></li>
              </ul>
            </div>
            <div class="user-info-item border-radius-4">
              <ul>
                <li class="clearfix">
                  <span class="strong fs-18 text-333 user-text"><img src="../../assets/icon/icon-on-achievement.png" width="17" height="18" alt="" class="mr-10">个人成就</span>
                </li>
                <li class="clearfix">
                  <span class="trade-name strong fs-18">文章被阅读：</span><span class="text-999 strong fs-18">{{account_info.readed_num}}</span>
                </li>
                <li class="clearfix">
                  <span class="trade-name strong fs-18">文章被收藏：</span><span class="text-999 strong fs-18">{{account_info.collected_num}}</span>
                </li>
              </ul>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18" class="col-pull-left">
            <div class="user-info-content border-radius-4">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane name="one">
                  <span slot="label">文章({{listDataNumber}})</span>
                  <div class="clearfix passage-status-select">
                    <el-select v-model="defaultPassage" class="float-right" placeholder="请选择" @change="choicePassage">
                      <el-option
                        v-for="item in passageOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                  <div v-if="listData.length>0" class="news-box useinfo-box">
                    <ul>
                      <a href="javascript:void(0)" v-for="(item,index) in listData" :key="index">
                        <li @click="openArtice(item)">
                          <div class="news-list-box">
                            <div class="news-list clearfix">
                              <div class="pull-left news-list-text" style="position: relative">
                                <h2><img src="../../assets/examine/draft.png" alt="" v-if="item.status===2"> <span class="hide-sign" v-if="item.status===-4">隐藏</span> {{item.title}}</h2>
                                <p class="label-name">
                                  <span v-if="item1.label_name.length>0" v-for="(item1,index1) in item.label" :key="index1" class="label_style">{{item1.label_name}}</span>
                                </p>
                                <p class="text-overflow-2">{{item.content}}</p>
                                <div class="clearfix author text-aaa">
                                  <div class="name-date pull-left clearfix">
                                    <span class="date">{{item.created_time}}</span>
                                  </div>
                                  <span class="look"><i class="el-icon-view"></i>{{item.read_number!=0?item.read_number:''}}</span>
                                  <span class="comment"><i class="el-icon-chat-dot-round"></i>{{item.comment_number!=0?item.comment_number:''}}</span>
                                </div>
                                <p class="text-overflow-1 reject_p " v-if="item.status === -2">驳回原因:{{item.reason}}</p>
                                <div class="examine-status text-center">
                                  <img :src="item.review_src" v-if="item.status === -1||item.status === -2">
                                </div>
                              </div>
                              <div class="pull-right news-list-img" v-if="item.cover_url">
                                <div style="height: 100%">
                                  <el-image
                                    class="fm_img"
                                    :src="item.cover_url"
                                    fit="contain"
                                    lazy>
                                  </el-image>
                                  <img src="../../assets/video.png" class="video_img" v-if="item.cover_type==='video'">
                                </div>
                              </div>
                            </div>
                            <div class="clearfix phone-author text-aaa">
                              <div class="name-date pull-left clearfix">
                                <span class="date">{{item.created_time}}</span>
                              </div>
                              <div class="look-comment pull-right clearfix">
                                <span class="look"><i class="el-icon-view"></i>{{item.read_number!=0?item.read_number:''}}</span>
                                <span class="comment"><i class="el-icon-chat-dot-round"></i>{{item.comment_number!=0?item.comment_number:''}}</span>
                              </div>
                            </div>
                          </div>
                        </li>
                      </a>
                    </ul>
                  </div>
                  <div v-if="listData.length===0&&res_flag.article"  class="no-passage">
                    <p><img src="../../../static/images/wenzhangliebiao.png" width="57" height="55" alt=""></p>
                    <p class="text-999 fs-14">亲，你文章列表空空的哦！</p>
                  </div>
                </el-tab-pane>
                <el-tab-pane name="two">
                  <span slot="label">评论({{commentsNumber}})</span>
                  <div v-if="commentsData.length > 0" class="comment-box">
                    <ul>
                      <li v-for="(item,index) in commentsData" :key="index">
                        <el-row :gutter="20">

                          <a href="javascript:void(0)">
                            <el-col :xs="19" :sm="19" :md="22" :lg="22" :xl="22" @click.native="open(2,item)">
                              <p>
                      <span class="text-666 mr-35">
                        <span></span>
                        <span v-if="item.commented_id != 0">回复了</span>
                        <span v-if="item.commented_id === 0">评论了文章</span>
                        {{ item.commented_id === item.author_id ? item.author_name : ''}}
                        {{ item.commented_id != 0 ? item.commented_name : ''}} <span class="text-orange" v-if="item.commented_id === item.author_id">(作者)</span>
                       <span v-if="item.commented_id != 0">在</span><span class="text-orange">《{{item.title}}》</span> <span v-if="item.commented_id != 0">的评论</span>
                      </span>
                                <span class="text-aaa">{{item.time}}</span>
                              </p>
                              <p>{{item.content}}</p>
                              <div class="comment-img-box clearfix">
                                <div v-for="(item1,index1) in item.image_url" :key="index1" class="pull-left item-img"><img :src="item1.url" width="150" height="100" alt=""></div>
                              </div>
                              <div class="other-reply" v-if="item.respond_content">
                                <span v-if="item.commented_id != 0">{{item.commented_name}}<span v-if="item.commented_id === item.author_id">(作者)</span>: {{item.respond_content}}</span>
                                <span v-else>{{item.author_name}}: {{item.respond_content}}</span>
                              </div>
                            </el-col>
                          </a>
                          <el-col :xs="3" :sm="3" :md="2" :lg="2" :xl="2" class="text-center">
                            <span class="comment-delete-icon"><i class="fa fa-trash-o" aria-hidden="true" @click="delete_action(item.id)"></i></span>
                          </el-col>
                        </el-row>
                      </li>
                    </ul>
                  </div>
                  <div v-if="commentsData.length===0&&res_flag.comment" class="no-passage">
                    <p><img src="../../../static/images/pinglun.png" width="50" height="55" alt=""></p>
                    <p class="text-999 fs-14">亲，你的评论列表空空的哦!</p>
                  </div>
                </el-tab-pane>
                <el-tab-pane name="three">
                  <span slot="label">收藏({{collectNumber}})</span>
                  <div v-if="collectData.length>0" class="news-box useinfo-box">
                    <ul>
                      <li v-for="(item,index) in collectData" :key="index">
                        <div class="news-list-box">
                          <el-row :gutter="20">
                          <a href="javascript:void(0)">
                            <el-col :xs="19" :sm="19" :md="22" :lg="22" :xl="22" @click.native="open(1,item)">
                              <div class="news-list clearfix">
                                <div class="pull-left news-list-text">
                                  <h2>{{item.title}}</h2>
                                  <div class="clearfix author text-aaa">
                                    <div class="name-date pull-left clearfix">
                                      <img src="../../assets/collect.png" alt="" class="float-left collect_icon">  <span class="date">{{item.create_time}}</span>
                                    </div>
                                  </div>
                                </div></div>
                              <div class="clearfix phone-author text-aaa">
                                <div class="name-date pull-left clearfix">
                                  <img src="../../assets/collect.png" alt="" class="float-left collect_icon"> <span class="date">{{item.create_time}}</span>
                                </div>
                              </div>
                            </el-col>
                          </a>
                          <el-col :xs="3" :sm="3" :md="2" :lg="2" :xl="2" class="text-center mt-20">
                            <span class="comment-delete-icon" @click="cancal({article_id:item.article_id,collect_status:1})"><i class="fa fa-trash-o" aria-hidden="true"></i></span>
                          </el-col>
                        </el-row>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div  v-if="collectData.length===0&&res_flag.collect" class="no-passage">
                    <p><img src="../../../static/images/wenzhangliebiao.png" width="57" height="55" alt=""></p>
                    <p class="text-999 fs-14">亲，你的收藏列表空空的哦！</p>
                  </div>
                </el-tab-pane>
                <el-tab-pane name="four">
                  <span slot="label">关注({{attentionsNumber}})</span>
                  <div class="follow-box" v-if="attentionsData.length>0">
                    <ul>
                      <a href="javascript:void(0)" v-for="(item,index) in attentionsData" :key="index">
                      <li>
                        <div class="follow-list clearfix">
                          <div class="follow-list-img" @click="open(3,item)"><img :src="item.head_url?item.head_url:useradimg" width="80" height="80" alt=""></div>
                          <div class="follow-list-text" @click="open(3,item)">
                            <h2>{{item.account_name}}<img :src="item.gradeImg" alt="等级" class="trade-img"></h2>
                            <p class="text-999 mb-5 text-overflow-1">{{item.personal_profile}}</p>
                            <div class="clearfix achievement-item">
                              <span>文章 {{item.article_num}}</span>
                              <span>阅读 {{item.readed_num}}</span>
                              <span>收藏 {{item.collected_num}}</span>
                            </div>
                          </div>
                          <div class="follow-btn follow-btn-pc" :class="[item.is_follow?'followed':'']">
                            <el-tooltip class="item" effect="dark" content="关注" placement="top" v-if="!item.is_follow">
                              <el-button type="primary" plain  @click="getAttentionsAction({attention_id:item.account_id,is_follow:true},'attentions')">+ 关注</el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="取消关注" placement="top"  v-if="item.is_follow">
                              <el-button type="primary" @click="getAttentionsAction({attention_id:item.account_id,is_follow:false},'attentions')">已关注</el-button>
                            </el-tooltip>
                          </div>
                          <div class="follow-btn follow-btn-phone" :class="[item.is_follow?'followed':'']">
                            <el-tooltip class="item" effect="dark" content="关注" placement="top" v-if="!item.is_follow">
                              <el-button type="primary"  size="small" plain  @click="getAttentionsAction({attention_id:item.account_id,is_follow:true},'attentions')">+ 关注</el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="取消关注" placement="top"  v-if="item.is_follow">
                              <el-button type="primary" size="small"  @click="getAttentionsAction({attention_id:item.account_id,is_follow:false},'attentions')">已关注</el-button>
                            </el-tooltip>
                          </div>
                        </div>
                      </li>
                      </a>
                    </ul>
                  </div>
                  <div  v-if="attentionsData.length===0&&res_flag.attentions" class="no-passage">
                    <p><img src="../../../static/images/wenzhangliebiao.png" width="57" height="55" alt=""></p>
                    <p class="text-999 fs-14">亲，你的关注列表空空的哦！</p>
                  </div>
                </el-tab-pane>
                <el-tab-pane name="five">
                  <span slot="label">粉丝({{fansNumber}})</span>
                  <div class="follow-box" v-if="fansData.length>0">
                    <ul>
                      <a href="javascript:void(0)" v-for="(item,index) in fansData" :key="index">
                      <li>
                        <div class="follow-list clearfix">
                          <div class="follow-list-img"  @click="open(3,item)"><img :src="item.head_url?item.head_url:useradimg" width="80" height="80" alt=""></div>
                          <div class="follow-list-text"  @click="open(3,item)">
                            <h2>{{item.account_name}}<img :src="item.gradeImg" alt="等级" class="trade-img"></h2>
                            <p class="text-999 mb-5 text-overflow-1">{{item.personal_profile}}</p>
                            <div class="clearfix achievement-item">
                              <span>文章 {{item.article_num}}</span>
                              <span>阅读 {{item.readed_num}}</span>
                              <span>收藏 {{item.collected_num}}</span>
                            </div>
                          </div>
                          <div class="follow-btn follow-btn-pc" :class="[item.is_follow?'followed':'']">
                            <el-tooltip class="item" effect="dark" content="关注" placement="top" v-if="!item.is_follow">
                              <el-button type="primary" plain  @click="getAttentionsAction({attention_id:item.account_id,is_follow:true},'fans')">+ 关注</el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="取消关注" placement="top"  v-if="item.is_follow">
                              <el-button type="primary" @click="getAttentionsAction({attention_id:item.account_id,is_follow:false},'fans')">已关注</el-button>
                            </el-tooltip>
                          </div>
                          <div class="follow-btn-phone follow-btn" :class="[item.is_follow?'followed':'']">
                            <el-tooltip class="item" effect="dark" content="关注" placement="top" v-if="!item.is_follow">
                              <el-button type="primary" size="small" plain  @click="getAttentionsAction({attention_id:item.account_id,is_follow:true},'fans')">+ 关注</el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="取消关注" placement="top"  v-if="item.is_follow">
                              <el-button type="primary" size="small" @click="getAttentionsAction({attention_id:item.account_id,is_follow:false},'fans')">已关注</el-button>
                            </el-tooltip>
                          </div>
                        </div>
                      </li>
                      </a>
                    </ul>
                  </div>
                  <div  v-if="fansData.length===0&&res_flag.fans" class="no-passage">
                    <p><img src="../../../static/images/wenzhangliebiao.png" width="57" height="55" alt=""></p>
                    <p class="text-999 fs-14">亲，你的粉丝列表空空的哦！</p>
                  </div>
                </el-tab-pane>
              </el-tabs>
              <div class="home-el-pagination" v-if="show_pagination">
                <el-pagination
                  background
                  :current-page.sync="currentPage"
                  :page-size="size"
                  layout="total, prev, pager, next, jumper"
                  @current-change="handleCurrentChange"
                  :total="total">
                </el-pagination>
              </div>
              <div class="home-el-pagination-phone" v-if="show_pagination">
                <el-pagination
                  background
                  :current-page.sync="currentPage"
                  :page-size="size"
                  :pager-count="pagerCount"
                  layout="prev, pager, next"
                  @current-change="handleCurrentChange"
                  :total="total">
                </el-pagination>
              </div>
            </div>
          </el-col>
        </el-row>
        <!--el-dialog-->
        <el-dialog
          class="comment_delete"
          title="删除评论"
          align="center"
          :visible.sync="deleteCommentVisible"
        >
          <span>你确定要删除这条评论吗？</span>
          <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="deleteCommentVisible = false">关闭</el-button>
        <el-button type="text" @click="deleteCommentData({comment_id:deleteAction})">确 定</el-button>
      </span>
        </el-dialog>
        <!--el-dialog-->
        <el-dialog
          class="comment_delete"
          title="取消收藏"
          align="center"
          :visible.sync="deleteCollectVisible"
        >
          <span>你确定要取消这篇文章的收藏？</span>
          <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="deleteCollectVisible = false">关闭</el-button>
        <el-button type="text" @click="collect(canclInfo)">确 定</el-button>
      </span>
        </el-dialog>
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
      </div>
    </div>
  </div>
</template>

<script>
import globalPopup from '../../components/popup'
export default {
  name: 'userInfo',
  components: {
    'global-popup': globalPopup
  },
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
      res_flag: {article: false, comment: false, collect: false, fans: false, attentions: false},
      currentPage: 1,
      total: 0,
      account_id: null,
      pagerCount: 5,
      show_pagination: false,
      buy_points: '',
      buy_coin: '',
      go_invite: '',
      explain_guide: '',
      deleteCommentVisible: false,
      deleteCollectVisible: false,
      dialogEmailVisible: false,
      emailStatus: '',
      deleteAction: '',
      useradimg: require('../../../static/images/toux.png'),
      gradeImg: '',
      path: '#/article/info?article_id=',
      path1: '#/article/info?scroll_id=comment&&article_id=',
      path2: '#/otherUserInfo?account_id=',
      choiceStyle: 'Radio',
      video_id: 0,
      file_style: 'user',
      title: '云盘图片选择',
      file_type: 1,
      propData: [],
      imgData: [],
      filedList: [],
      defaultPassage: 0,
      passageOptions: [
        {value: 0, label: '全部'},
        {value: 1, label: '已发布'},
        {value: 2, label: '草稿'},
        {value: -4, label: '已隐藏'},
        {value: -1, label: '待审核'},
        {value: -2, label: '审核驳回'}
      ],
      dialogVisible: false,
      dialogSuretVisible: false,
      asset: {},
      size: 20,
      start: 1,
      imageUrl: '',
      nameOreator: {readonly: true},
      olderName: '',
      formLabelAlign: {
        name: ''
      },
      account_info: {},
      ruleForm: {
        email: '',
        withdraw_url: '',
        coin_amount: '',
        captcha: '',
        captcha_id: '',
        note: ''
      },
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
      flag: true,
      minutes: 0,
      seconds: 60,
      sureForm: {},
      amountInfo: {},
      canclInfo: {},
      total_number: 0,
      activeName: 'one',
      listData: [],
      commentsData: [],
      collectData: [],
      attentionsData: [],
      fansData: [],
      listDataNumber: 0,
      commentsNumber: 0,
      collectNumber: 0,
      attentionsNumber: 0,
      fansNumber: 0
    }
  },
  computed: {
  },
  inject: ['reload'],
  mounted () {
    this.buy_points = this.http.buyScoreLink
    this.go_invite = this.http.inviteFriendsH5
    this.buy_coin = this.http.buyCoinLink
    this.explain_guide = this.http.explainGuideLink(1)
    this.userInfo()
    this.getArticleList({size: this.size})
  },
  beforeDestroy () {

  },
  methods: {
    open (type, item) {
      if (type === 1) {
        window.open(this.path + item.article_id, '_blank')
      } else if (type === 2) {
        window.open(this.path1 + item.article_id + '&&scroll_id=comment', '_blank')
      } else if (type === 3) {
        window.open(this.path2 + item.account_id, '_blank')
      }
    },
    openArtice (item) {
      window.open(this.path + item.id, '_blank')
    },
    cancal (params) {
      this.deleteCollectVisible = true
      this.canclInfo = params
    },
    delete_action (params) {
      this.deleteCommentVisible = true
      this.deleteAction = params
    },
    deleteCommentData (params) {
      this.http.deleteComment(params).then(res => {
        if (res.status === 0) {
          this.deleteCommentVisible = false
          let pageCount = Math.ceil(this.total / this.size)
          if (pageCount > 1 && pageCount === this.start) {
            if (this.commentsData.length === 1) {
              this.start = this.start - 1
              this.getCommentsList({size: this.size, start: (this.start - 1) * this.size})
            } else {
              this.getCommentsList({size: this.size, start: (this.start - 1) * this.size})
            }
          } else {
            this.getCommentsList({size: this.size, start: (this.start - 1) * this.size})
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    submitAll () {
      if (this.total_number > 0) {
        this.ruleForm.coin_amount = this.total_number
        this.InputNumber()
      } else {
        this.$toast('您的可提现额度不足', 2000, 'error')
      }
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
          return false
        }
      })
    },
    handleClose (done) {
      done()
      this.reload()
    },
    sure () {
      this.ruleForm.coin_amount = Number(this.ruleForm.coin_amount)
      this.tbApply(this.ruleForm)
    },
    tbApply (params) {
      this.http.postWithdraw(params).then(res => {
        if (res.status === 0) {
          this.$toast('提币申请已提交', 2000, 'common')
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
    collect (params) {
      this.http.collectOperate(params).then(res => {
        if (res.status === 0) {
          this.deleteCollectVisible = false
          let pageCount = Math.ceil(this.total / this.size)
          if (pageCount > 1 && pageCount === this.start) {
            if (this.collectData.length === 1) {
              this.start = this.start - 1
              this.getCollectList({size: this.size, start: (this.start - 1) * this.size})
            } else {
              this.getCollectList({size: this.size, start: (this.start - 1) * this.size})
            }
          } else {
            this.getCollectList({size: this.size, start: (this.start - 1) * this.size})
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    userInfo () {
      this.http
        .userInfo().then(res => {
          if (res.status === 0) {
            document.title = res.data.account_info.account + '的主页-' + window.GlodConfig.title
            this.account_info = res.data.account_info
            this.account_id = res.data.account_info.account_id
            this.imageUrl = res.data.account_info.head_url
            this.olderName = res.data.account_info.account
            this.formLabelAlign.name = res.data.account_info.account.replace(/\s+/g, '')
            this.emailStatus = res.data.account_info.email_status
            this.ruleForm.email = res.data.account_info.email
            this.asset = res.data.asset
            this.listDataNumber = res.data.asset.article_num
            this.commentsNumber = res.data.asset.comment_num
            this.collectNumber = res.data.asset.collect_num
            this.attentionsNumber = res.data.asset.attention_num
            this.fansNumber = res.data.asset.fan_num
            this.asset.realVal = parseFloat(res.data.asset.hot_coin / 1000).toFixed(2)
            this.gradeImg = res.data.asset.grade === 1 ? require('../../assets/invitaton/rank-1.png') : res.data.asset.grade === 2 ? require('../../assets/invitaton/rank-2.png') : res.data.asset.grade === 3 ? require('../../assets/invitaton/rank-3.png')
              : res.data.asset.grade === 4 ? require('../../assets/invitaton/rank-4.png') : res.data.asset.grade === 5 ? require('../../assets/invitaton/rank-5.png') : res.data.asset.grade === 6 ? require('../../assets/invitaton/rank-6.png') : res.data.asset.grade === 7 ? require('../../assets/invitaton/rank-7.png') : res.data.asset.grade === 8 ? require('../../assets/invitaton/rank-8.png') : res.data.asset.grade === 9 ? require('../../assets/invitaton/rank-9.png')
                : res.data.asset.grade === 10 ? require('../../assets/invitaton/rank-10.png') : res.data.asset.grade === 11 ? require('../../assets/invitaton/rank-11.png') : res.data.asset.grade === 12 ? require('../../assets/invitaton/rank-12.png') : res.data.asset.grade === 13 ? require('../../assets/invitaton/rank-13.png') : res.data.asset.grade === 14 ? require('../../assets/invitaton/rank-14.png')
                  : res.data.asset.grade === 15 ? require('../../assets/invitaton/rank-15.png') : res.data.asset.grade === 16 ? require('../../assets/invitaton/rank-16.png') : res.data.asset.grade === 17 ? require('../../assets/invitaton/rank-17.png') : res.data.asset.grade === 18 ? require('../../assets/invitaton/rank-18.png') : ''
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
    sendMessage () {
      if (this.ruleForm.email && this.Email(this.ruleForm.email)) {
        this.timer()
        this.http
          .getCaptcha({email: this.ruleForm.email, type: 'drawCurrency'})
          .then(res => {
            if (res.status === 0) {
              this.$toast('验证码已发送邮箱', 2000, 'common')
              this.ruleForm.captcha_id = res.data.captcha_id
            } else {
              this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
            }
          })
      } else {
        this.$toast('请输入正确的邮箱', 2000, 'error')
      }
    },
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
    getBtc (params) {
      this.http.getBtc(params).then(res => {
        if (res.status === 0) {
          this.amountInfo = res.data
          this.amountInfo.min_fee = res.data.min_fee // 最小网络手续费
          this.amountInfo.income_amount = res.data.income_amount // 到账BTC数
          this.amountInfo.amount = this.toNonExponential(res.data.withdraw_amount) // 金币对应BTC总数量
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    toNonExponential (num) {
      var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
      return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
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
    getArticleList (params) {
      this.res_flag.article = false
      this.http
        .userInfoArticleLists(params).then(res => {
          this.total = res.data.total_num
          if (res.status === 0) {
            this.res_flag.article = true
            this.listDataNumber = res.data.total_num
            this.total = this.listDataNumber
            if (res.data.articles_info) {
              res.data.articles_info.forEach(item => {
                item.created_time = this.getTime(item.created_time)
                item.review_src = item.status === -1 ? require('../../assets/examine/checkPending.png') : item.status === -2 ? require('../../assets/examine/reject.png') : ''
              })
              this.listData = res.data.articles_info
            } else {
              this.listData = []
            }
            if (this.listData.length === 0 && this.res_flag.article) {
              this.show_pagination = false
            } else {
              this.show_pagination = true
            }
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    },
    getCommentsList (params) {
      this.res_flag.comment = false
      this.http
        .userInfoCommentsLists(params).then(res => {
          if (res.status === 0) {
            this.res_flag.comment = true
            this.commentsNumber = res.data.total_num
            this.total = this.commentsNumber
            if (res.data.comment_info) {
              res.data.comment_info.forEach(item => {
                item.time = this.getTime(item.time)
              })
              this.commentsData = res.data.comment_info
            } else {
              this.commentsData = []
            }
            if (this.commentsData.length === 0 && this.res_flag.comment) {
              this.show_pagination = false
            } else {
              this.show_pagination = true
            }
          } else {
            this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
          }
        })
    },
    getCollectList (params) {
      this.res_flag.collect = false
      this.http.collectList(params).then(res => {
        if (res.status === 0) {
          this.res_flag.collect = true
          this.collectNumber = res.data.total_num
          this.total = this.collectNumber
          if (res.data.collects) {
            res.data.collects.forEach(item => {
              item.create_time = this.getTime(item.create_time)
            })
            this.collectData = res.data.collects
          } else {
            this.collectData = []
          }
          if (this.collectData.length === 0 && this.res_flag.collect) {
            this.show_pagination = false
          } else {
            this.show_pagination = true
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    getAttentionsAction (params, type) {
      this.http.attentionsAction(params).then(res => {
        if (res.status === 0) {
          if (type === 'attentions') {
            let pageCount = Math.ceil(this.total / this.size)
            if (pageCount > 1 && pageCount === this.start) {
              if (this.attentionsData.length === 1) {
                this.start = this.start - 1
                this.getAttentionsList({size: this.size, start: (this.start - 1) * this.size, account_id: this.account_id})
              } else {
                this.getAttentionsList({size: this.size, start: (this.start - 1) * this.size, account_id: this.account_id})
              }
            } else {
              this.getAttentionsList({size: this.size, start: (this.start - 1) * this.size, account_id: this.account_id})
            }
          } else {
            this.spliceFans(params)
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    spliceFans (params) {
      this.fansData.forEach((item) => {
        if (params.attention_id === item.account_id) {
          item.is_follow = !item.is_follow
        }
      })
    },
    getAttentionsList (params) {
      this.res_flag.attentions = false
      this.http.attentionsList(params).then(res => {
        if (res.status === 0) {
          this.res_flag.attentions = true
          this.attentionsNumber = res.data.total_num
          this.total = this.attentionsNumber
          if (res.data.account_follower_infos) {
            res.data.account_follower_infos.forEach(item => {
              item.gradeImg = item.grade === 1 ? require('../../assets/invitaton/rank-1.png') : item.grade === 2 ? require('../../assets/invitaton/rank-2.png') : item.grade === 3 ? require('../../assets/invitaton/rank-3.png')
                : item.grade === 4 ? require('../../assets/invitaton/rank-4.png') : item.grade === 5 ? require('../../assets/invitaton/rank-5.png') : item.grade === 6 ? require('../../assets/invitaton/rank-6.png') : item.grade === 7 ? require('../../assets/invitaton/rank-7.png') : item.grade === 8 ? require('../../assets/invitaton/rank-8.png') : item.grade === 9 ? require('../../assets/invitaton/rank-9.png')
                  : item.grade === 10 ? require('../../assets/invitaton/rank-10.png') : item.grade === 11 ? require('../../assets/invitaton/rank-11.png') : item.grade === 12 ? require('../../assets/invitaton/rank-12.png') : item.grade === 13 ? require('../../assets/invitaton/rank-13.png') : item.grade === 14 ? require('../../assets/invitaton/rank-14.png')
                    : item.grade === 15 ? require('../../assets/invitaton/rank-15.png') : item.grade === 16 ? require('../../assets/invitaton/rank-16.png') : item.grade === 17 ? require('../../assets/invitaton/rank-17.png') : item.grade === 18 ? require('../../assets/invitaton/rank-18.png') : ''
            })
            this.attentionsData = res.data.account_follower_infos
          } else {
            this.attentionsData = []
          }
          if (this.attentionsData.length === 0 && this.res_flag.attentions) {
            this.show_pagination = false
          } else {
            this.show_pagination = true
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    getFansList (params) {
      this.res_flag.fans = false
      this.http.fansList(params).then(res => {
        if (res.status === 0) {
          this.res_flag.fans = true
          this.fansNumber = res.data.total_num
          this.total = this.fansNumber
          if (res.data.account_follower_infos) {
            res.data.account_follower_infos.forEach(item => {
              item.gradeImg = item.grade === 1 ? require('../../assets/invitaton/rank-1.png') : item.grade === 2 ? require('../../assets/invitaton/rank-2.png') : item.grade === 3 ? require('../../assets/invitaton/rank-3.png')
                : item.grade === 4 ? require('../../assets/invitaton/rank-4.png') : item.grade === 5 ? require('../../assets/invitaton/rank-5.png') : item.grade === 6 ? require('../../assets/invitaton/rank-6.png') : item.grade === 7 ? require('../../assets/invitaton/rank-7.png') : item.grade === 8 ? require('../../assets/invitaton/rank-8.png') : item.grade === 9 ? require('../../assets/invitaton/rank-9.png')
                  : item.grade === 10 ? require('../../assets/invitaton/rank-10.png') : item.grade === 11 ? require('../../assets/invitaton/rank-11.png') : item.grade === 12 ? require('../../assets/invitaton/rank-12.png') : item.grade === 13 ? require('../../assets/invitaton/rank-13.png') : item.grade === 14 ? require('../../assets/invitaton/rank-14.png')
                    : item.grade === 15 ? require('../../assets/invitaton/rank-15.png') : item.grade === 16 ? require('../../assets/invitaton/rank-16.png') : item.grade === 17 ? require('../../assets/invitaton/rank-17.png') : item.grade === 18 ? require('../../assets/invitaton/rank-18.png') : ''
            })
            this.fansData = res.data.account_follower_infos
          } else {
            this.fansData = []
          }
          if (this.fansData.length === 0 && this.res_flag.fans) {
            this.show_pagination = false
          } else {
            this.show_pagination = true
          }
        } else {
          this.$toast('错误码' + res.status + ':' + '' + res.reason, 2000, 'error')
        }
      })
    },
    choicePassage () {
      this.listData = []
      this.currentPage = 1
      this.show_pagination = false
      this.getArticleList({size: this.size, status: this.defaultPassage})
    },
    handleClick () {
      this.currentPage = 1
      this.show_pagination = false
      this.start = 1
      if (this.activeName === 'one') {
        this.getArticleList({size: this.size})
      } else if (this.activeName === 'two') {
        this.getCommentsList({size: this.size})
      } else if (this.activeName === 'three') {
        this.getCollectList({size: this.size})
      } else if (this.activeName === 'four') {
        this.getAttentionsList({size: this.size, account_id: this.account_id})
      } else if (this.activeName === 'five') {
        this.getFansList({size: this.size, account_id: this.account_id})
      }
    },
    handleCurrentChange (val) {
      document.documentElement.scrollTop = 0
      this.start = val
      if (this.activeName === 'one') {
        this.getArticleList({start: (val - 1) * this.size, size: this.size, status: this.defaultPassage})
      } else if (this.activeName === 'two') {
        this.getCommentsList({start: (val - 1) * this.size, size: this.size})
      } else if (this.activeName === 'three') {
        this.getCollectList({start: (val - 1) * this.size, size: this.size})
      } else if (this.activeName === 'four') {
        this.getAttentionsList({start: (val - 1) * this.size, size: this.size, account_id: this.account_id})
      } else if (this.activeName === 'five') {
        this.getFansList({start: (val - 1) * this.size, size: this.size, account_id: this.account_id})
      }
    },
    toMoney () {
      if (this.emailStatus === 1) {
        this.dialogVisible = true
        this.total_number = this.asset.hot_coin
      } else {
        this.dialogEmailVisible = true
      }
    },
    goDetail () {
      this.$router.push({path: '/coinDetailed', query: {id: this.emailStatus}})
    },
    sureYz () {
      this.dialogEmailVisible = false
      this.$router.push({path: '/userSet'})
    }
  }
}
</script>

<style scoped>
  @import "../../styles/home.css";
  .main-container>.view{
    width: 100%;
  }
  .examine-status{
    position:absolute;
    left: 50%;
  }
  .hide-sign{
    padding: 3px 8px;
    color: #ffffff;
    background-color: #598CF2;
    font-size: 16px;
    border-radius: 4px
  }
  .reject_p{
    width: 100%;
    padding-top: 10px ;
    margin-bottom: 0px;
    color: #f25979 !important;
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
  .loginButton{
    width: 100%
  }
  .sure-ruleForm{
    max-width: 500px;
    margin: 0 auto;
    margin-bottom: 50px;
  }
  .user-info-head{
    min-height: 100px;
    padding: 12px 12px 12px 160px;
    background: #ffffff;
    position: relative;
    margin-bottom: 20px;
  }
  .user-info-head .avatar-uploader{
    border-radius: 5px;
    overflow: hidden;
    position: absolute;
    left: 20px;
    top: -25px;
    vertical-align: middle;
    -webkit-transform: perspective(1px) translateZ(0);
    transform: perspective(1px) translateZ(0);
    -webkit-transition-property: color;
    transition-property: color;
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
  }
  .user-info-head .avatar-uploader .upload {
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    padding: 5px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background: #ffffff;
  }
  .user-info-head .avatar-uploader .upload:hover {
    border-color: #409EFF;
  }
  .collect_icon{
    margin-top: 4px;
    margin-right: 10px;
  }
  .user-info-head .avatar {
    width: 110px;
    height: 110px;
    display: block;
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
  .edit-btn span{
    cursor: pointer;
  }
  .user-info-content{
    background: #ffffff;
    padding: 20px 20px 0px 20px;
  }
  .user-info-content .no-passage{
    margin-top: 0;
    padding: 50px 0;
  }
  .comment-box ul li{
    padding: 25px 10px;
  }
  .text-orange{
    color: #f3842b;
  }
  .comment-box ul li{
    border-bottom: 1px solid #e5e5e5;
  }
  .comment-img-box .item-img{
    width: 150px;
    height: 100px;
    border-radius: 4px;
    overflow: hidden;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .comment-img-box .item-img img{
    min-height: 100%;
    min-width: 100%;
  }
  .other-reply{
    display: inline-block;
    padding: 10px 15px;
    border-radius: 4px;
    background: #f5f5f5;
    position: relative;
    margin-top: 10px;
    color: #666;
  }
  .other-reply:before{
    position: absolute;
    left: 50px;
    top: -8px;
    content: "";
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #f5f5f5;
  }
  .comment-delete-icon{
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 50%;
    background: #f1f3f7;
    font-size: 24px;
    color: #9fadc2;
    cursor: pointer;
  }
  .comment-delete-icon i{
     margin-right:0;
  }
  .mobile-info{
    display: none;
  }
  .exchange-btn2 a .el-button{
    width: 106px;
    background-color: #c59b56;
    color: #ffffff;
    border: 1px solid #c59b56;
  }
  .exchange-btn2 a .el-button:hover,.exchange-btn2 a .el-button:focus{
    background-color: #c59649;
  }
  .exchange-btn .el-button{
    width: 106px;
    color: #c59b56;
    border: 1px solid #c59b56;
  }
  .exchange-btn .el-button:hover,.exchange-btn .el-button:focus{
    background-color: #c59649;
    color: #ffffff;
  }
  .user-info-item{
    background: #ffffff;
    margin-bottom: 20px;
  }
  .user-info-item ul li{
    padding: 12px 15px;
    border-bottom: 1px solid #f7f7f7;
  }
  .user-info-item ul li p{
    margin-bottom: 3px;
  }
  .user-info-item .icon-integral,.user-info-item .icon-coin,.user-info-item .icon-friend{
    min-height: 90px;
  }
  .user-info-item .icon-integral{
    padding-left: 90px; background: url("../../assets/icon-integral.png") no-repeat 15px 15px;
  }
  .user-info-item .icon-coin{
    padding-left: 90px; background: url("../../assets/icon-coin.png") no-repeat 15px 15px;
  }
  .user-info-item .icon-friend{
    padding-left: 90px; background: url("../../assets/icon-friend.png") no-repeat 15px 15px;
  }
  .user-info-item .trade-name{
    margin-right: 10px;
    color: #999999;
  }
  .user-info-item .trade-number{
    color: #cc9966;
  }
  .follow-box{
    background: #ffffff;
  }
  .follow-box ul li{
    padding: 20px 20px;
    border-bottom: 1px solid #e5e5e5;
  }
  .follow-box .follow-list{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
  .follow-list-img{
    flex: 0 0 auto;
    width: 80px;
    height: 80px;
    overflow: hidden;
    margin-right: 20px;
    background-color: #fff;
    border-radius: 4px;
    position: relative;
  }
  .follow-list-img .fm_img{
    width: 100%;
    height: 100%;
  }
  .follow-list-text{
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
  }
  .follow-list-text h2{
    font-size: 20px;
    margin-top: 0;
    margin-bottom: 5px;
  }
  .follow-list-text h2 img{
    margin-bottom: 3px;
    margin-left: 10px;
  }
  .follow-list-text h2 a{
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .follow-list-text .achievement-item span{
    color: #999999;
    margin-right: 30px;
  }
  .follow-list .follow-btn{
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .follow-btn-phone{
    display:none!important;
  }
  .follow-btn.followed .el-button--primary{
    background-color: #9fadc2;
    border-color: #9fadc2;
  }
  .follow-btn.followed .el-button--primary{
    background-color: #9fadc2;
    border-color: #9fadc2;
  }
  .follow-btn.followed .el-button--primary:focus, .follow-btn.followed .el-button--primary:hover{
    background-color: #a6b6ce;
    border-color: #a6b6ce;
  }
  .edit-btn-small{
    display: none;
  }
  .col-pull-right{
    float: right;
  }
  .col-pull-left{
    float: left;
  }
  .set-info-other .info-p{
    line-height: 32px;
  }
  .set-info-other .name{
    font-size: 20px;
    margin-right: 15px;
  }
  .set-info-other .trade-img {
    margin-bottom: 5px;
    width: auto;
    height: auto;
  }
  .home-el-pagination{
    padding: 20px;
  }
  .home-el-pagination-phone {
    padding: 20px 0;
    display: none;
  }
  @media only screen and (max-width: 768px){
    .user-info-head .avatar {
      width: 80px;
      height: 80px;
      display: block;
    }
    .examine-status{
      right: 0px;
    }
    .examine-status img{
      width: 70px;
    }
    .user-info-head .avatar-uploader{
      top: -20px;
      left: 12px;
    }
    .user-info-head{
      margin-top: 20px;
      padding: 2px 0 15px 105px;
    }
    .col-pull-right{
      float: left;
    }
    .col-pull-left{
      float: right;
    }
    .pc-info{
      display: none;
    }
    .mobile-info{
      display: block;
    }
    .mobile-info .line-height{
      line-height: 40px;
    }
    .exchange-btn2 a .el-button{
      width: 80px;
      padding: 8px 10px;
    }
    .exchange-btn .el-button{
      width: 80px;
      padding: 8px 10px;
    }
    .user-info-item .icon-integral,.user-info-item .icon-coin,.user-info-item .icon-friend{
      min-height: 40px;
    }
    .user-info-item .icon-integral{
      padding-left: 70px; background: url("../../assets/icon-integral.png") no-repeat 15px 15px;
      background-size: 40px 40px;
    }
    .user-info-item .icon-coin{
      padding-left: 70px; background: url("../../assets/icon-coin.png") no-repeat 15px 15px;
      background-size: 40px 40px;
    }
    .user-info-item .icon-friend{
      padding-left: 70px; background: url("../../assets/icon-friend.png") no-repeat 15px 15px;
      background-size: 40px 40px;
    }
    .follow-box ul li{
      padding: 20px 0px;
    }
    .follow-btn-phone{
      display: block!important;
    }
    .follow-btn-pc{
      display: none!important;
    }
    .follow-list-img{
      width: 60px;
      height: 60px;
      margin-right: 15px;
    }
    .follow-list-img img{
      width: 100%;
      height: 100%;
    }
    .follow-list-text h2{
      font-size: 15px;
      display: inline-block;
      width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: top;
      white-space: nowrap;
    }
    .follow-list-text .achievement-item span{
      margin-right: 10px;
    }
    .user-info-head .avatar {
      width: 80px;
      height: 80px;
      display: block;
    }
    .set-info-other .name{
      font-size: 15px;
      display: inline-block;
      max-width: 80px;
      overflow:hidden;
      text-overflow:ellipsis;
      vertical-align: top;
      white-space:nowrap;
      margin-right: 10px;
    }
    .edit-btn-small{
      display: inline-block;
      margin-right: 10px;
    }
    .edit-btn-big{
      display: none;
    }
    .examine-status{
      right: 0px;
    }
    .examine-status img{
      width: 70px;
    }
    .user-info-head .avatar-uploader{
      top: -20px;
      left: 6px;
    }
    .user-info-head{
      margin-top: 20px;
      padding: 10px 10px 15px 105px;
    }
    .comment-img-box .item-img{
      margin-right: 6px;
      margin-bottom: 6px;
      width: 46%;
    }
    .news-box li{
      padding: 10px 10px;
    }
  }
  @media only screen and (max-width: 320px){
    .set-info-other .name{
      max-width: 60px;
    }
  }
  @media only screen and (min-width: 768px){
    .user-info-content{
      min-height: 686px;
    }
    .user-info-content .no-passage{
      margin-top: 160px;
    }
  }
</style>
<style>
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
  .set-info-other .el-input__inner{
    border-color: transparent;
    background: #ffffff;
    font-weight: 700;
  }
  .set-info-other .el-form-item{
    margin-bottom: 0px;
  }
  .inputBackround .el-input__inner{
    border-color: #eeeeee;
    background: #f7f7f7;
  }
  .comment_delete .el-dialog{
    max-width: 480px;
    border-radius: 4px;
  }
  .comment_delete .el-dialog__footer{
    height: 40px;
    background: #ffffff;
    padding: 0;
  }
  .comment_delete .el-dialog__footer .el-button{
    width: 50%;
    border: none;
    float: left;
    border-left: 1px solid #e5e5e5;
    border-radius: 0;
    position: relative;
  }
  .comment_delete .el-button+.el-button{
    margin-left: 0;
  }
  .comment_delete .el-dialog__body{
    border-bottom: 1px solid #e5e5e5;
    font-size: 16px;
  }
  .user-info-content .el-tabs__header{
      margin-bottom: 0px;
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
  .passage-status-select {
    border-bottom: 1px solid rgba(238,238,238,1);
  }
  .passage-status-select .el-input__inner{
     border: none;
    height: 60px;
    font-weight: bold;
    color: rgba(102,102,102,1);
    line-height: 60px;
  }
  .passage-status-select .el-select{
    width: 102px;
  }
  @media only screen and (max-width: 768px){
    .set-info-other .el-input__inner{
      width: 110px;
      height: 30px;
      display: block;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap
    }
    .home-el-pagination{
      display: none;
    }
    .home-el-pagination-phone {
      display: block;
      overflow: auto;
    }
    .home-el-pagination-phone div{
      width: 100%;
      text-align: center;
    }
    .set-info-other .el-form-item__content{
      height: 30px;
      line-height: 30px;
    }
    .exchange-btn .el-button--small,.exchange-btn2 a .el-button--small{
      padding: 6px 15px
    }
  }
</style>
