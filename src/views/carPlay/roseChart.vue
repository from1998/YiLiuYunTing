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
            <span>支付总金额</span><sub class="sub">(元)</sub>
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
            <span>当日支付金额</span><sub class="sub">(元)</sub>
          </div>
        </dv-border-box-8>
      </div>
    </div>
  </dv-border-box-4>
</template>

<script>
import { getMoneyData } from '@/api/carPlay/roseChart'

export default {
  name: 'RoseChart',
  data() {
    return {
      option: {},
      resData: {}
    }
  },
  mounted() {
    this.getData()
    this.timer = setInterval(() => {
      this.getData()
    }, 5000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    getData() {
      this.loading = true // 打开遮罩
      getMoneyData().then(res => {
        this.resData = {
          seriesData: [
            { name: '微信', value: Number(res.data.wx.substr(0, res.data.wx.length - 1)) },
            { name: '支付宝', value: Number(res.data.zfb.substr(0, res.data.zfb.length - 1)) },
            { name: '官方', value: Number(res.data.gf.substr(0, res.data.gf.length - 1)) }
          ],
          totalPaid: res.data.totalPaid,
          todayPaid: res.data.todayPaid
        }
        this.option = {
          series: [
            {
              type: 'pie',
              radius: '50%',
              avoidLabelOverlap: true,
              data: this.resData.seriesData,
              outsideLabel: {
                formatter: `{name}:￥{value}\n占比:{percent}%`
              },
              roseType: true
            }
          ],
          color: ['#06AD56', '#1777FF', '#E7370C']
        }
      })
    }
  }
}
</script>

<style lang="scss">
#rose-chart {
  height: 35%;
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
