<template>
  <dv-border-box-4 id="rose-chart" :reverse="true">
    <dv-decoration-7 class="rose-chart-title">
      <span>支付渠道分布</span>
    </dv-decoration-7>
    <dv-decoration-6 class="dv-decoration-6" />
    <dv-charts :option="option" />
    <div class="payment">
      <div class="total">
        <dv-border-box-8>
          <span class="primaryText">430</span>
          <div>
            <span class="svg-container">
              <svg-icon icon-class="money-bag" />
            </span>
            支付总金额
          </div>
        </dv-border-box-8>
      </div>
      <div class="daily">
        <dv-border-box-8>
          <span class="primaryText">180</span>
          <div>
            <span class="svg-container">
              <svg-icon icon-class="money" />
            </span>
            当日支付金额
          </div>
        </dv-border-box-8>
      </div>
    </div>
  </dv-border-box-4>
</template>

<script>
export default {
  name: 'RoseChart',
  data() {
    return {
      option: {}
    }
  },
  mounted() {
    const { createData } = this

    createData()

    setInterval(createData, 3000)
  },
  methods: {
    createData() {
      const { randomExtend } = this

      this.option = {
        series: [
          {
            type: 'pie',
            radius: '50%',
            roseSort: false,
            data: [
              { name: '微信', value: randomExtend(40, 70) },
              { name: '支付宝', value: randomExtend(20, 30) },
              { name: '官方', value: randomExtend(10, 50) }
            ],
            insideLabel: {
              show: false
            },
            outsideLabel: {
              formatter: '{name} {percent}%',
              labelLineEndLength: 20,
              style: {
                fill: 'aqua'
              },
              labelLineStyle: {
                stroke: 'aqua'
              }
            },
            roseType: true
          }
        ],
        color: ['#06AD56', '#1777FF', '#E7370C']
      }
    },
    randomExtend(minNum, maxNum) {
      if (arguments.length === 1) {
        return parseInt(Math.random() * minNum + 1, 10)
      } else {
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
      }
    }
  }
}
</script>

<style lang="scss">
#rose-chart {
  flex: 1;
  position: relative;
  box-sizing: border-box;
  .dv-decoration-6 {
    width:45%;
    height:30px;
    position: absolute;
    left: 50%;
    top: 10%;
  }
  .payment {
    height: 45%;
    width: 29%;
    position: absolute;
    left: 65%;
    top: 30%;
    font-size: 14px;
    text-align: center;
    color: #E89C07;

    .total,.daily {
      height: 43%;
      margin-top: 7%;
      .border-box-content {
        padding: 5px;
      }
      .primaryText {
      font-size: 18px;
      color: #7ec699;
      font-weight: bold;
    }
    }
  }
  .rose-chart-title {
    width:240px;
    height:50px;
    color: #7ec699;
    letter-spacing: 0.3em;
    font-size: 20px;
    display: flex;
    align-items: center;
        span {
      display: block;
      margin-left: 0.3em;
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
.dv-charts-container {
  height: calc(100% - 50px);
  margin-left: -18%;
}
}
</style>
