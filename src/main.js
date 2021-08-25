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
import moment from 'moment'
// 大屏可视化插件
import dataV from '@jiaminghi/data-view'
Vue.use(dataV)
// 粒子效果插件
import VueParticles from 'vue-particles'
Vue.use(VueParticles)

import { getDataByType } from '@/api/system/dict/data'
import { resetForm, addDateRange, selectDictLabel, selectRoleLabel, handleTree, getAge, getCurrentTimeType, getDataByMoreType, convertCarCategory } from '@/utils/his-utils'
// 全局方法挂载
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectRoleLabel = selectRoleLabel
Vue.prototype.convertCarCategory = convertCarCategory
Vue.prototype.getDataByType = getDataByType // 加载全局的根据字典类型查询字典的方法[基本每个页面都要使用]
Vue.prototype.handleTree = handleTree // 挂载全局的构造树的JSON的方法
Vue.prototype.getAge = getAge// 挂载全局的根据出生年月日计算年龄的方法
Vue.prototype.getCurrentTimeType = getCurrentTimeType// 挂载全局计算时段的方法
Vue.prototype.moment = moment
Vue.prototype.getDataByMoreType = getDataByMoreType // 加载全局的根据字典类型查询字典的方法[基本每个页面都要使用]
// 挂载全局消息框
Vue.prototype.msgSuccess = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'success' })
}
Vue.prototype.msgError = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'error' })
}
Vue.prototype.msgInfo = function(msg) {
  this.$message.info(msg)
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
