<template>
  <div class="app-container">
    <el-date-picker
      v-model="trafficMonth"
      type="month"
      placeholder="选择月"
    />
    <el-header height="30px" style="padding:15px 0 30px;font-weight:700">
      <el-row :gutter="0">
        <el-col :span="4" :offset="0" :gutter="0">
          车流报表
          <el-button type="success" size="mini" @click="handleExport">
            导出表格
          </el-button>
        </el-col>
      </el-row>
    </el-header>
    <!-- 数据表格 -->
    <el-table v-loading="loading" border :data="trafficTableList" stripe>
      <el-table-column label="日期" align="center" prop="carnumber" />
      <el-table-column label="进场车次" align="center" prop="entered" />
      <el-table-column label="出场车次" align="center" prop="elaneName" />
      <el-table-column label="总计" align="center" prop="llaneName" />
    </el-table>

    <!-- 分页控件 -->
    <el-pagination
      v-show="total>0"
      :current-page="queryParams.page"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="queryParams.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
// 引入api
import { getRecordList } from '@/api/monitoringCenter/accessRecord'

export default {
  // 定义页面数据
  data() {
    return {
      // 所属月份
      trafficMonth: '',
      // 是否启用遮罩层
      loading: false,
      // 分页数据总条数
      total: 0,
      // 收费列表数据
      trafficTableList: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        carnumber: undefined
      }
    }
  },
  // 勾子
  created() {
    // 查询收费列表数据
    this.getTrafficList()
  },
  // 方法
  methods: {
    // 导出车流报表表格
    handleExport() {
      console.log('success')
    },
    // 查询表格数据
    getTrafficList() {
      this.loading = true // 打开遮罩
      getRecordList(this.queryParams).then(res => {
        this.trafficTableList = res.data.list
        this.total = res.data.total
        this.loading = false// 关闭遮罩
      })
    },
    // 条件查询
    handleQuery() {
      this.getTrafficList()
    },
    // 重置查询条件
    resetQuery() {
      this.resetForm('queryForm')
      this.dateRangeIn = []
      this.dateRangeOut = []
      this.getTrafficList()
    },
    // 分页size变化时触发
    handleSizeChange(val) {
      this.queryParams.size = val
      // 重新查询
      this.getTrafficList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.page = val
      // 重新查询
      this.getTrafficList()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
