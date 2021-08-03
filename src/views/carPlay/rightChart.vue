<template>
  <div style="flex:1;display:flex;flex-direction: column;">
    <dv-border-box-9 class="dv-border-box-9">
      <div class="GMV">
        <dv-decoration-7 class="GMVtitle">
          <span>总交易额<sub class="sub">(单位:万元)</sub></span>
        </dv-decoration-7>
        <div class="GMVdata">
          <span v-for="(item,index) in transformGMV" :key="index">
            {{ item }}
          </span>
        </div>
      </div>
    </dv-border-box-9>
    <!-- <div class="right-chart"> -->
    <dv-border-box-4 :reverse="true" class="right-chart">
      <div class="header">
        <dv-decoration-7>
          <span>收费排名</span>
        </dv-decoration-7>
      </div>
      <div class="chart-container" />
    </dv-border-box-4>
    <!-- </div> -->
  </div>
</template>

<script>
import echarts from 'echarts' // 引入echarts

const colorArray = [{
  top: '#ffa800', // 黄
  bottom: 'rgba(11,42,84,.3)'
}, {
  top: '#1ace4a', // 绿
  bottom: 'rgba(11,42,84, 0.3)'
},
{
  top: '#4bf3ff', // 蓝
  bottom: 'rgba(11,42,84,.3)'
}, {
  top: '#4f9aff', // 深蓝
  bottom: 'rgba(11,42,84,.3)'
},
{
  top: '#b250ff', // 粉
  bottom: 'rgba(11,42,84,.3)'
}
]
const option = {
  tooltip: {
    show: true,
    formatter: '{b}:{c}'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    show: false
  },
  yAxis: [{
    type: 'category',
    inverse: 'true', // 排序
    realtimeSort: true,
    animationDuration: 300,
    axisLine: {
      show: false,
      lineStyle: {
        color: '#00f'
      }
    },
    axisTick: {
      show: false
    },
    data: ['一流云停', '多威尔停车场', '南湖春城', '芜湖医苑', '东方商城'],
    axisLabel: {
      formatter: function(value) {
        return value.length > 10 ? value.slice(0, 10) + '...' : value
      }
    }
  }],
  series: [
    {
      type: 'bar',
      data: [131744, 18203, 23489, 29034, 104970],
      // series配置
      // 颜色
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: 'right',
            color: '#000'
          },
          // 提供的工具函数生成渐变颜色
          color: function(params) {
            const num = colorArray.length
            return {
              type: 'linear',
              colorStops: [{
                offset: 0,
                color: colorArray[params.dataIndex % num].bottom
              }, {
                offset: 1,
                color: colorArray[params.dataIndex % num].top
              }, {
                offset: 0,
                color: colorArray[params.dataIndex % num].bottom
              }, {
                offset: 1,
                color: colorArray[params.dataIndex % num].top
              }, {
                offset: 0,
                color: colorArray[params.dataIndex % num].bottom
              }, {
                offset: 1,
                color: colorArray[params.dataIndex % num].top
              }, {
                offset: 0,
                color: colorArray[params.dataIndex % num].bottom
              }, {
                offset: 1,
                color: colorArray[params.dataIndex % num].top
              }, {
                offset: 0,
                color: colorArray[params.dataIndex % num].bottom
              }, {
                offset: 1,
                color: colorArray[params.dataIndex % num].top
              }]
            }
          },
          barBorderRadius: 70,
          borderWidth: 0,
          borderColor: '#333'
        }
      }
    }
  ]
}

export default {
  name: 'RightChart',
  data() {
    return {
      myChart: '',
      GMV: undefined
    }
  },
  computed: {
    transformGMV: function() {
      // `this` 指向 vm 实例
      const GMV = this.GMV.toString().padStart(8, 0).split('')
      // console.log(GMV)
      return GMV
    }
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    this.myChart = echarts.init(document.getElementsByClassName('chart-container'))
    // 使用刚指定的配置项和数据显示图表。
    this.myChart.setOption(option)
  },
  created() {
    this.getGmv()
  },
  methods: {
    getGmv() {
      this.GMV = 123456
    }
  }
}
</script>

<style lang="scss">
.dv-border-box-9 {
  // height: 40%;
  flex: 2;
  .GMV {
    position: relative;
    .GMVtitle {
      position: absolute;
      top: 7%;
      left: 0%;
      width:310px;
      height:30px;
      color: #7ec699;
      letter-spacing: 0.3em;
      font-size: 20px;
      span {
        display: inline-block;
        margin-left: 0.3em;
        .sub {
          bottom: 0;
        }
    }
}
  .GMVdata {
    display: flex;
    justify-content: space-evenly;
    transform: translateY(90%);
    span {
    width: 10%;
    height: 65px;
    text-align: center;
    line-height: 65px;
    background: rgba(0,35,120,.56);
    border: 1px solid rgba(255,255,255,.2);
    border-radius: 5px;
    color: #fff;
    font-size: 68px;
    font-weight: 700;
}
  }
  }
}
.right-chart {
  flex: 3;
  // width: 100%;
  // height: 80%;
  position: relative;
  margin-top: 30px;
  display: flex;
  flex-direction: column;

  .header {
    position: absolute;
    top: 0%;
    left: 0%;
    width:220px;
    font-weight: 700;
    height: 30px;
    color: #7ec699;
    letter-spacing: 0.3em;
    font-size: 20px;
    span {
      display: inline-block;
      margin-left: 0.3em;
    }
  }

  .chart-container {
    flex: 1;
    height: 100%;
    // padding-bottom: 20px;
    // padding-right: 20px;
    box-sizing: border-box;
  }
}
</style>
