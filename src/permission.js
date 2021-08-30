import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, setMenu, getMenu } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // 设置标题
  document.title = getPageTitle(to.meta.title)
  // 获取当前页面的token
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果是登陆路径 直接跳转到首页
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // 判断用户是否有角色
      const hasRoles = store.getters.name !== ''
      if (hasRoles) {
        const menu = getMenu()
        // 目前暂时无法理解
        if (menu) {
          next()
        } else {
          // 获取用户信息
          await store.dispatch('user/getInfo')
          // 构造动态路由【菜单和权限】
          // const accessRoutes = await store.dispatch('permission/generateRoutes', ['admin'])
          const accessRoutes = await store.dispatch('menu/getMenus')
          // 动态添加路由
          router.addRoutes(accessRoutes)
          setMenu('menu')
          next({ ...to, replace: true })
        }
      } else {
        try {
          // 获取用户信息
          const info = await store.dispatch('user/getInfo')
          console.log(info)
          // 构造动态路由【菜单和权限】
          // const accessRoutes = await store.dispatch('permission/generateRoutes', ['admin'])
          const accessRoutes = await store.dispatch('menu/getMenus')
          // 动态添加路由
          router.addRoutes(accessRoutes)
          setMenu('menu')
          next({ ...to, replace: true })
        } catch (error) {
          // 如果异常，跳转到登陆页面
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 如果没有token也跳转到登陆页面
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
