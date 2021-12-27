<template>
  <div class="container">
    <!-- 标题 -->
    <el-row :gutter="0" style="margin:20px auto">
      <el-col :span="6" :offset="9" style="text-align:center;font-weight:700;padding-top:5px">
        <span>{{ laneName }}</span>
      </el-col>
      <!-- 表格工具按钮开始 -->
      <!-- 查询条件开始 -->
      <el-col :span="7" :offset="2">
        <el-form ref="queryForm" :model="queryParams" :inline="true" align="right">
          <!-- <el-form-item label="是否在线" prop="isOnLine">
            <el-select
              v-model="queryParams.isOnLine"
              placeholder="请选择是否在线"
              clearable
              size="small"
            >
              <i slot="prefix" class="el-input__icon el-icon-guide" />
              <el-option
                v-for="item in options.status"
                :key="item.dictValue"
                :label="item.dictValue==='1'?'在线':'离线'"
                :value="Number(item.dictValue)"
              />
            </el-select>
          </el-form-item> -->
          <el-select
            v-model="queryParams.parkId"
            placeholder="请选择您要查看的车场"
            size="small"
            style="width:220px"
            clearable
            @change="handleLaneName"
          >
            <svg-icon slot="prefix" icon-class="car" style="margin:10px 0 0 6px" />
            <el-option
              v-for="item in options.parkCategory"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              @change="handleParkFocus"
            />
          </el-select>
        <!-- <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="danger" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item> -->
        </el-form>
      </el-col>
    </el-row>
    <!-- 数据表格开始 -->
    <el-table v-loading="loading" border :data="laneList" stripe>
      <el-table-column
        align="center"
        label="车场名称"
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>车场名称: <el-tag type="primary" effect="dark" size="mini">{{ scope.row.parkName }}</el-tag></p>
            <div v-show="scope.row.parkName" slot="reference" class="name-wrapper">
              <el-tag size="medium" style="width:100%;overflow:hidden;text-overflow:ellipsis;">{{ scope.row.parkName }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="车道名称" align="center" prop="name" />
      <el-table-column label="车道类型" align="center" prop="type" :formatter="typeFormatter" />
      <el-table-column label="所属岗亭" align="center" prop="workStationName" />
      <el-table-column label="相机品牌" align="center" prop="cameraBrandType" :formatter="cameraBrandTypeFormatter" />
      <el-table-column label="相机识别码" align="center" prop="cameraSn" width="180" />
      <el-table-column label="相机IP" align="center" prop="cameraIp" />
      <el-table-column label="是否在线" align="center">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.isOnLine===1" type="success" size="mini" effect="dark"><i class="el-icon-check" /> 在线</el-tag>
          <el-tag v-show="scope.row.isOnLine===0" type="danger" size="mini" effect="dark"><i class="el-icon-close" /> 离线</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="控制卡类型" align="center" prop="controllerCard" :formatter="controllerCardFormatter" width="180" />
      <el-table-column label="是否有屏" align="center">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.haveScreen===0" type="danger" size="mini" effect="dark"><i class="el-icon-close" /> 无屏</el-tag>
          <el-tag v-show="scope.row.haveScreen===1" type="success" size="mini" effect="dark"><i class="el-icon-check" /> 有屏</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否显示余位" align="center">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.remainder===0" type="danger" size="mini" effect="dark"><i class="el-icon-close" /> 不显示</el-tag>
          <el-tag v-show="scope.row.remainder===1" type="success" size="mini" effect="dark"><i class="el-icon-check" /> 显示</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页控件开始 -->
    <el-pagination
      v-show="total>0"
      :current-page="queryParams.page"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="queryParams.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="margin-top:10px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
// 引入api
import {
  getLaneByMid
} from '@/api/system/carSetting'
import { listAll } from '@/api/coupons/couponsManger'

export default {
  name: 'LaneSet',
  // 定义页面数据
  data() {
    return {
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
      // 表格数据
      laneList: [],
      laneName: '',
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        parkId: undefined
      },
      parkId: undefined,
      // 遍历数据
      options: {
        // 是否状态
        status: [],
        parkCategory: []
      }
    }
  },
  // 勾子
  created() {
    // 获取车道类型字典数据
    this.getDataByType('LaneTypeDic').then(res => {
      this.options.laneCategory = res.data
    })
    // 获取相机品牌字典
    this.getDataByType('CameraBrandTypeDic').then(res => {
      this.options.cameraBrandType = res.data
    })
    // 获取控制卡类型字典
    this.getDataByType('ControllerBrandTypeDic').then(res => {
      this.options.controllerCard = res.data
    })
    // 获取是否字典
    this.getDataByType('yesOrNo').then(res => {
      this.options.status = res.data
    })
    // 获取车场列表数据
    listAll().then(res => {
      this.options.parkCategory = res.data
      this.parkId = res.data[0].id
    })
    // 查询表格数据
    this.getlaneList()
  },
  // mounted() {
  //   this.timer = setInterval(() => {
  //     this.getlaneList()
  //   }, 5000)
  // },
  // beforeDestroy() {
  //   clearInterval(this.timer)
  // },
  // 方法
  methods: {
    handleParkFocus() {
      this.getlaneList()
    },
    handleLaneName(val) {
      if (val === '') {
        this.laneName = ''
        this.getlaneList()
      } else {
        this.getlaneList()
        for (const key in this.options.parkCategory) {
          if (this.options.parkCategory[key].id === val) {
            this.laneName = this.options.parkCategory[key].name
          }
        }
      }
    },
    // 翻译车道类型
    typeFormatter(row) {
      if (row.type) {
        return this.selectDictLabel(this.options.laneCategory, row.type.toString())
      }
    },
    // 翻译相机品牌
    cameraBrandTypeFormatter(row) {
      if (row.cameraBrandType !== null) {
        return this.selectDictLabel(this.options.cameraBrandType, row.cameraBrandType.toString())
      }
    },
    // 翻译控制卡类型
    controllerCardFormatter(row) {
      if (row.controllerCard !== null) {
        return this.selectDictLabel(this.options.controllerCard, row.controllerCard.toString())
      }
    },
    // 查询表格数据
    getlaneList() {
      this.loading = true // 打开遮罩
      getLaneByMid(this.queryParams).then(res => {
        this.laneList = res.data.lane.list
        this.total = res.data.lane.total
        this.loading = false// 关闭遮罩
      }).catch(() => {
        this.loading = false// 关闭遮罩
      })
    },
    // 查询
    handleQuery() {
      this.getlaneList()
    },
    // 重置查询
    resetQuery() {
      this.resetForm('queryForm')
      this.queryParams.managerId = this.manageridBak
      this.queryParams.page = 1
      this.queryParams.size = 10
      this.getlaneList()
    },
    // 分页size变化时触发
    handleSizeChange(val) {
      this.queryParams.size = val
      // 重新查询
      this.getlaneList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.page = val
      // 重新查询
      this.getlaneList()
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
width: 95%;
margin: 0 auto;
}
</style>
