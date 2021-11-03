<template>
  <div style="width: 100%;height:100%;  position: relative;">
    <dv-decoration-7 class="mapTitle">
      <span>全国车场分布图</span>
    </dv-decoration-7>
    <div id="chart" style="width: 100%;height:100%;" />
  </div>
</template>

<script>
import echarts from 'echarts' // 引入echarts
import jsonp from 'jsonp' // 引入jsonp
import '@/assets/js/china' // 引入中国地图

const option = {
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
        color: 'aqua'
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
export default {
  name: 'ChinaMap',
  data() {
    return {
      myChart: ''
    }
  },
  mounted() { // 生命周期
    // 基于准备好的dom，初始化echarts实例
    this.myChart = echarts.init(document.getElementById('chart'))
    // 使用刚指定的配置项和数据显示图表。
    // myChart.setOption(option);
    this.getData()
  },
  methods: {
    // 真实数据
    getData() {
      jsonp('https://interface.sina.cn/news/wap/fymap2020_data.d.json?_=1580892522427', (err, data) => {
        if (err) {
          return
        }
        var lists = data.data.list.map(item => { return { name: item.name, value: item.value } })
        option.series[0].data = lists
        // 使用刚指定的配置项和数据显示图表。
        this.myChart.setOption(option)
      })
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
#chart {
  margin: 0 auto;
}
</style>
