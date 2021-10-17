import request from '@/utils/request'

// 分页查询
export function getListCouponsRecord(query) {
  return request({
    url: '/ylyt/merchant/getListCouponsRecord',
    method: 'get',
    params: query
  })
}

// 删除过期优惠券和异常优惠券
export function cleanErrorRecord(query) {
  return request({
    url: '/ylyt/merchant/deleteError/' + query,
    method: 'delete'
  })
}

