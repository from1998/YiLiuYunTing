import defaultSettings from '@/settings'

const title = defaultSettings.title || '智慧城市视频共享数据交互平台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} : ${title}`
  }
  return `${title}`
}
