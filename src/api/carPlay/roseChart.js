import request from '@/utils/request'

export function getMoneyData() {
  return request({
    url: '/ylyt/park/bigAllMoney',
    method: 'get'
  })
}
