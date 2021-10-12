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
import { getRecordList } from '@/api/monitoringCenter/accessRecord'
import { getOrderList } from '@/api/recordsQuery/orderRecord'

export default {
  name: 'ScrollBoard',
  data() {
    return {
      accessData: [],
      orderData: [],
      inOut: [],
      order: [],
      inOutConfig: {},
      orderConfig: {}
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 查询表格数据
    async getData() {
      this.loading = true // 打开遮罩
      await getRecordList().then(res => {
        this.accessData = res.data.list
        this.loading = false// 关闭遮罩
      })
      await getOrderList().then(res => {
        this.orderData = res.data.list
        this.loading = false// 关闭遮罩
      })
      this.accessData.map(item => {
        this.inOut.push([item.parkName, item.carnumber, item.entered, item.leaved])
      })
      this.orderData.map(item => {
        switch (item.platform) {
          case 1:
            item.platform = '官方'
            break
          case 2:
            item.platform = '支付宝'
            break
          case 3:
            item.platform = '微信'
            break
        }
        this.order.push([item.parkName, item.carNumber, item.created, item.platform, '￥' + item.amount.toFixed(2)])
      })
      this.inOutConfig = {
        header: ['车场', '车牌', '进场时间', '出场时间'],
        data: this.inOut,
        columnWidth: [130, 110, 160, 160],
        align: ['center'],
        rowNum: 3,
        headerBGC: '#1981f6',
        headerHeight: 35,
        oddRowBGC: 'rgba(0, 44, 81, 0.8)',
        evenRowBGC: 'rgba(10, 29, 50, 0.8)'
      }
      this.orderConfig = {
        header: ['车场', '车牌', '出场时间', '支付平台', '费用'],
        data: this.order,
        columnWidth: [110, 110, 160],
        align: ['center'],
        rowNum: 3,
        headerBGC: '#1981f6',
        headerHeight: 35,
        oddRowBGC: 'rgba(0, 44, 81, 0.8)',
        evenRowBGC: 'rgba(10, 29, 50, 0.8)'
      }
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
