<template>
  <div class="app-container">
    <el-header height="30px" style="padding:15px 0 30px;font-weight:700">
      <el-row :gutter="0">
        <el-col :span="4" :offset="0" :gutter="0" style="margin-top:7px">
          <span>车流曲线图</span>
        </el-col>
        <el-col :span="18" :offset="0">
          <el-form ref="form" :model="form" :inline="true" label-width="58px">
            <el-form-item
              label="车场"
              prop="parkid"
            >
              <el-select
                v-cloak
                v-model="form.parkid"
                placeholder="请选择车场"
                size="small"
              >
                <el-option
                  v-for="(item, index) in CarList"
                  :key="index"
                  :label="item.name"
                  :value="Number(item.id)"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="日期" prop="created">
              <el-date-picker
                v-model="form.created"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="month"
                placeholder="选择月"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
          <!-- 查询条件结束 -->
        </el-col>
      </el-row>
    </el-header>
    <div class="lineStack">
      <lineStack ref="linestack" :list-data="listData2" :leave-map="hang" :leave-data="zhi" :enter-map="enterData" :park-name="park" />
    </div>
    <el-header height="30px" style="padding:15px 0 30px;font-weight:700">
      <el-row :gutter="0">
        <el-col :span="4" :offset="0" :gutter="0" style="margin-top:7px">
          <span>车流报表</span>
        </el-col>
        <el-col :span="2" :offset="18" :gutter="0">
          <el-button type="success" size="mini" style="margin-left:56px" @click="handleExport">
            导出表格
          </el-button>
        </el-col>
      </el-row>
    </el-header>
    <!-- 数据表格 -->
    <el-table v-loading="loading" border :data="trafficTableList" stripe>
      <el-table-column label="车牌号" align="center" prop="carnumber" />
      <el-table-column label="进场时间" align="center" prop="entered" />
      <el-table-column label="出场时间" align="center" prop="leaved" />
      <el-table-column label="车场名称" align="center" prop="parkName" />
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
import { getRecordList, getCarOrder } from '@/api/monitoringCenter/accessRecord'
import lineStack from '@/views/statisticalForm/lineStack.vue'
import { listAll } from '@/api/coupons/couponsManger'

export default {
  components: {
    lineStack
  },
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
        created: '',
        parkId: ''
      },
      id: '',
      listData2: [],
      hang: [],
      zhi: [], // 离场车辆
      enterData: [], // 进场车辆
      form: {
        page: 1,
        size: 10,
        created: '',
        parkid: ''
      },
      CarList: '',
      roleId: '',
      park: ['进场车辆', '出场车辆']
    }
  },
  // 勾子
  created() {
    // 查询收费列表数据
    this.getTrafficList()
    this.id = this.getRoleID()
    // this.id = this.getID()
    this.getList()
    // this.timeDefault()
    this.getCarList()
    this.roleId = this.getRoleID()
  },
  // 方法
  methods: {
    // 获取车厂信息
    getCarList() {
      listAll().then(res => {
        this.CarList = res.data
        this.form.parkid = this.roleId === '1' ? '' : res.data[0].id
        console.log(this.CarList)
      }).catch(err => {
        console.log(err)
      })
    },
    // 根据用户ID查询车场信息
    async getList(e) {
      await getCarOrder(this.form).then(res => {
        this.listData2 = res.data
        this.getleaveMap()
      })
    },
    getTimeList(e) {
      this.hang = []
      this.zhi = []
      this.enterData = []
      this.listData2 = []
      this.getList(e)
      this.getTrafficList()
    },
    // handlelines() {
    //   this.$refs.linestack.setOptions()
    // },
    getleaveMap() {
      for (var p in this.listData2.leaveMap) {
        this.hang.push(p)
        this.zhi.push(this.listData2.leaveMap[p])
      }
      for (var e in this.listData2.enterMap) {
        this.enterData.push(this.listData2.enterMap[e])
      }
      this.$refs.linestack.renderChart()
    },
    // 导出车流报表表格
    handleExport() {
      console.log('success')
    },
    // 查询表格数据
    getTrafficList() {
      this.loading = true // 打开遮罩
      this.queryParams.times = this.form.trafficMonth
      getRecordList(this.form).then(res => {
        console.log(res)
        this.trafficTableList = res.data.list
        this.total = res.data.total
        this.loading = false// 关闭遮罩
      })
    },
    // 条件查询
    handleQuery() {
      this.getTimeList()
      // this.getTrafficList()
    },
    // 重置查询条件
    resetQuery() {
      this.resetForm('form')
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
