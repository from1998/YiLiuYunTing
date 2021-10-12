<template>
  <div id="data-view">
    <dv-full-screen-container>
      <top-header />
      <dv-border-box-1 class="main-content">
        <digital-flop />
        <dv-decoration-3 class="dv-decoration-3" />

        <div class="block-content">
          <!-- <ranking-board /> -->
          <div class="block-left-content">
            <!-- <dv-border-box-13 class="left-top"> -->
            <right-chart />

            <!-- </dv-border-box-13> -->
            <rose-chart />
          </div>
          <div class="block-right-content">
            <div class="right-top">
              <div class="right-top-left">
                <china-map />
              </div>
              <div class="right-top-right">
                <dv-border-box-13 class="left-top">
                  <scroll-board />
                </dv-border-box-13>

              </div>
            </div>
            <div class="right-bottom">
              <lineStack ref="stack" :order-data="orderData" :park-data="parkData" />
            </div>
          </div>
        </div></dv-border-box-1>
    </dv-full-screen-container>
  </div>
</template>

<script>
// import { getLineData } from '@/api/carPlay/lineStack'
// 导入顶部标题栏样式
import topHeader from './topHeader'
// 导入数字化展板(方格)
import digitalFlop from './digitalFlop'
// 导入饼图
import roseChart from './roseChart'
// 导入排名轮播图
import scrollBoard from './scrollBoard'
// 导入中国地图
import chinaMap from './map'
// 导入地图右侧的图标
import rightChart from './rightChart'
// 导入折现堆叠图
import lineStack from './lineStack'

export default {
  name: 'DataView',
  components: {
    topHeader,
    digitalFlop,
    roseChart,
    scrollBoard,
    chinaMap,
    rightChart,
    lineStack
    // waterLevelChart,
    // cards
  },
  data() {
    return {
      orderData: {},
      parkData: {}
    }
  },
  created() {
    // this.getData()
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
    }
    // getData() {
    //   this.loading = true // 打开遮罩
    //   getLineData().then(res => {
    //     this.parkData = this.processData(res.data.park)
    //     this.orderData = this.processData(res.data.order)
    //     console.log(this.parkData)
    //     this.$refs.stack.renderChart()
    //     this.loading = false// 关闭遮罩
    //   })
    // }
  }
}
</script>

<style lang="scss">
#data-view{
  width: 100%;
  height: 100%!important;
  background-color: #030409;
  color: aqua;
  user-select: none;

  #dv-full-screen-container {
    background-image: url('../../assets/images/bg.png');
    background-size: 100% 100%;
    box-shadow: 0 0 3px blue;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    position: relative;
    flex: 97;
    margin-top: -1%;
    .dv-decoration-3 {
    position: absolute;
    top:5%;
    left:12%;
    width:300px;
    height:50px;
  }
    .border-box-content {
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }
  }

  .block-content {
    flex: 1;
    display: flex;
    margin-top: 20px;
  }

  .block-left-content {
    flex: 3;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-left: 10px;
    .left-top {
      height: 65%;
      margin-bottom: 20px;
    }
  }
  .block-right-content {
    flex: 7;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-left: 20px;
    transform: rotateY(-180deg);
    .right-top {
      display: flex;
      height: 65%;
      // background-color: #fff;
      // font-size: 72px;
      // text-align: center;
      // color: red;
      .right-top-right , .right-top-left {
        flex: 1;
      }
      .right-top-right {
        display: flex;
      }
    }
    .right-bottom {
      flex: 1;
      transform: rotateY(180deg)
    }
  }

  .block-top-content {
    height: 55%;
    display: flex;
    flex-grow: 0;
    box-sizing: border-box;
    padding-bottom: 20px;
  }
}
</style>
