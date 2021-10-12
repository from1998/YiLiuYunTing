<template>
  <div style="flex:1;display:flex;flex-direction: column;">
    <dv-border-box-9 class="dv-border-box-9">
      <div class="GMV">
        <dv-decoration-7 class="GMVtitle">
          <span>总交易额<sub class="sub">(单位:元)</sub></span>
        </dv-decoration-7>
        <div class="GMVdata">
          <span class="svg-container">
            <svg-icon icon-class="money-total" />
          </span>
          <span v-for="(item,index) in transformGMV" :key="index">
            {{ item }}
          </span>
        </div>
      </div>
    </dv-border-box-9>

    <dv-border-box-4 :reverse="true" class="right-chart">
      <div class="header">
        <dv-decoration-7>
          <span>收费排名</span>
        </dv-decoration-7>
      </div>
      <div id="chart-container" />
    </dv-border-box-4>
  </div>
</template>

<script>
import echarts from 'echarts' // 引入echarts
import { getRankingData } from '@/api/carPlay/rightChart'

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

export default {
  name: 'RightChart',
  data() {
    return {
      myChart: '',
      GMV: '',
      option: {}
    }
  },
  computed: {
    transformGMV: function() {
      // `this` 指向 vm 实例
      const GMV = this.GMV.toString().padStart(8, 0).split('')
      return GMV
    }
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    this.myChart = echarts.init(document.getElementById('chart-container'))
    // 使用刚指定的配置项和数据显示图表。
    this.renderChart()
    this.timer = setInterval(() => {
      this.renderChart()
    }, 5000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    // 处理接收到的数据
    processData(data) {
      const name = []
      const fee = []
      for (const key in data) {
        name.push(key)
        fee.push(data[key].toFixed(2))
      }
      data['name'] = name
      data['fee'] = fee
      return data
    },
    renderChart() {
      getRankingData().then(res => {
        this.GMV = res.data.total
        const data = this.processData(res.data.five)
        this.option = {
          tooltip: {
            show: true,
            formatter: '停车场：{b}<br />收费金额：￥{c} 元'
          },
          grid: {
            left: '3%',
            right: '10%',
            top: '10%',
            bottom: '1%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            show: false,
            max: 'dataMax'
          },
          yAxis: [{
            type: 'category',
            data: data.name,
            inverse: true,
            animationDuration: 300,
            animationDurationUpdate: 300,
            axisLine: {
              show: false,
              lineStyle: {
                color: 'aqua'
              }
            },
            axisTick: {
              show: false
            }
          }],
          animationDuration: 0,
          animationDurationUpdate: 3000,
          animationEasing: 'linear',
          animationEasingUpdate: 'linear',
          series: [
            {
              realtimeSort: true,
              type: 'bar',
              data: data.fee,
              barCategoryGap: '30%',
              // 颜色
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    position: 'right',
                    color: 'aqua',
                    valueAnimation: true
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
                  barBorderRadius: 70
                }
              }
            }
          ]
        }
        this.myChart.setOption(this.option)
      })
    }
  }
}
</script>

<style lang="scss">
.dv-border-box-9 {
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
      width: 9%;
      height: 65px;
      text-align: center;
      line-height: 65px;
      background: rgba(0,35,120,.56);
      border: 1px solid rgba(255,255,255,.2);
      border-radius: 5px;
      color: #F2CE20;
      font-size: 68px;
      font-weight: 700;
      &:first-child {
        background: none;
        border: none;
        margin: -2% 9% 0 0;
        font-size: 100px;
      }
    }
  }
  }
}
.right-chart {
  flex: 3;
  position: relative;
  margin: 20px 0 20px 0;
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

  #chart-container {
    flex: 1;
    height: 100%;
    box-sizing: border-box;
  }
}
</style>
