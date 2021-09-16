import request from '@/utils/request'
// --------------------------------------车场信息
// 查询
export function getRecordList(query) {
  return request({
    url: '/park/record/list',
    method: 'get',
    params: query
  })
}

// 清理车辆信息
export function delRecordList(query) {
  return request({
    url: '/park/record/clean_record',
    method: 'delete',
    params: query
  })
}
