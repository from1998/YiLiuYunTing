<template>
  <div id="scroll-board">
    <dv-decoration-7 class="dv-decoration-7"><span>进出监控</span></dv-decoration-7>
    <dv-border-box-3 style="height:45%;overflow: hidden;margin-bottom:10px;">
      <div class="scroll-board-access">
        <dv-scroll-board style="color: aqua;" :config="inOutConfig" />
      </div>
    </dv-border-box-3>
    <dv-decoration-7 class="dv-decoration-7"><span>订单监控</span></dv-decoration-7>
    <dv-border-box-3 style="height: 45%;overflow: hidden;">
      <div class="scroll-board-order">
        <dv-scroll-board style="color: aqua;" :config="orderConfig" />
      </div>
    </dv-border-box-3>
  </div>
</template>

<script>
export default {
  name: 'ScrollBoard',
  data() {
    return {
      resData: [],
      inOut: [],
      order: [],
      inOutConfig: {
        header: ['车厂', '车牌', '进场时间', '进场口'],
        data: [],
        columnWidth: [130, 130, 180, 130],
        align: ['center'],
        rowNum: 3,
        headerBGC: '#1981f6',
        headerHeight: 35,
        oddRowBGC: 'rgba(0, 44, 81, 0.8)',
        evenRowBGC: 'rgba(10, 29, 50, 0.8)'
      },
      orderConfig: {
        header: ['车厂', '车牌', '出场时间', '出场口', '费用'],
        data: [],
        columnWidth: [100, 100, 160, 100, 80],
        align: ['center'],
        rowNum: 3,
        headerBGC: '#1981f6',
        headerHeight: 35,
        oddRowBGC: 'rgba(0, 44, 81, 0.8)',
        evenRowBGC: 'rgba(10, 29, 50, 0.8)'
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.resData = [{
        // 是否进场
        isin: true,
        stationName: '一流云停',
        carNumber: '皖A12345',
        time: '2019-07-01 19:25:00',
        accessName: '东门入口',
        // 进场车辆费用为null
        fee: null
      },
      {
        // 出场
        isin: false,
        stationName: '多威尔',
        carNumber: '皖A33345',
        time: '2019-07-01 19:25:00',
        accessName: '西门出口',
        // 出场费用
        fee: 20.00
      },
      {
        isin: true,
        stationName: '东方商城',
        carNumber: '皖A12345',
        time: '2019-07-01 19:25:00',
        accessName: '南门入口',
        fee: null
      }
      ]
      this.resData.map(item => {
        if (!item.isin) {
          this.order.push([item.stationName, item.carNumber, item.time, item.accessName, item.fee])
        } else {
          this.inOut.push([item.stationName, item.carNumber, item.time, item.accessName])
        }
      })
      this.inOutConfig.data = this.inOut
      this.orderConfig.data = this.order
    }
  }
}
</script>

<style lang="scss">
#scroll-board {
  // 该组件相对于flex一份的高度和宽度
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
  .dv-decoration-7 {
    width:200px;
    height:30px;
    color: #7ec699;
    letter-spacing: 0.5em;
    span {
      display: block;
      margin-left: 0.5em;
    }
  }
  .scroll-board-access, .scroll-board-order{
    // 表格相对于装饰的高度和宽度
    height: 95%;
    width: 99%;
  }
}
</style>
