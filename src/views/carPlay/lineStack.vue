<template>
  <dv-border-box-8>
    <div class="lineStack">
      <dv-decoration-7 class="parkTitle">
        <span>七日车流量统计</span>
      </dv-decoration-7>
      <dv-decoration-7 class="orderTitle">
        <span>七日收费统计</span>
      </dv-decoration-7>
      <div id="park" />
      <div id="order" />
    </div>
  </dv-border-box-8>
</template>

<script>
import echarts from 'echarts' // 引入echarts

const option = {
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
    data: ['邮件营销', '联盟广告']
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
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '邮件营销',
      type: 'line',
      stack: '总量',
      markPoint: {
        data: [
          { type: 'max', name: '最大值' }
        ]
      },
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: '联盟广告',
      type: 'line',
      stack: '总量',
      markPoint: {
        data: [
          { type: 'max', name: '最大值' }
        ]
      },
      data: [220, 182, 191, 234, 290, 330, 310]
    }
  ]
}

export default {
  name: 'LineStack',
  data() {
    return {
      parkChart: '',
      orderChart: '',
      resData: {
        park: {
          legendData: [],
          xAxisData: [],
          seriesData: []
        },
        order: {}
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
    renderChart() {
      this.parkChart.setOption(option)
      this.orderChart.setOption(option)
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
        width:230px;
        height:35px;
        position: absolute;
        top: 0%;
        left: 2%;
        color: #7ec699;
        letter-spacing: 0.3em;
        font-size: 16px;
        span {
            display: block;
            margin-left: 0.3em;
        }
    }
    .orderTitle {
        left: 52%;
    }
    #order, #park {
        flex: 1;
        color: aqua;
        // padding: 20px;
    }
}
</style>
