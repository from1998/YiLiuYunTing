<template>
  <div class="dashboard-editor-container">
    <panel-group :val="orders" />
    <el-row style="background:#fff;padding:1rem;margin-bottom:1.5rem;">
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
      getPanelGroup().then(res => {
        this.orders = res.data.orders
        this.totalParkingData.date = this.totalProfitsData.date = res.data.times
        this.totalParkingData.actualData = res.data.carRecordMap
        this.totalProfitsData.actualData = res.data.orderMap
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

  .chart-wrapper {
    background: #fff;
    padding: 16px;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding:8px;
  }
}
</style>
