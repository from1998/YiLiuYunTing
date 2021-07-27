import request from '@/utils/request'
// 首页仪表盘配置
export function getPanelGroup() {
  return request({
    url: '/ylyt/park/home',
    method: 'get'
  })
}
