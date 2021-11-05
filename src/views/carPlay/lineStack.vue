<template>
  <dv-border-box-8>
    <div class="lineStack">
      <dv-decoration-7 class="parkTitle">
        <span>七日车流量统计<sub class="sub">(单位:辆)</sub></span>
      </dv-decoration-7>
      <dv-decoration-7 class="orderTitle">
        <span>七日收费统计<sub class="sub">(单位:元)</sub></span>
      </dv-decoration-7>
      <div id="park" />
      <div id="order" />
    </div>
  </dv-border-box-8>
</template>

<script>
import { getLineData } from '@/api/carPlay/lineStack'
import echarts from 'echarts' // 引入echarts

export default {
  name: 'LineStack',
  data() {
    return {
      parkChart: '',
      orderChart: '',
      resData: {}
    }
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    this.parkChart = echarts.init(document.getElementById('park'))
    this.orderChart = echarts.init(document.getElementById('order'))
    // 使用刚指定的配置项和数据显示图表。
    this.renderChart()
  },
  methods: {
    // 处理接收到的数据
    processData(data) {
      const xAxis = []
      for (const key in data) {
        const obj = data[key]
        const arr = []
        for (const key in obj) {
          arr.push(obj[key].toString())
          if (xAxis.indexOf(key) === -1) {
            xAxis.push(key)
          }
        }
        data[key] = arr
      }
      data['xAxis'] = xAxis
      return data
    },
    setOptions({ legendData, xAxisData, seriesData } = {}) {
      const arr = []
      seriesData.map((item) => {
        arr.push({
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
        })
      })
      seriesData = arr
      return {
        textStyle: {
          color: 'aqua'
        },
        tooltip: {
          trigger: 'axis'
        },
        color: ['#67C23A', '#Fa3534', '#2979ff'],
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
          data: xAxisData,
          axisLabel: {
            formatter: function(value) {
              return value.substring(5)
            }
          }
        },
        yAxis: {
          type: 'value'
        },
        series: seriesData
      }
    },
    renderChart() {
      getLineData().then(res => {
        const parkData = this.processData(res.data.park)
        const orderData = this.processData(res.data.order)
        this.resData = {
          park: {
            legendData: ['进场车辆', '出场车辆'],
            xAxisData: parkData.xAxis,
            seriesData: [
              {
                name: '进场车辆',
                data: parkData.enterMap,
                color: '#67C23A'
              },
              {
                name: '出场车辆',
                data: parkData.leaveMap,
                color: '#Fa3534'
              }
            ]
          },
          order: {
            legendData: ['官方', '微信', '支付宝'],
            xAxisData: orderData.xAxis,
            seriesData: [
              {
                name: '微信',
                data: orderData.wxMap,
                color: '#67C23A'
              },
              {
                name: '官方',
                data: orderData.gfMap,
                color: '#Fa3534'
              },
              {
                name: '支付宝',
                data: orderData.zfbMap,
                color: '#2979ff'
              }
            ]
          }
        }
        this.parkChart.setOption(this.setOptions(this.resData.park))
        this.orderChart.setOption(this.setOptions(this.resData.order))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.lineStack {
    display: flex;
    height: 100%;
    position: relative;
    .parkTitle, .orderTitle {
        width:280px;
        height:35px;
        position: absolute;
        top: 1%;
        left: 2%;
        color: #7ec699;
        letter-spacing: 0.3em;
        font-size: 16px;
        span {
            display: block;
            margin-left: 0.3em;
            .sub {
                bottom: 0;
            }
        }
    }
    .orderTitle {
        left: 52%;
    }
    #order, #park {
        flex: 1;
        color: aqua;
    }
}
</style>
