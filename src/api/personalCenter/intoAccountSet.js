import request from '@/utils/request'

// 自动到账
export function autoWithdraw(data) {
  return request({
    url: '/ylyt/personal/autoWithdraw',
    method: 'post',
    data
  })
}

// 获取自动到账验证码
export function autoWithdrawSms(id) {
  return request({
    url: '/ylyt/personal/autoWithdrawSms/' + id,
    method: 'get'
  })
}

