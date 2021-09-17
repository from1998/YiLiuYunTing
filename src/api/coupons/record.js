import request from '@/utils/request'

// 分页查询
export function getListCouponsRecord(query) {
  return request({
    url: '/ylyt/merchant/getListCouponsRecord',
    method: 'get',
    params: query
  })
}
