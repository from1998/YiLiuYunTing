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
  created() {
    this.resData = {
      park: {
        legendData: ['进场车辆', '出场车辆'],
        xAxisData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        seriesData: [
          {
            name: '进场车辆',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '出场车辆',
            data: [220, 182, 191, 234, 290, 330, 310]
          }
        ]
      },
      order: {
        legendData: ['官方', '微信', '支付宝'],
        xAxisData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        seriesData: [
          {
            name: '官方',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '微信',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '支付宝',
            data: [326, 178, 255, 109, 183, 226, 499]
          }
        ]
      }
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
    setOptions({ legendData, xAxisData, seriesData } = {}) {
      seriesData = seriesData.map((item) => {
        return {
          name: item.name,
          type: 'line',
          stack: '总量',
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
      this.orderChart.setOption(this.setOptions(this.resData.order))
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
