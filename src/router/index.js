import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'
/**
 * constantRoutes 常量路由，这些路由由后台的数据控制是否显示
 */
export const constantRoutes = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path*',
    component: () =>
                import ('@/views/redirect/index')
  }]
},
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
  component: () =>
            import ('@/views/qrcodeAccess/accessIn'),
  meta: {
    title: '扫码进场',
    icon: 'el-icon-d-arrow-left'
  }
},
{
  path: '/qrcodeAccess/accessOut',
  component: () =>
            import ('@/views/qrcodeAccess/accessOut'),
  meta: {
    title: '扫码出场',
    icon: 'el-icon-d-arrow-right'
  }
},
{
  path: '/qrcodeAccess/imprest',
  component: () =>
            import ('@/views/qrcodeAccess/imprest'),
  meta: {
    title: '预付款',
    icon: 'money'
  }
},
{
  path: '/qrcodeAccess/queryFails',
  component: () =>
            import ('@/views/qrcodeAccess/queryFails'),
  meta: {
    title: '查询失败',
    icon: 'el-icon-close'
  }
}
]
export const asyncRoutes = [{
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
    component: () =>
                import ('@/views/carManger/index'),
    meta: { title: '固定车', icon: 'car', noCache: true }
  }]
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
  }
  ]
},
{
  path: '/system',
  component: Layout,
  redirect: 'noRedirect',
  alwaysShow: true,
  name: '/system',
  meta: {
    title: '系统管理',
    icon: 'lock'
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
      icon: 'tab'
    }
  },
  {
    path: 'menu',
    component: () =>
                    import ('@/views/system/menu/index'),
    name: '/system/menu',
    meta: {
      title: '菜单管理',
      icon: 'bug'
    }
  },
  {
    path: 'dict',
    component: () =>
                    import ('@/views/system/dict/type'),
    name: '/system/dict',
    meta: {
      title: '字典管理',
      icon: 'zip'
    }
  },
  {
    path: 'notice',
    component: () =>
                    import ('@/views/system/notice/index'),
    name: '/system/notice',
    meta: {
      title: '通知公告',
      icon: 'theme'
    }
  },
  {
    path: 'log_opt',
    component: () =>
                    import ('@/views/system/operLog/index'),
    name: '/system/log_opt',
    meta: {
      title: '操作日志管理',
      icon: 'clipboard'
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
  path: '/account',
  component: Layout,
  redirect: 'noRedirect',
  name: '/account',
  meta: { title: '账号管理', icon: 'el-icon-s-tools' },
  children: [{
    path: 'platform',
    component: () =>
                    import ('@/views/account/platform/index'),
    name: '/account/platform',
    meta: { title: '平台账号', icon: 'list' }
  },
  {
    path: 'agent',
    component: () =>
                    import ('@/views/account/agent/index'),
    name: '/account/agent',
    meta: { title: '代理商账号', icon: 'list' }
  },
  {
    path: 'estate',
    component: () =>
                    import ('@/views/account/estate/index'),
    name: '/account/estate',
    meta: { title: '物业账号', icon: 'list' }
  }, {
    path: 'plot',
    component: () =>
                    import ('@/views/account/plot/index'),
    name: '/account/plot',
    meta: { title: '小区账号', icon: 'list' }
  }
  ]
},
{
  path: '/statistics',
  component: Layout,
  redirect: 'noRedirect',
  name: '/statistics',
  meta: {
    title: '数据统计',
    icon: 'example'
  },
  children: [{
    path: 'revenue',
    component: () =>
                    import ('@/views/statisics/revenue/index'),
    name: '/statistics/revenue',
    meta: { title: '收支统计', icon: 'edit' }
  },
  {
    path: 'sales',
    component: () =>
                    import ('@/views/statisics/drug/index'),
    name: '/statistics/sales',
    meta: { title: '药品销售统计', icon: 'list' },
    hidden: true
  },
  {
    path: 'check',
    component: () =>
                    import ('@/views/statisics/check/index'),
    name: '/statistics/check',
    meta: { title: '检查项目统计', icon: 'list' }
  },
  {
    path: 'workload',
    component: () =>
                    import ('@/views/statisics/workload/index'),
    name: '/statistics/workload',
    meta: { title: '工作量统计', icon: 'list' }
  }
  ]
},
{
  path: '/stock',
  component: Layout,
  redirect: 'noRedirect',
  name: '/stock',
  meta: {
    title: '药品进销存',
    icon: '404'
  },
  children: [{
    path: 'producter',
    component: () =>
                    import ('@/views/erp/producter/index'),
    name: '/stock/producter',
    meta: { title: '生产厂家维护', icon: 'list' }
  },
  {
    path: 'medicinal',
    component: () =>
                    import ('@/views/erp/medicines/index'),
    name: '/stock/medicinal',
    meta: { title: '药品信息维护', icon: 'list' }
  },
  {
    path: 'provider',
    component: () =>
                    import ('@/views/erp/provider/index'),
    name: '/stock/provider',
    meta: { title: '供应商维护', icon: 'list' }
  },
  {
    path: 'purchase',
    component: () =>
                    import ('@/views/erp/purchase/index'),
    name: '/stock/purchase',
    meta: { title: '采购入库列表', icon: 'list' }
  },
  {
    path: 'examine',
    component: () =>
                    import ('@/views/erp/purchase/auditList'),
    name: '/stock/examine',
    meta: { title: '入库审核', icon: 'list' }
  },
  {
    path: 'inventory',
    component: () =>
                    import ('@/views/erp/inventoryLog/index'),
    name: '/stock/inventory',
    meta: { title: '库存查询', icon: 'list' }
  }
  ]
},
{
  path: '/charge',
  component: Layout,
  redirect: 'noRedirect',
  name: '/charge',
  meta: {
    title: '收费管理',
    icon: 'excel'
  },
  children: [{
    path: 'charge',
    component: () =>
                    import ('@/views/doctor/charge/charge'),
    name: '/charge/docharge',
    meta: { title: '处方收费', icon: 'list' }
  },
  {
    path: 'chargelist',
    component: () =>
                    import ('@/views/doctor/charge/chargelist'),
    name: '/charge/chargelist',
    meta: { title: '收费查询', icon: 'list' }
  },
  {
    path: 'backfee',
    component: () =>
                    import ('@/views/doctor/backfee/backfee'),
    name: '/charge/backfee',
    meta: { title: '处方退费', icon: 'list' }
  },
  {
    path: 'backfeelist',
    component: () =>
                    import ('@/views/doctor/backfee/backfeelist'),
    name: '/charge/backfeelist',
    meta: { title: '退费查询', icon: 'list' }
  },
  {
    path: 'dispensing',
    component: () =>
                    import ('@/views/doctor/handleMedicine/index'),
    name: '/charge/dispensing',
    meta: { title: '处方发药', icon: 'list' }
  }
  ]
},
{
  path: '/check',
  component: Layout,
  redirect: 'noRedirect',
  name: '/check',
  meta: {
    title: '检查管理',
    icon: 'excel'
  },
  children: [{
    path: 'docheck',
    component: () =>
                    import ('@/views/doctor/checkResult/newcheck'),
    name: '/check/docheck',
    meta: { title: '新开检查', icon: 'list' }
  },
  {
    path: 'checkresult',
    component: () =>
                    import ('@/views/doctor/checkResult/checking'),
    name: '/check/checkresult',
    meta: { title: '检查结果录入', icon: 'list' }
  },
  {
    path: 'checklist',
    component: () =>
                    import ('@/views/doctor/checkResult/checklist'),
    name: '/check/checklist',
    meta: { title: '检查结果查询', icon: 'list' }
  }
  ]
},
{
  path: '/doctor',
  component: Layout,
  redirect: 'noRedirect',
  name: '/doctor',
  meta: {
    title: '看病就诊',
    icon: 'excel'
  },
  children: [{
    path: 'registered',
    component: () =>
                    import ('@/views/doctor/registration/index'),
    name: '/doctor/registered',
    meta: { title: '门诊挂号', icon: 'list' }
  },
  {
    path: 'registeredlist',
    component: () =>
                    import ('@/views/doctor/registration/list'),
    name: '/doctor/registeredlist',
    meta: { title: '挂号列表', icon: 'list' }
  },
  {
    path: 'newcare',
    component: () =>
                    import ('@/views/doctor/care/index'),
    name: '/doctor/newcare',
    meta: { title: '新开就诊', icon: 'list' }
  },
  {
    path: 'myscheduling',
    component: () =>
                    import ('@/views/doctor/scheduling/myscheduling'),
    name: '/doctor/myscheduling',
    meta: { title: '我的排班', icon: 'list' }
  },
  {
    path: 'scheduling',
    component: () =>
                    import ('@/views/doctor/scheduling/index'),
    name: '/doctor/scheduling',
    meta: { title: '医生排班', icon: 'list' }
  },
  {
    path: 'patient',
    component: () =>
                    import ('@/views/doctor/patient/index'),
    name: '/doctor/patient',
    meta: { title: '患者库', icon: 'list' }
  }
  ]
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
{
  path: '/erp/purchase',
  component: Layout,
  hidden: true,
  children: [{
    path: 'newPurchase',
    component: () =>
                    import ('@/views/erp/purchase/newPurchase'),
    name: '/erp/purchase/newPurchase',
    meta: { title: '采购入库', icon: 'list' }
  },
  {
    path: 'editPurchase/:purchaseId',
    component: () =>
                    import ('@/views/erp/purchase/editPurchase'),
    name: '/erp/purchase/editPurchase',
    meta: { title: '采购入库修改', icon: 'list' }
  }
  ]
},
// 404 page must be placed at the end !!!
{ path: '*', redirect: '/404', hidden: true }
]
const createRouter = () => new Router({
  // 路由模式
  mode: 'history', // require service support
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
