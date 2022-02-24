<template>
  <div style="width: 100%;height:100%;  position: relative;">
    <dv-decoration-7 class="mapTitle">
      <span>{{ mapTitle }}车场分布图</span>
    </dv-decoration-7>
    <el-button v-show="flag" id="backHome" round type="primary" icon="el-icon-position" size="mini" @click="handleBackHome">返回主界面</el-button>
    <div v-show="!flag" id="chart" style="width: 100%;height:100%;" />
    <div v-show="flag" id="provChart" />
  </div>
</template>

<script>
import { getMapData } from '@/api/carPlay/map'

import C2Pin from 'c2pin' // 引入字符串转拼音
import * as echarts from 'echarts'// 引入echarts
import '@/assets/js/china' // 引入中国地图

export default {
  name: 'ChinaMap',
  data() {
    return {
      flag: false,
      mapTitle: '全国',
      myChart: '',
      myProvChart: '',
      province: '',
      option: {
        tooltip: { // 提示信息
          trigger: 'item', // 类型
          // 地图 : {a}（系列名称），{b}（区域名称），{c}（合并数值）, {d}（无）
          formatter: '地区：{b}<br/>停车场数量：{c} 个'
        },
        series: [ // 数据
          {
            type: 'map', // 图表的类型
            map: 'china',
            // data:[
            //     {name: '北京', value: 200},
            // ],
            label: { // 图形上的文本标签，可用于说明图形的一些数据信息
              show: true,
              color: '#903B1C'
            },
            zoom: 1.26, // 当前视角的缩放比例。
            itemStyle: { // 地图区域的多边形 图形样式。
              borderColor: 'blue'
            },
            emphasis: { // 高亮状态下的设置
              label: { // 图形上的文本标签，可用于说明图形的一些数据信息
                color: '#F00',
                fontSize: 12
              },
              itemStyle: { // 地图区域的多边形 图形样式。
                areaColor: 'green'
              }
            }
          }
        ],
        visualMap: { // 视觉地图
          type: 'piecewise', // 分段型
          show: true,
          textStyle: {
            color: 'aqua'
          },
          pieces: [
            { min: 10000 }, // 不指定 max，表示 max 为无限大（Infinity）。
            { min: 1000, max: 9999 },
            { min: 100, max: 999 },
            { min: 10, max: 99 },
            { min: 1, max: 9 },
            { value: 0 } // 不指定 min，表示 min 为无限大（-Infinity）。
          ],
          inRange: { // 范围
            color: ['#33FFCC', '#0099FF', '#009966', '#3366CC', '#333399', '#003300']
          },
          itemWidth: 10,
          itemHeight: 10
        }
      }
    }
  },
  created() {
    this.getData('myChart', 0)
  },
  mounted() { // 生命周期
    // 基于准备好的dom，初始化echarts实例
    this.myChart = echarts.init(document.getElementById('chart'))
    this.myProvChart = echarts.init(document.getElementById('provChart'))
    this.myChart.on('click', (params) => {
      this.handlePark(params.data)
    })
  },
  methods: {
    // 真实数据
    getData(chart, id) {
      getMapData(id).then(res => {
        this.$set(this.option.series[0], 'data', res.data)
        if (id === 0) {
          this.option.series[0].data.push({ name: '南海诸岛', value: 0 })
        }
        // 使用刚指定的配置项和数据显示图表。
        this[chart].setOption(this.option)
      })
    },
    handleBackHome() {
      this.flag = !this.flag
      this.mapTitle = '全国'
    },
    handlePark(val) {
      if (!val.id) {
        this.$message({
          message: '该地区无下级地图，不予展示。',
          type: 'warning',
          center: true,
          showClose: true
        })
      }
      this.province = C2Pin.fullChar(val.name)
      if (val.name === '陕西') {
        this.province = 'shanxi1'
      }
      require(`@/assets/js/province/${this.province}`)
      this.flag = !this.flag
      this.mapTitle = val.name
      delete this.option.series[0].zoom
      this.$set(this.option.series[0], 'map', val.name)
      // 数据取到了，但是二次渲染视图未更新,这是因为取到的数据大部分都与地图上的系列名对不上。对的上才能显示，比如青海大部分地区。
      this.getData('myProvChart', val.id)
    }
  }

}
</script>
<style lang="scss">
.mapTitle {
  position: absolute;
  top: 2%;
  left: 1%;
  width:280px;
  height:30px;
  color: #7ec699;
  letter-spacing: 0.3em;
  font-size: 20px;
  span {
    display: block;
    margin-left: 0.3em;
  }
}
#backHome {
position: absolute;
  top: 2%;
  right: 1%;
}
#chart {
  margin: 0 auto;
}
#provChart {
  margin: 0 auto;
  width: 520px!important;
  height: 520px!important;
}
</style>
