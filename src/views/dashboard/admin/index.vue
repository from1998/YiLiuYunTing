<template>
  <div class="dashboard-editor-container">
    <panel-group :val="orders" />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <line-chart :time="date" :chart-data="totalParkingData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <line-chart :time="date" :chart-data="totalProfitsData" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getPanelGroup } from '@/api/dashboard'
// 顶部四个方框视图
import PanelGroup from './components/PanelGroup'
// 折线统计图
import LineChart from './components/LineChart'

const lineChartData = {
  totalParking: {
    actualData: [],
    date: [],
    title: '最近一周车流量',
    dataName: '车流量'
  },
  totalProfits: {
    actualData: [],
    date: [],
    title: '最近一周订单收益',
    dataName: '订单收益'
  }
  // currentParking: {
  //   expectedData: [200, 192, 120, 144, 160, 130, 140],
  //   actualData: [180, 160, 151, 106, 145, 150, 130]
  // },
  // GMV: {
  //   expectedData: [80, 100, 121, 104, 105, 90, 100],
  //   actualData: [120, 90, 100, 138, 142, 130, 130]
  // },
  // dayTurnover: {
  //   expectedData: [130, 140, 141, 142, 145, 150, 160],
  //   actualData: [120, 82, 91, 154, 162, 140, 130]
  // },
  // dayProfits: {
  //   expectedData: [80, 100, 121, 104, 105, 90, 100],
  //   actualData: [120, 90, 100, 138, 142, 130, 130]
  // }
}

export default {
  name: 'DashboardAdmin',
  components: {
    // GithubCorner,
    PanelGroup,
    LineChart
    // RaddarChart,
    // PieChart,
    // BarChart
    // TransactionTable,
    // TodoList,
    // BoxCard
  },
  data() {
    return {
      totalParkingData: lineChartData.totalParking,
      totalProfitsData: lineChartData.totalProfits,
      date: lineChartData.date,
      orders: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // const { data: res } = await getPanelGroup()
      // console.log(res)
      getPanelGroup().then(res => {
        this.orders = res.data.orders
        // console.log(this.orders)
        this.totalParkingData.date = this.totalProfitsData.date = res.data.times
        this.totalParkingData.actualData = res.data.carRecordMap
        this.totalProfitsData.actualData = res.data.orderMap
        // this.lineChartData.totalParking =
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: #fff;
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
