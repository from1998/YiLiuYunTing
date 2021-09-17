import request from '@/utils/request'
// --------------------------------------进出记录
// 查询
export function getRecordList(query) {
  return request({
    url: '/park/record/list',
    method: 'get',
    params: query
  })
}

// 清理离场车辆信息
export function cleanLeaveRecord() {
  return request({
    url: '/park/record/clean_leave_record',
    method: 'delete'
  })
}

// 清理在场车辆信息
export function cleanEnterRecord(days) {
  return request({
    url: '/park/record/clean_record/' + days,
    method: 'delete'
  })
}
