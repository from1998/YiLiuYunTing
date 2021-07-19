import defaultSettings from '@/settings'

const title = defaultSettings.title || '一流云停后台管理'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} : ${title}`
  }
  return `${title}`
}
