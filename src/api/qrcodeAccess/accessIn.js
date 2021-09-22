import request from '@/utils/request'

export function getEnterData(query) {
  return request({
    url: '/third/no_plate_enter_data',
    method: 'get',
    params: query
  })
}

