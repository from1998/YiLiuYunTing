<template>
  <div class="container">
    <div id="main" />
  </div>
</template>
<script>
// 引入api
import { getSvg } from '@/api/system/carSetting'
import echarts from 'echarts' // 引入echarts

const ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples'

export default {
  name: 'PortManger', // 和对应路由表中配置的name值一致
  // 定义页面数据
  data() {
    return {

    }
  },
  // 勾子
  created() {
    getSvg(ROOT_PATH + '/data/asset/geo/MacOdrum-LV5-floorplan-web.svg')
  },
  mounted() { // 生命周期
    // 基于准备好的dom，初始化echarts实例
    this.myChart = echarts.init(document.getElementById('main'))
    // 使用刚指定的配置项和数据显示图表。
    // myChart.setOption(option);
    this.getData()
  },
  // 方法
  methods: {
  }
}
</script>

