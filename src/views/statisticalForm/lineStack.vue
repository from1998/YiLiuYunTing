<template>
  <div class="lineStack">
    <div id="park" />
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'LineStack',
  props: {
    listData: {
      type: Object,
      default: null
    },
    leaveMap: {
      type: Array,
      default: null
    },
    leaveData: {
      type: Array,
      default: null
    },
    enterMap: {
      type: Array,
      default: null
    },
    parkName: {
      type: Array,
      default: null
    },
    zfbMap: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      parkChart: '',
      resData: {
        park: {
          //   legendData可以不用传回
          legendData: this.parkName,
          xAxisData: this.leaveMap,
          seriesData: [
            {
              name: this.parkName[0],
              data: this.enterMap,
              color: '#00FF00'
            },
            {
              name: this.parkName[1],
              data: this.leaveData,
              color: '#FF0000'
            },
            {
              name: this.parkName[2],
              data: this.zfbMap,
              color: '#409eff'
            }
          ]
        }
      },
      id: ''
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
          color: '#FFF'
        },
        tooltip: {
          show: true, // 必须引入 tooltip 组件
          trigger: 'axis'
        },

        toolbox: {
          show: true,
          right: '4%',
          showTitle: true, // 隐藏默认文字，否则两者位置会重叠
          feature: {
            saveAsImage: {
              show: true,
              title: '保存为图片'
            },
            dataView: {
              show: true,
              title: '切换到数据视图'
            }
          }
        },

        color: ['#00FF00', '#FF0000', '#409eff'],
        legend: {
          top: '3%',
          left: 'center',
          textStyle: {
            color: '#3888fa'
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
            interval: 0,
            rotate: 40,
            textStyle: {
              color: '#3888fa'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#3888fa'
            }
          }
        },
        series: seriesData
      }
    },

    renderChart() {
      this.resData.park.xAxisData = this.leaveMap
      this.resData.park.seriesData[0].data = this.enterMap
      this.resData.park.seriesData[1].data = this.leaveData
      this.parkChart.setOption(this.setOptions(this.resData.park))
    }
  }
}
</script>

<style lang="scss" scoped>
  .lineStack {
    height: 350px;
    width: 100%;
    display: flex;
    #park {
      flex: 1;
      color: #000;
    }
  }
</style>
