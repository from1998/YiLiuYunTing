/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  // 不在验证数组里的用户将无法通过登陆验证
  const valid_map = ['yiliuyunting', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

// 车牌号
export function carPhoneValid(rule, value, callback) {
  const plateNumber = /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})$/
  if (plateNumber.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的车牌号'))
  }
}

// 手机号
/* 是否手机号码*/
export function phoneValid(rule, value, callback) {
  const validReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
  if (validReg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的手机号码'))
  }
}

// 身份证号码验证
export function IDCardValid(rule, value, callback) {
  const validReg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  if (validReg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的身份证号码'))
  }
}

// 不能为空
export function notEmptyValid(rule, value, callback) {
  let str = value
  // if (value instanceof Array) {
  //   if (value.length === 0) {
  //     callback(new Error('该字段不能为空'))
  //   } else {
  //     callback()
  //   }
  // } else {
  if (typeof (value) !== 'string') {
    str = String(value)
  }
  // }
  if (str.trim() !== '' && str !== 'undefined' && str !== 'null') {
    callback()
  } else {
    callback(new Error('该字段不能为空'))
  }
}

export default {
  carNumber: [
    { required: true, validator: carPhoneValid, trigger: 'blur' }
  ],
  phone: [
    { required: true, validator: phoneValid, trigger: 'blur' }
  ],
  idNumber: [
    { required: true, validator: IDCardValid, trigger: 'blur' }
  ],
  notEmpty: [
    { required: true, validator: notEmptyValid, trigger: 'blur' }
  ]
}

