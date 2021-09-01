import request from '@/utils/request'

// 查询银行信息
export function getBankList() {
  return request({
    url: '/ylyt/personal/bank',
    method: 'get'
  })
}

// 绑卡
export function bindCard(data) {
  return request({
    url: '/ylyt/personal/bindCard',
    method: 'post',
    data
  })
}

// 打款
export function sponsorRemit(data) {
  return request({
    url: '/ylyt/personal/sendSms',
    method: 'post',
    data
  })
}
