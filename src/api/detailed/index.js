import request from '@/utils/request'

// 分页查询
export function getListByPage(query) {
  return request({
    url: '/ylyt/profit/getListByPage',
    method: 'get',
    params: query
  })
}
