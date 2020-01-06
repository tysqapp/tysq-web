/**
 */

/* 中文名字 */
export function ChineseName (str) {
  const reg = /^[\u4e00-\u9fa5\\\\w]+$/
  return reg.test(str.trim())
}
/* 手机电话号码 */
export function phoneNumber (str) {
  const reg = /^(13[0-9]|14[0-9]|15[0-9]|166|17[0-9]|18[0-9]|19[8|9])\d{8}$/
  return reg.test(str.trim())
}
/* 座机电话号码 */
export function flexNumber (str) {
  const reg = /^(0\\d{2}-\\d{8}(-\\d{1,4})?)|(0\\d{3}-\\d{7,8}(-\\d{1,4})?)$/
  return reg.test(str.trim())
}
/* 15位身份证 */
export function userNumber1 (str) {
  const reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/
  return reg.test(str.trim())
}
/* 18位身份证 */
export function userNumber2 (str) {
  const reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
  return reg.test(str.trim())
}
/* 是否是公司邮箱 */
export function isWscnEmail (str) {
  const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
  return reg.test(str.trim())
}

export function Email (str) {
  const reg = /^[_.0-9a-zA-Z]{1,30}@([0-9a-zA-Z]{1,30}\.){1,4}[a-zA-Z]{2,4}$/
  return reg.test((str.toString().trim()))
}

/* 地址邮编 */
export function addressEmail (str) {
  const reg = /^[1-9][0-9]{5}$/
  return reg.test(str.trim())
}

/* 只能中文和英文，不能单纯的数字或者字母，可以单独的汉子 */
export function chineseEnglish (str) {
  const reg = /^(?=.*?[\u4E00-\u9FA5])[\dA-Za-z\u4E00-\u9FA5]+/
  return reg.test(str.trim())
}
/* 只能输入正整数和两位小数的 */
export function intFloat (str) {
  const reg = /(^[0-9]{1,9}$)|(^[0-9]{1,9}[.]{1}[0-9]{1,2}$)/
  return reg.test(str.trim())
}
/* 只能单纯数字和中文 */
export function stringChinese (str) {
  const reg = /^([A-Za-z]|[\u4E00-\u9FA5])+$/
  return reg.test(str.trim())
}
/* 纯中文 */
export function Chinese (str) {
  const reg = /^[\u4e00-\u9fa5]+$/
  return reg.test(str.trim())
}
/* 只能输入正整数 */
export function intNumber (str) {
  const reg = /^\+?[1-9]\d*$/
  return reg.test(str.trim())
}

/* 只能输入正整数和0 */
export function intzeroNumber (str) {
  const reg = /^\+?[0-9]\d*$/
  return reg.test(str.trim())
}
/* 合法uri */
export function validateURL (textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母 */
export function validateLowerCase (str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 验证key */
export function validateKey (str) {
  var reg = /^[a-z_\-:]+$/
  return reg.test(str)
}

/* 验证key */
export function twoDouble (str) {
  var reg = /^\d+(\.\d{1,2})?$/
  return reg.test(str)
}

/* 大写字母 */
export function validateUpperCase (str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母 */
export function validatAlphabets (str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

export function oneOf (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}
/** 验证是否是JSON字符串 */
export function isJsonString (str) {
  try {
    if (typeof JSON.parse(str) === 'object') {
      return true
    }
  } catch (e) {
  }
  return false
}
