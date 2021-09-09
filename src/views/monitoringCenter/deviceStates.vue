<template>
  <div class="app-container">
    <!-- 标题 -->
    <el-header class="container" height="40px" style="padding:25px 0 70px;font-size:30px;font-weight:700;text-align:center;background-color: #fff;">
      <el-row>
        <el-col :span="4" :offset="10">
          设备状态
        </el-col>
        <el-col :span="4" :offset="6">
          <el-button type="primary" size="mini" @click="open=true">
            <svg-icon icon-class="qrcode" />
            查看预付款二维码
          </el-button>
        </el-col>
      </el-row>
    </el-header>
    <!-- 表格工具按钮结束 -->

    <!-- 数据表格开始 -->
    <el-table v-loading="loading" border :data="cameraList" stripe>
      <el-table-column label="车道名称" align="center" prop="carName" />
      <el-table-column label="车道类型" align="center" prop="carCategory" />
      <el-table-column label="相机编号" align="center" prop="depotCategory" />
      <el-table-column label="相机品牌" align="center" prop="carStatus" :formatter="carStatusFormate" />
      <el-table-column label="控制卡类型" align="center" prop="timeSection" />
      <el-table-column label="相机IP" align="center" prop="carAddress" />
      <el-table-column label="相机状态" align="center" prop="carAddress" />
      <el-table-column label="操作" align="center" width="280">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleAccessImg(scope.row)">
            <svg-icon icon-class="qrcode" />
            出场支付二维码
          </el-button>
          <el-button type="primary" size="mini" @click="handleAccessImg(scope.row)">
            <svg-icon icon-class="qrcode" />
            无牌进场二维码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 数据表格结束 -->
    <!-- 分页控件开始 -->
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
    <!-- 分页控件结束 -->

    <!-- 出场支付二维码弹出层开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      center
      append-to-body
    >
      <el-header height="30px" style="padding:15px 0 30px;font-weight:700">
        <el-row :gutter="0">
          <el-col :span="4" :offset="0" :gutter="0">
            出场图片
          </el-col>
          <el-col :span="2" :offset="18" :gutter="0">
            <el-button type="warning" round size="mini" icon="el-icon-d-arrow-right" style="cursor:default;height:18px;line-height:18px;padding-top:0" />
          </el-col>
        </el-row>
      </el-header>
      <!-- 图片 -->
      <el-image :src="src" :preview-src-list="[src]">
        <div slot="placeholder" class="image-slot">
          加载中<span class="dot">...</span>
        </div>
      </el-image>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" align="center" @click="open=false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 出场支付二维码弹出层结束 -->

  </div>
</template>
<script>
// 引入api
// import { listRoleForPage } from '@/api/system/role'
import validate from '@/utils/validate.js'

export default {
  // 定义页面数据
  data() {
    return {
      src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      stateOptions: [],
      // daysTotal: undefined,
      renewFeeTime: [],
      // 验证规则
      validate,
      // 是否启用遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 分页数据总条数
      total: 0,
      // 相机表格数据
      cameraList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        page: 1,
        size: 10
      },
      // 下拉列表
      carCategoryOptions: [],
      depotCategoryOptions: [],
      timeCategoryOptions: [],
      // 表单校验
      // 是否打开分配权限的弹出层
      RenewOpen: false,
      RenewHistoryOpen: false,
      // 菜单树的数据
      menuOptions: [],
      // 当前选中持角色ID
      currentRoleId: undefined
    }
  },
  // 勾子
  created() {
    // 查询下拉列表数据
    // this.getSelectData()
    // 查询表格数据
    this.getRoleList()
  },
  // 方法
  methods: {
    // 格式化是否在租
    carStatusFormate() {
      // `this` 指向 vm 实例
      if (this.carStatus === '1') {
        return '在租'
      } else {
        return '不在租'
      }
    },
    // 查询表格数据
    getRoleList() {
      this.loading = true // 打开遮罩
      // listRoleForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
      // this.carTableList = res.data.list
      // this.total = res.data.total
      this.loading = false// 关闭遮罩
      // })
    },
    // 条件查询
    handleQuery() {
      this.getRoleList()
    },
    // 重置查询条件
    resetQuery() {
      this.resetForm('queryForm')
      this.dateRange = []
      this.getRoleList()
    },
    // 分页size变化时触发
    handleSizeChange(val) {
      this.queryParams.size = val
      // 重新查询
      this.getRoleList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.page = val
      // 重新查询
      this.getRoleList()
    },
    handleAccessImg(row) {
      this.currentRoleId = row.carId || this.ids[0]
      this.title = '进出场图片'
      this.RenewHistoryOpen = true
    }
  }
}
</script>
