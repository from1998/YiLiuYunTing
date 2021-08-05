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
          <span class="primaryText">{{ resData.totalPaid }}</span>
          <div>
            <span class="svg-container">
              <svg-icon icon-class="money-bag" />
            </span>
            <span>支付总金额</span><sub class="sub">(万元)</sub>
          </div>
        </dv-border-box-8>
      </div>
      <div class="daily">
        <dv-border-box-8>
          <span class="primaryText">{{ resData.todayPaid }}</span>
          <div>
            <span class="svg-container">
              <svg-icon icon-class="money" />
            </span>
            <span>当日支付金额</span><sub class="sub">(万元)</sub>
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
      option: {},
      resData: {}
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    const { createData } = this

    createData()

    setInterval(createData, 3000)
  },
  methods: {
    createData() {
      this.option = {
        series: [
          {
            type: 'pie',
            radius: '50%',
            roseSort: false,
            data: this.resData.seriesData,
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
    getData() {
      this.resData = {
        seriesData: [
          { name: '微信', value: 42 },
          { name: '支付宝', value: 30 },
          { name: '官方', value: 28 }
        ],
        totalPaid: 430,
        todayPaid: 180
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
    width: 35%;
    position: absolute;
    left: 58%;
    top: 30%;
    font-size: 16px;
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
      color: aqua;
      font-weight: bold;
    }
    .sub {
      bottom: 0;
      font-size: 12px!important;
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
