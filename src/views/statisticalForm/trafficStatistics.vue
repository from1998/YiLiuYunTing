<template>
  <div class="app-container">
    <el-header height="30px" style="padding:15px 0 30px;font-weight:700">
      <el-row :gutter="0">
        <el-col :span="6" :offset="9" style="text-align:center;font-weight:700;padding:5px 0 15px 0">
          <span>{{ laneName }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="2" :offset="1" :gutter="0" style="margin-top:7px">
          <span>车流曲线图</span>
        </el-col>
        <el-col :span="11" :offset="10">
          <el-form ref="form" :model="form" :inline="true" label-width="44px">
            <el-form-item label="日期" prop="created">
              <el-date-picker
                v-model="form.created"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="month"
                placeholder="请选择月份"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button type="danger" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
            <el-select
              v-cloak
              v-show="getUserInfo().role === 1 || getUserInfo().role=== 3"
              v-model="form.parkId"
              placeholder="请选择车场"
              size="small"
              style="padding-left:55px"
              clearable
              @change="handleParkFocus"
            >
              <el-option
                v-for="(item, index) in CarList"
                :key="index"
                :label="item.name"
                :value="Number(item.id)"
              />
            </el-select>
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
      <el-table-column label="车牌号" align="center">
        <template slot-scope="scope">
          <el-tag type="primary" size="medium" effect="dark"><svg-icon icon-class="car" />{{ scope.row.carnumber }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="进场时间" align="center">
        <template slot-scope="scope">
          <el-tag size="medium"> <i class="el-icon-time" /> {{ scope.row.entered }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="出场时间" align="center">
        <template slot-scope="scope">
          <el-tag size="medium"> <i class="el-icon-time" /> {{ scope.row.leaved }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="车场名称"
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>车场名称: {{ scope.row.parkName }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" style="width:100%;overflow:hidden;text-overflow:ellipsis;">{{ scope.row.parkName }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页控件 -->
    <el-pagination
      v-show="total>0"
      :current-page="form.page"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="form.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
// 引入api
import { getRecordList, getCarOrder, exportTrafficStatistics } from '@/api/monitoringCenter/accessRecord'
import lineStack from '@/views/statisticalForm/lineStack.vue'
import { listAll } from '@/api/coupons/couponsManger'

export default {
  components: {
    lineStack
  },
  // 定义页面数据
  data() {
    return {
      laneName: '',
      // 所属月份
      trafficMonth: '',
      // 是否启用遮罩层
      loading: false,
      // 分页数据总条数
      total: 0,
      // 收费列表数据
      trafficTableList: [],
      // 查询参数
      id: '',
      listData2: [],
      hang: [],
      zhi: [], // 离场车辆
      enterData: [], // 进场车辆
      form: {
        page: 1,
        size: 10,
        created: '',
        parkId: ''
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
    this.id = this.getUserInfo().role
    // this.id = this.getUserInfo().id
    this.getList()
    // this.timeDefault()
    this.getCarList()
    this.roleId = this.getUserInfo().role
  },
  // 方法
  methods: {
    handleParkFocus(val) {
      if (val === '') {
        this.laneName = ''
      } else {
        this.getTimeList()
        for (const key in this.CarList) {
          if (this.CarList[key].id === val) {
            this.laneName = this.CarList[key].name
          }
        }
      }
    },
    // 获取车场信息
    getCarList() {
      listAll().then(res => {
        this.CarList = res.data
        this.form.parkId = this.roleId === 1 ? '' : res.data[0].id
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
      this.loading = true
      var query = this.form
      delete query.page
      delete query.size
      exportTrafficStatistics(query).then(res => {
        const fileName = '车流统计报表.xls'
        if ('download' in document.createElement('a')) { // 非IE下载
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        }
      })
      this.loading = false
    },
    // 查询表格数据
    getTrafficList() {
      this.loading = true // 打开遮罩
      this.form.times = this.form.trafficMonth
      getRecordList(this.form).then(res => {
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
      this.form.page = 1
      this.getTimeList()
    },
    // 分页size变化时触发
    handleSizeChange(val) {
      this.form.size = val
      // 重新查询
      this.getTrafficList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.form.page = val
      // 重新查询
      this.getTrafficList()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
