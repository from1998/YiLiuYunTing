<template>
  <div id="scroll-board">
    <dv-decoration-7 class="dv-decoration-7"><span>进出监控</span></dv-decoration-7>
    <dv-border-box-3 style="height: 45%;margin-bottom:10px">
      <div class="scroll-board-access">
        <dv-scroll-board style="color: aqua;" :config="config" />
      </div>
    </dv-border-box-3>
    <dv-decoration-7 class="dv-decoration-7"><span>订单监控</span></dv-decoration-7>
    <dv-border-box-3 style="height: 45%;">
      <div class="scroll-board-order">
        <dv-scroll-board style="color: aqua;" :config="config" />
      </div>
    </dv-border-box-3>
  </div>
</template>

<script>
export default {
  name: 'ScrollBoard',
  data() {
    return {
      config: {
        header: ['车厂', '车牌', '时间', '进/出'],
        data: [
          ['一流云停', '皖A12345', '2019-07-01 19:25:00', '进场'],
          ['一流云停', '粤B594SB', '2019-07-02 17:25:00', '出场'],
          ['光明殿', '黑S222333', '2019-07-03 16:25:00', '进场'],
          ['六尺巷', '浙JB18CM', '2019-07-04 15:25:00', '出场'],
          ['长安街', '琼B945945', '2019-07-05 14:25:00', '进场'],
          ['多威尔', '鲁A5942B', '2019-07-06 13:25:00', '出场'],
          ['多威尔', '京A110112', '2019-07-07 12:25:00', '进场'],
          ['光明殿', '冀B666999', '2019-07-08 11:25:00', '出场'],
          ['六尺巷', '沪A662399', '2019-07-09 10:25:00', '进场'],
          ['一流云停', '苏B123456', '2019-07-10 09:25:00', '进场']
        ],
        // index: true,
        columnWidth: [110, 130, 170, 60],
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
