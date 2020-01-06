import * as http from './instance'
let apiHeader = process.env.API_ROOT
// let apiHeader = `/api/v5`
/**
 *
 * @param {} params
 */

/**
 * register
 */
export const userRegister = params => {
  return http.p(
    apiHeader + `/account/register`,
    params,
    false
  )
}

/**
 * 获取websocketToken
 */
export const scoketToken = params => {
  return http.g(
    apiHeader + `/notify/token`,
    params,
    false
  )
}

/**
 * captcha
 */
export const getCaptcha = params => {
  return http.g(
    `/captcha/email`,
    params,
    false,
    ''
  )
}

/**
 * base64
 */
export const picBase64 = params => {
  return http.g(
    `/captcha/base64`,
    params,
    false
  )
}

/**
 * login
 */
export const userLogin = params => {
  return http.p(
    apiHeader + `/account/login`,
    params,
    false
  )
}

/**
 * logout
 */
export const userLogout = params => {
  return http.p(
    apiHeader + `/account/logout`,
    params,
    false
  )
}

/**
 * get password
 */
export const getPassword = params => {
  return http.u(
    apiHeader + `/account/password/reset`,
    params,
    false
  )
}

/**
 * change password
 */
export const changePassword = params => {
  return http.u(
    apiHeader + `/account/password`,
    params,
    false
  )
}

/**
 * verify
 */
export const getverify = params => {
  return http.g(
    apiHeader + `/account/email/verify`,
    params,
    false
  )
}
/**
 * user info
 */
export const userInfo = params => {
  return http.g(
    apiHeader + `/account/info`,
    params,
    false
  )
}

/**
 * category
 */
export const userCategory = params => {
  return http.g(
    apiHeader + `/article/category`,
    params,
    false,
    '加载中'
  )
}

/**
 * pageList
 */
export const articleLists = params => {
  return http.g(
    apiHeader + `/article/list`,
    params,
    true,
    '加载中'
  )
}

/**
 * 推荐文章列表
 */
export const recomendLists = params => {
  return http.g(
    apiHeader + `/article/recommend/list`,
    params,
    false,
    '加载中'
  )
}
/**
 * 近期评论List
 */
export const commentLists = params => {
  return http.g(
    apiHeader + `/article/comment/recent`,
    params,
    false,
    '加载中'
  )
}

/**
 * 文章详情
 */
export const passageInfo = params => {
  return http.g(
    apiHeader + `/article/info`,
    params,
    true,
    '加载中'
  )
}

/**
 * 修改文章获取文章信息
 */
export const passageEdit = params => {
  return http.g(
    apiHeader + `/article/edit`,
    params,
    true
  )
}

/**
 * 创建标签
 */
export const createLabel = params => {
  return http.p(
    apiHeader + `/article/label`,
    params,
    false
  )
}

/**
 * 发表文章
 */
export const postPassage = params => {
  return http.p(
    apiHeader + `/article`,
    params,
    true,
    '提交中'
  )
}

/**
 * 文章评论列表
 */
export const passageCommentLists = params => {
  return http.g(
    apiHeader + `/article/comment/list`,
    params,
    false,
    '加载中'
  )
}

/**
 * 发表评论
 */
export const releaseComment = params => {
  return http.p(
    apiHeader + `/article/comment`,
    params,
    true
  )
}

/**
 * 删除评论
 */
export const deleteComment = params => {
  return http.d(
    apiHeader + `/article/comment`,
    params,
    false,
    '删除中'
  )
}

/**
 * 展开二级评论
 */
export const secondComment = params => {
  return http.g(
    apiHeader + `/article/subcomment/list`,
    params,
    false,
    ''
  )
}

/**
 * 获取个人云盘附件列表
 */
export const getMyFileList = params => {
  return http.g(
    apiHeader + `/account/file/list`,
    params,
    false,
    ''
  )
}

/**
 * 删除个人云盘附件列表
 */
export const deleteMyFileList = params => {
  return http.d(
    apiHeader + `/account/file`,
    params,
    false
  )
}

/**
 * 获取标签列表
 */
export const getLabel = params => {
  return http.g(
    apiHeader + `/article/label`,
    params,
    false
  )
}

/**
 * 获取文件信息
 */
export const getFileInfo = params => {
  return http.g(
    apiHeader + `/upload_file/info`,
    params,
    false
  )
}
/**
 * 合并分片文件
 */
export const mergeFile = params => {
  return http.u(
    apiHeader + `/upload_file`,
    params,
    false
  )
}

/**
 * 修改用户个人信息接口
 */
export const changeUserInfo = params => {
  return http.u(
    apiHeader + `/account/info`,
    params,
    false
  )
}

/**
 * 上传视频封面
 */
export const uploadCover = params => {
  return http.p(
    apiHeader + `/account/video_cover`,
    params,
    false
  )
}

/**
 * 获取当前登录用户文章列表
 */
export const userInfoArticleLists = params => {
  return http.g(
    apiHeader + `/account/articles`,
    params,
    true
  )
}

/**
 * 获取用户个人评论列表
 */
export const userInfoCommentsLists = params => {
  return http.g(
    apiHeader + `/account/comments`,
    params,
    true
  )
}

/**
 * 更新文章
 */
export const updatePassage = params => {
  return http.u(
    apiHeader + `/article`,
    params,
    true
  )
}

/**
 * 绑定邮箱
 */
export const bindEmail = params => {
  return http.u(
    apiHeader + `/account/email`,
    params,
    false
  )
}

/**
 * 获取好友列表和推荐码
 */
export const getFriends = params => {
  return http.g(
    apiHeader + `/account/invite/friend`,
    params,
    false
  )
}

/**
 * 获取好友列表和推荐码
 */
export const getScoreJudgement = params => {
  return http.g(
    apiHeader + `/account/score/judgement`,
    params,
    false
  )
}

/**
 * 获取用户金币明细
 */
export const getCoinDetailed = params => {
  return http.g(
    apiHeader + `/account/coin`,
    params,
    false
  )
}

/**
 * 积分明细
 */
export const scoreDetail = params => {
  return http.g(
    apiHeader + `/account/score_detail`,
    params,
    false
  )
}

/**
 * 积分订单
 */
export const scoreOrder = params => {
  return http.g(
    apiHeader + `/account/score_order`,
    params,
    false
  )
}

/**
 * 金币订单
 */
export const coinOrder = params => {
  return http.g(
    apiHeader + `/account/coin_order`,
    params,
    false
  )
}

/**
 * 购买积分
 */
export const buyScore = params => {
  return http.p(
    apiHeader + `/account/create_order`,
    params,
    false
  )
}

/**
 * 获取积分等级金币解读配置
 */
export const getConfiguration = params => {
  return http.p(
    apiHeader + `/account/configuration`,
    params,
    false
  )
}

/**
 * 获取广告信息
 */
export const getAdvertisement = params => {
  return http.g(
    apiHeader + `/article/advertisement`,
    params,
    false
  )
}

/**
 * 获取新的广告信息
 */
export const getNotices = params => {
  return http.g(
    apiHeader + `/article/announcements`,
    params,
    false
  )
}
/**
 *邀请注册好友
 */
export const getInviteLink = params => {
  return http.p(
    apiHeader + `/account/click/invite_link`,
    params,
    false
  )
}

/**
 *收藏，取消收藏
 */
export const collectOperate = params => {
  return http.u(
    apiHeader + `/article/collect`,
    params,
    false
  )
}

/**
 *个人收藏列表
 */
export const collectList = params => {
  return http.g(
    apiHeader + `/account/collects`,
    params,
    true
  )
}

/**
 *文章详情验证码
 */
export const detailCaptcha = params => {
  return http.g(
    apiHeader + `/article/captcha`,
    params,
    false
  )
}

/**
 *文章详情验证码
 */
export const articleCaptcha = params => {
  return http.p(
    apiHeader + `/article/captcha`,
    params,
    false
  )
}

/**
 *用户金币提现
 */
export const postWithdraw = params => {
  return http.p(
    apiHeader + `/account/withdraw`,
    params,
    false
  )
}

/**
 *获取金币对应比特币数
 */
export const getBtc = params => {
  return http.g(
    apiHeader + `/account/btc_rate`,
    params,
    false
  )
}

/**
 *用户金币提现记录
 */
export const gettWithdrawList = params => {
  return http.g(
    apiHeader + `/account/withdraws`,
    params,
    false
  )
}

/**
 *获取用户审核驳回原因
 */
export const getRejectReason = params => {
  return http.g(
    apiHeader + `/account/withdraw/reason`,
    params,
    false
  )
}

/**
 *文章审核
 */
export const reviewArticle = params => {
  return http.u(
    apiHeader + `/article/review`,
    params,
    false
  )
}

/**
 *api公共部分
 */
export const apiTitle = apiHeader

/**
 *禁止评论列表
 */
export const banCommitList = params => {
  return http.g(
    apiHeader + `/account/comment_blacklist`,
    params,
    false
  )
}

/**
 *获取版主权利分类
 */
export const moderatorCategorys = params => {
  return http.g(
    apiHeader + `/account/moderator_categorys`,
    params,
    false
  )
}

/**
 *禁止评论
 */
export const forbidComment = params => {
  return http.p(
    apiHeader + `/account/forbid_comment`,
    params,
    false
  )
}

/**
 *版主权限判断
 */
export const permissionJudgement = params => {
  return http.g(
    apiHeader + `/account/permission/judgement`,
    params,
    false
  )
}

/**
 *删除文章
 */
export const deleteArticle = params => {
  return http.d(
    apiHeader + `/article`,
    params,
    false
  )
}

/**
 *获取用户被评论
 */
export const hasForbid = params => {
  return http.g(
    apiHeader + `/account/forbid_categorys`,
    params,
    false
  )
}

/**
 *获取版主权利分类
 */
export const rightsClass = params => {
  return http.g(
    apiHeader + `/account/moderator_categorys`,
    params,
    false
  )
}

/**
 *获取禁止评论原因
 */
export const forbidReason = params => {
  return http.g(
    apiHeader + `/account/forbid_comment`,
    params,
    false
  )
}

/**
 *获取文章审核列表
 */
export const reviewArticlesList = params => {
  return http.g(
    apiHeader + `/account/review_articles`,
    params,
    true
  )
}

/**
 *通知列表
 */
export const notifications = params => {
  return http.g(
    apiHeader + `/notify/notifications`,
    params,
    true
  )
}

/**
 *获取用户订阅配置
 */
export const subconfigs = params => {
  return http.g(
    apiHeader + `/notify/sub_configs`,
    params,
    false
  )
}

/**
 *更新用户订阅配置
 */
export const Updatesubconfigs = params => {
  return http.u(
    apiHeader + `/notify/sub_configs`,
    params,
    false
  )
}

/**
 *获取未读消息
 */
export const getUnreadCount = params => {
  return http.g(
    apiHeader + `/notify/unread_count`,
    params,
    false
  )
}

/**
 *设置通知已读
 */
export const putReaded = params => {
  return http.u(
    apiHeader + `/notify/read`,
    params,
    false
  )
}

/**
 *获取版主待审核信息
 */
export const getModerUnreadCount = params => {
  return http.g(
    apiHeader + `/article/count_info`,
    params,
    false
  )
}

/**
 *举报文章
 */
export const postReportsArticle = params => {
  return http.p(
    apiHeader + `/reports`,
    params,
    true
  )
}

/**
 *文章举报列表
 */
export const getReportsList = params => {
  return http.g(
    apiHeader + `/reports`,
    params,
    false
  )
}

/**
 *举报处理
 */
export const manageReports = params => {
  return http.u(
    apiHeader + `/reports`,
    params,
    false
  )
}

/**
 *关注列表
 */
export const attentionsList = params => {
  return http.g(
    apiHeader + `/account/attentions`,
    params,
    false
  )
}

/**
 *添加/取消关注
 */
export const attentionsAction = params => {
  return http.p(
    apiHeader + `/account/attentions`,
    params,
    false
  )
}

/**
 *粉丝列表
 */
export const fansList = params => {
  return http.g(
    apiHeader + `/account/fans`,
    params,
    false
  )
}

/**
*举报处理记录
*/
export const manageReportsRecord = (id, params) => {
  return http.g(
    apiHeader + `/reports/${id}/operations`,
    params,
    false
  )
}

/**
 *举报详情
 */
export const reportsDetails = (id, params) => {
  return http.g(
    apiHeader + `/reports/${id}`,
    params,
    false
  )
}

/**
 *搜索结果
 */
export const searchResult = params => {
  return http.g(
    apiHeader + `/search`,
    params,
    false
  )
}

/**
 *修改文件名称
 */
export const changeFileName = (id, params) => {
  return http.u(
    apiHeader + `/files/${id}`,
    params,
    false
  )
}

/**
 *下载具体文件
 */
export const downloadFile = (id, filename) => {
  return apiHeader + `/files/${id}/${filename}`
}

/**
 *下载文件流
 */
export const filestream = (url, params) => {
  return http.gstream(
    url,
    params,
    true,
    '下载中'
  )
}

/**
 *文章详情绝对路径下载
 */
export const passageDetailStream = (url, params) => {
  return http.gstream(
    url,
    params,
    true,
    '下载中'
  )
}

/**
 *文章隐藏
 */
export const passageHidden = (id, params) => {
  return http.u(
    apiHeader + `/articles/${id}/state`,
    params,
    false
  )
}

/**
 *视频下载积分判断
 */
export const videoJudement = (id, params) => {
  return http.g(
    apiHeader + `/original_videos/${id}/judgement`,
    params,
    false
  )
}

/**
 *置顶文章
 */
export const setTopArticle = (id, params) => {
  return http.u(
    apiHeader + `/articles/${id}/top`,
    params,
    false
  )
}

/**
 *打赏文章
 */
export const rewardArticle = params => {
  return http.p(
    apiHeader + `/article/reward`,
    params,
    false
  )
}

/**
 *文章详情打赏列表
 */
export const rewardArticleList = (id, params) => {
  return http.g(
    apiHeader + `/articles/${id}/reward_records`,
    params,
    false
  )
}

/**
 *积分金币配置
 */
export const coinConfigurations = (params) => {
  return http.p(
    apiHeader + `/account/configurations`,
    params,
    false
  )
}

/**
 *获取积分金币配置
 */
export const getCoinConfigurations = (params) => {
  return http.g(
    apiHeader + `/account/configurations`,
    params,
    false
  )
}

/**
 *设置通知全部已读
 */
export const setAllRead = (params) => {
  return http.u(
    apiHeader + `/notify/state`,
    params,
    false
  )
}

/**
 *置顶文章列表
 */
export const getTopArticle = (params) => {
  return http.g(
    apiHeader + `/top_articles`,
    params,
    false
  )
}

/**
 *获取积分等级换算关系
 */
export const GradeCoinRelations = (params) => {
  return http.g(
    apiHeader + `/account/relations`,
    params,
    false
  )
}

/**
 *购买积分跳转
 */
export const buyScoreLink = '/api/pages/buy_score'

/**
 *购买金币跳转
 */
export const buyCoinLink = '/api/pages/buy_coin'

/**
 *邀请好友
 */
export const inviteFriendsH5 = '/api/pages/invite_friend'

/**
 *用户协议跳转
 */
export const userAgreementLink = '/api/pages/agreement'

/**
 *金币/积分/等级引导说明跳转
 */
export const explainGuideLink = (type) => {
  return `api/pages/score_coin_guide/${type}`
}

/**
 *app下载页跳转
 */
export const downloadAppLink = '/api/pages/download_app'

/**
 *点击邀请链接跳转
 */
export const inviteFriendLink = '/api/pages/invite_link'

/**
 *推广活动页跳转
 */
export const promotionLink = '/api/pages/promotion'
