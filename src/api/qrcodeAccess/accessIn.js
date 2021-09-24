import request from '@/utils/request'

// 获取扫码进场数据
export function getEnterData(query) {
  return request({
    url: '/third/no_plate_enter_data',
    method: 'get',
    params: query
  })
}

