import request from '@/utils/request'
// --------------------------------------车场信息
// 查询车场注册信息
export function getDepotRegister(id) {
  return request({
    url: '/ylyt/personal/list/' + id,
    method: 'get'
  })
}

// 添加车场注册信息
export function addDepotRegister(data) {
  return request({
    url: '/ylyt/personal/add',
    method: 'post',
    data
  })
}

// 修改车场注册信息
export function updateDepotInfo(data) {
  return request({
    url: '/ylyt/park/updatePark',
    method: 'put',
    params: data
  })
}

// 获取验证码
export function registerSmsCode(data) {
  return request({
    url: '/ylyt/personal/registerSmsCode',
    method: 'post',
    data
  })
}

// 获取双乾协议路径和请求参数
export function getConfirmPage(id) {
  return request({
    url: '/ylyt/personal/confirmPage/' + id,
    method: 'get'
  })
}

// 同步协议状态
export function getConfirmStatus(id) {
  return request({
    url: '/ylyt/personal/getConfirmStatus/' + id,
    method: 'get'
  })
}

