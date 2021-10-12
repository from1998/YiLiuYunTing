import request from '@/utils/request'

export function getRankingData() {
  return request({
    url: '/ylyt/park/bigMoneyList',
    method: 'get'
  })
}
