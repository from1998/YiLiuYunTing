<template>
  <div class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" /> -->

    <!-- <panel-group @handleSetLineChartData="handleSetLineChartData" /> -->
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

    <!-- <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import { getPanelGroup } from '@/api/dashboard'
// 顶部四个方框视图
import PanelGroup from './components/PanelGroup'
// 折线统计图
import LineChart from './components/LineChart'
// 雷达图
// import RaddarChart from './components/RaddarChart'
// 饼图
// import PieChart from './components/PieChart'
// 柱状图
// import BarChart from './components/BarChart'
// 订单编号图
// import TransactionTable from './components/TransactionTable'
// 事件清单
// import TodoList from './components/TodoList'
// 右下角百分比图
// import BoxCard from './components/BoxCard'

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
