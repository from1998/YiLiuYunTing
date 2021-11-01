import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'
/**
 * constantRoutes 常量路由，这些路由由后台的数据控制是否显示
 */
export const constantRoutes = [
  // {
//   path: '/redirect',
//   component: Layout,
//   hidden: true,
//   children: [{
//     path: '/redirect/:path*',
//     component: () =>
//                 import ('@/views/redirect/index')
//   }]
// },
  {
    path: '/login',
    component: () =>
            import ('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () =>
            import ('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () =>
            import ('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () =>
            import ('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/qrcodeAccess/accessIn',
    hidden: true,
    component: () =>
        import ('@/views/qrcodeAccess/accessIn'),
    name: '/qrcodeAccess/accessIn',
    meta: {
      title: '扫码进场',
      icon: 'el-icon-d-arrow-left'
    }
  },
  {
    path: '/qrcodeAccess/accessOutNoPay',
    hidden: true,
    component: () =>
        import ('@/views/qrcodeAccess/accessOutNoPay'),
    name: '/qrcodeAccess/accessOutNoPay',
    meta: {
      title: '扫码出场',
      icon: 'el-icon-d-arrow-right'
    }
  },
  {
    path: '/qrcodeAccess/accessOutPayed',
    hidden: true,
    component: () =>
        import ('@/views/qrcodeAccess/accessOutPayed'),
    name: '/qrcodeAccess/accessOutPayed',
    meta: {
      title: '扫码出场',
      icon: 'el-icon-d-arrow-right'
    }
  },
  {
    path: '/qrcodeAccess/imprest',
    hidden: true,
    component: () =>
        import ('@/views/qrcodeAccess/imprest'),
    name: '/qrcodeAccess/imprest',
    meta: {
      title: '预付款',
      icon: 'money'
    }
  },
  {
    path: '/qrcodeAccess/queryFails',
    hidden: true,
    component: () =>
        import ('@/views/qrcodeAccess/queryFails'),
    name: '/qrcodeAccess/queryFails',
    meta: {
      title: '查询失败',
      icon: 'el-icon-close'
    }
  }
]
export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '/dashboard/index',
      component: () =>
                import ('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/carPlay',
    name: '/carPlay',
    component: () =>
            import ('@/views/carPlay/index'),
    meta: { title: '可视化', icon: 'view' }
  },
  {
    path: '/carManger',
    component: Layout,
    redirect: '/carManger/index',
    name: '/carManger',
    children: [{
      path: 'index',
      name: '/carManger/index',
      component: () => import ('@/views/carManger/index'),
      meta: { title: '固定车', icon: 'car' }
    }]
  },
  {
    path: '/updatePWD',
    component: Layout,
    redirect: '/updatePWD/index',
    name: '/updatePWD',
    hidden: true,
    children: [{
      path: 'index',
      name: '/updatePWD/index',
      component: () =>
                import ('@/views/updatePWD/index'),
      meta: { title: '更改密码' }
    }]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    name: '/guide',
    hidden: true,
    children: [{
      path: 'index',
      name: '/guide/index',
      component: () =>
                import ('@/views/guide/index'),
      meta: { title: '操作指引', noCache: true }
    }]
  },
  {
    path: '/system',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    name: '/system',
    meta: {
      title: '系统管理',
      icon: 'el-icon-menu'
    },
    children: [{
      path: 'user',
      component: () =>
                    import ('@/views/system/user/index'),
      name: '/system/user',
      meta: {
        title: '用户管理',
        icon: 'user'
      }
    },
    {
      path: 'role',
      component: () =>
                    import ('@/views/system/role/index'),
      name: '/system/role',
      meta: {
        title: '角色管理',
        icon: 'peoples'
      }
    },
    {
      path: 'menu',
      component: () =>
                    import ('@/views/system/menu/index'),
      name: '/system/menu',
      meta: {
        title: '菜单管理',
        icon: 'list'
      }
    },
    {
      path: 'dict',
      component: () =>
                    import ('@/views/system/dict/type'),
      name: '/system/dict',
      meta: {
        title: '字典管理',
        icon: 'education'
      }
    },
    {
      path: 'notice',
      component: () =>
                    import ('@/views/system/notice/index'),
      name: '/system/notice',
      meta: {
        title: '通知公告',
        icon: 'notice'
      }
    },
    {
      path: 'log_opt',
      component: () =>
                    import ('@/views/system/operLog/index'),
      name: '/system/log_opt',
      meta: {
        title: '操作日志管理',
        icon: 'tab'
      }
    }
    ]
  },
  {
    path: '/personalCenter',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    name: '/personalCenter',
    meta: {
      title: '个人中心',
      icon: 'user'
    },
    children: [{
      path: 'depotRegister',
      component: () =>
                    import ('@/views/personalCenter/depotRegister'),
      name: '/personalCenter/depotRegister',
      meta: {
        title: '车场注册',
        icon: 'el-icon-document'
      }
    },
    {
      path: 'identityAuth',
      component: () =>
                    import ('@/views/personalCenter/identityAuth'),
      name: '/personalCenter/identityAuth',
      meta: {
        title: '身份认证',
        icon: 'el-icon-circle-check'
      }
    },
    {
      path: 'tiedCard',
      component: () =>
                    import ('@/views/personalCenter/tiedCard'),
      name: '/personalCenter/tiedCard',
      meta: {
        title: '绑卡',
        icon: 'el-icon-bank-card'
      }
    },
    {
      path: 'intoAccountSet',
      component: () =>
                    import ('@/views/personalCenter/intoAccountSet'),
      name: '/personalCenter/intoAccountSet',
      meta: {
        title: '到账设置',
        icon: 'el-icon-coin'
      }
    }
    ]
  },
  {
    path: '/coupons',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    name: '/coupons',
    meta: {
      title: '优惠券',
      icon: 'el-icon-money'
    },
    children: [{
      path: 'couponsManger',
      component: () =>
                    import ('@/views/coupons/couponsManger'),
      name: '/coupons/couponsManger',
      meta: {
        title: '优惠券管理',
        icon: 'el-icon-edit-outline'
      }
    },
    {
      path: 'merchantManger',
      component: () =>
                    import ('@/views/coupons/merchantManger'),
      name: '/coupons/merchantManger',
      meta: {
        title: '商家管理',
        icon: 'el-icon-s-shop'
      }
    },
    {
      path: 'merchantCoupons',
      component: () =>
                    import ('@/views/coupons/merchantCoupons'),
      name: '/coupons/merchantCoupons',
      meta: {
        title: '商家优惠券',
        icon: 'el-icon-money'
      }
    },
    {
      path: 'couponsRecord',
      component: () =>
                    import ('@/views/coupons/couponsRecord'),
      name: '/coupons/couponsRecord',
      meta: {
        title: '优惠券记录',
        icon: 'el-icon-s-claim'
      }
    }
    ]
  },
  {
    path: '/recordsQuery',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    name: '/recordsQuery',
    meta: {
      title: '记录查询',
      icon: 'el-icon-tickets'
    },
    children: [{
      path: 'accessRecord',
      component: () =>
                    import ('@/views/recordsQuery/accessRecord'),
      name: '/recordsQuery/accessRecord',
      meta: {
        title: '进出记录',
        icon: 'access'
      }
    },
    {
      path: 'orderRecord',
      component: () =>
                    import ('@/views/recordsQuery/orderRecord'),
      name: '/recordsQuery/orderRecord',
      meta: {
        title: '订单记录',
        icon: 'el-icon-s-claim'
      }
    }
    ]
  },
  {
    path: '/statisticalForm',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    name: '/statisticalForm',
    meta: {
      title: '统计报表',
      icon: 'el-icon-s-marketing'
    },
    children: [{
      path: 'trafficStatistics',
      component: () =>
                    import ('@/views/statisticalForm/trafficStatistics'),
      name: '/statisticalForm/trafficStatistics',
      meta: {
        title: '车流统计',
        icon: 'car'
      }
    },
    {
      path: 'feeStatistical',
      component: () =>
                    import ('@/views/statisticalForm/feeStatistical'),
      name: '/statisticalForm/feeStatistical',
      meta: {
        title: '收费统计',
        icon: 'money'
      }
    }
    ]
  },
  {
    path: '/monitoringCenter',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    name: '/monitoringCenter',
    meta: {
      title: '监控中心',
      icon: 'monitoring'
    },
    children: [{
      path: 'quickMonitoring',
      component: () =>
                    import ('@/views/monitoringCenter/quickMonitoring'),
      name: '/monitoringCenter/quickMonitoring',
      meta: {
        title: '快捷监控',
        icon: 'monitoring'
      }
    },
    {
      path: 'feeRule',
      component: () =>
                    import ('@/views/monitoringCenter/feeRule'),
      name: '/monitoringCenter/feeRule',
      meta: {
        title: '收费规则',
        icon: 'money'
      }
    },
    {
      path: 'accessRecord',
      component: () =>
                    import ('@/views/monitoringCenter/accessRecord'),
      name: '/monitoringCenter/accessRecord',
      meta: {
        title: '进出记录',
        icon: 'access'
      }
    },
    {
      path: 'deviceStates',
      component: () =>
                    import ('@/views/monitoringCenter/deviceStates'),
      name: '/monitoringCenter/deviceStates',
      meta: {
        title: '设备状态',
        icon: 'equipment'
      }
    }
    ]
  },
  {
    path: '/qrcodeAccess',
    component: Layout,
    redirect: '/qrcodeAccess/index',
    name: '/qrcodeAccess',
    children: [
      {
        path: 'index',
        name: '/qrcodeAccess/index',
        component: () => import ('@/views/qrcodeAccess/index'),
        meta: { title: '扫码相关', icon: 'qrcode' }
      }
    ]
  },
  {
    path: 'http://www.ahdvl.com/',
    component: Layout,
    name: '/companyLink',
    meta: { title: '公司官网', icon: 'link' }
  }
]
export const lastRoute = [{
  path: '/dict',
  component: Layout,
  hidden: true,
  children: [{
    path: 'data/:dictId(\\d+)',
    component: () =>
                import ('@/views/system/dict/data'),
    name: '/dict',
    meta: { title: '数据字典' }
  }]
},
{
  path: '/user',
  component: Layout,
  hidden: true,
  children: [{
    path: 'carSetting/:id(\\d+)',
    component: () =>
                import ('@/views/system/user/carSetting'),
    name: '/carSetting',
    meta: { title: '车场设置', noCache: true }
  }]
},
{
  path: '/carManger/index',
  component: Layout,
  hidden: true,
  children: [{
    path: 'renewHistory/:id(\\d+)',
    component: () =>
                import ('@/views/carManger/renewHistory'),
    name: '/renewHistory',
    meta: { title: '续费历史', noCache: true }
  }]
},
// 404 page must be placed at the end !!!
{ path: '*', redirect: '/404', hidden: true }
]
const createRouter = () => new Router({
  // 路由模式
  mode: 'history',
  // require service support
  scrollBehavior: () => ({ y: 0 }),
  // 初始化时将所有路由都加载上，否则会出现刷新页面404的情况
  routes: constantRoutes
})
const router = createRouter()
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router
