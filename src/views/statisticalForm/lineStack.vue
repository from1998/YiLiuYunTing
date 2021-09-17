<template>
  <div class="lineStack">
    <div id="park" />
  </div>
</template>

<script>
import echarts from 'echarts' // 引入echarts

export default {
  name: 'LineStack',
  data() {
    return {
      parkChart: '',
      resData: {}
    }
  },
  created() {
    this.resData = {
      park: {
        //   legendData可以不用传回
        legendData: ['进场车辆', '出场车辆'],
        xAxisData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        seriesData: [
          {
            name: '进场车辆',
            data: [120, 132, 101, 134, 90, 230, 210],
            color: '#FF0000'
          },
          {
            name: '出场车辆',
            data: [220, 182, 191, 234, 290, 330, 310],
            color: '#00FF00'
          }
        ]
      }
    }
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    this.parkChart = echarts.init(document.getElementById('park'))
    // 使用刚指定的配置项和数据显示图表。
    this.renderChart()
  },
  methods: {
    setOptions({ legendData, xAxisData, seriesData } = {}) {
      seriesData = seriesData.map((item) => {
        return {
          name: item.name,
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                color: item.color
              }
            }
          },
          markPoint: {
            data: [
              { type: 'max', name: '最大值' }
            ]
          },
          data: item.data
        }
      })
      return {
        textStyle: {
          color: 'aqua'
        },
        tooltip: {
          trigger: 'axis'
        },
        color: ['#FF0000', '#00FF00', '#FFFFFF'],
        legend: {
          top: '3%',
          right: '4%',
          textStyle: {
            color: 'aqua'
          },
          data: legendData
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: seriesData
      }
    },
    renderChart() {
      this.parkChart.setOption(this.setOptions(this.resData.park))
    }
  }
}
</script>

<style lang="scss" scoped>
.lineStack {
    height: 500px;
    width: 100%;
    display: flex;
    #park {
        flex: 1;
        color: aqua;
    }
}
</style>
