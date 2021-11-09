import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import * as filters from './filters' // global filters
// 大屏可视化插件
import dataV from '@jiaminghi/data-view'
Vue.use(dataV)
// 粒子效果插件
import VueParticles from 'vue-particles'
Vue.use(VueParticles)

import { getUserInfo } from '@/utils/auth'
import { getDataByType } from '@/api/system/dict/data'
import { resetForm, addDateRange, selectDictLabel, selectRoleLabel, handleTree, Utils, getDataByMoreType, convertCarCategory, encode64 } from '@/utils/his-utils'
// 全局方法挂载
Vue.prototype.getUserInfo = getUserInfo
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectRoleLabel = selectRoleLabel
Vue.prototype.convertCarCategory = convertCarCategory
Vue.prototype.getDataByType = getDataByType // 加载全局的根据字典类型查询字典的方法[基本每个页面都要使用]
Vue.prototype.handleTree = handleTree // 挂载全局的构造树的JSON的方法
Vue.prototype.Utils = Utils// 挂载全局计算时段的方法
Vue.prototype.getDataByMoreType = getDataByMoreType // 加载全局的根据字典类型查询字典的方法[基本每个页面都要使用]
Vue.prototype.encode64 = encode64 // 加密解密
Vue.prototype.bus = new Vue() // 加载全局的根据字典类型查询字典的方法[基本每个页面都要使用]
// 挂载全局消息框
Vue.prototype.msgSuccess = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'success', center: true })
}
Vue.prototype.msgError = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'error', center: true })
}
Vue.prototype.msgInfo = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'info', center: true })
}
Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
