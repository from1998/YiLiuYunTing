import request from '@/utils/request'

// 获取扫码出场数据
export function getLeaveData(query) {
  return request({
    url: '/third/index_data',
    method: 'get',
    params: query
  })
}

