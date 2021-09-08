<template>
  <div class="container">
    <el-header height="36px" style="padding:15px 0 45px;font-weight:700" align="center">
      车道设置
    </el-header>
    <el-row>
      <!-- 表格工具按钮开始 -->
      <el-col :span="5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <!-- 查询条件开始 -->
      <el-col :span="18" :offset="1">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="车道名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入车道名称"
              clearable
              size="small"
            />
          </el-form-item>
          <el-form-item label="所属岗亭" prop="workstationId">
            <el-select v-model="queryParams.workstationId" placeholder="请选择所属岗亭" size="small" clearable>
              <el-option
                v-for="item in options.watchhouseName"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="车道类型" prop="type">
            <el-select
              v-model="queryParams.type"
              placeholder="请选择车道类型"
              clearable
              size="small"
            >
              <el-option
                v-for="item in options.laneCategory"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="Number(item.dictValue)"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 数据表格开始 -->
    <el-table v-loading="loading" border :data="laneList" stripe @selection-change="handleSelectionChnage">
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column label="车道名称" align="center" prop="name" />
      <el-table-column label="车道类型" align="center" prop="type" :formatter="typeFormatter" />
      <el-table-column label="所属岗亭" align="center" prop="workStationName" />
      <el-table-column label="相机品牌" align="center" prop="cameraBrandType" :formatter="cameraBrandTypeFormatter" />
      <el-table-column label="相机识别码" align="center" prop="cameraSn" />
      <el-table-column label="相机IP" align="center" prop="cameraIp" />
      <el-table-column label="是否在线" align="center" prop="isOnLine" :formatter="statusFormatter" />
      <el-table-column label="控制卡类型" align="center" prop="controllerCard" :formatter="controllerCardFormatter" />
      <el-table-column label="是否有屏" align="center" prop="haveScreen" :formatter="statusFormatter" />
      <el-table-column label="是否显示余位" align="center" prop="remainder" :formatter="statusFormatter" />
      <!-- <el-table-column label="闸口状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.gateState"
            :active-text="scope.row.gateState?'开闸':'关闸'"
            @change="gateStateChanged(scope.row)"
          />
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" width="280">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDelete(scope.row)">删除</el-button>
          <el-button
            v-if="scope.row.type==='入口'"
            type="text"
            size="mini"
            @click="handleIn(scope.row)"
          >
            <svg-icon icon-class="qrcode" />
            无牌进场二维码
          </el-button>
          <el-button
            v-if="scope.row.type==='出口'"
            type="text"
            size="mini"
            @click="handleOut(scope.row)"
          >
            <svg-icon icon-class="pay" />
            出场支付二维码
          </el-button>
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
    <!-- 添加修改弹出层开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      center
    >
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <!-- 车道名称 -->
        <el-form-item label="车道名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入车道名称" clearable size="small" />
        </el-form-item>
        <!-- 车道类型 -->
        <el-form-item label="车道类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择车道类型" size="small">
            <el-option
              v-for="item in options.laneCategory"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="Number(item.dictValue)"
            />
          </el-select>
        </el-form-item>
        <!-- 所属岗亭 -->
        <el-form-item label="所属岗亭">
          <el-select v-model="form.workstationId" placeholder="请选择所属岗亭" size="small">
            <el-option
              v-for="item in options.watchhouseName"
              :key="item.id"
              :label="item.name"
              :value="Number(item.id)"
            />
          </el-select>
        </el-form-item>
        <!-- 相机品牌 -->
        <el-form-item label="相机品牌" prop="cameraBrandType">
          <el-select v-model="form.cameraBrandType" placeholder="请选择相机品牌" size="small">
            <el-option
              v-for="item in options.cameraBrandType"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="Number(item.dictValue)"
            />
          </el-select>
        </el-form-item>
        <!-- 相机识别码 -->
        <el-form-item label="相机识别码" prop="cameraSn">
          <el-input v-model="form.cameraSn" placeholder="请输入相机识别码" clearable size="small" />
        </el-form-item>
        <!-- 相机IP -->
        <el-form-item label="相机IP" prop="cameraIp">
          <el-input v-model="form.cameraIp" placeholder="请输入相机IP" clearable size="small" />
        </el-form-item>
        <!-- 控制卡类型 -->
        <el-form-item label="控制卡类型" prop="controllerCard">
          <el-select v-model="form.controllerCard" placeholder="请选择控制卡类型" size="small">
            <el-option
              v-for="item in options.controllerCard"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="Number(item.dictValue)"
            />
          </el-select>
        </el-form-item>
        <!-- 是否有屏 -->
        <el-form-item label="是否有屏" prop="haveScreen">
          <el-radio-group v-model="form.haveScreen">
            <el-radio
              v-for="item in options.status"
              :key="item.dictValue"
              :label="Number(item.dictValue)"
            >
              {{ item.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 屏幕行数 -->
        <el-form-item v-show="form.haveScreen === 1" label="屏幕行数" prop="lineCount">
          <el-select v-model="form.lineCount" placeholder="请选择屏幕行数" size="small">
            <el-option
              v-for="item in options.screenLines"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="Number(item.dictValue)"
            />
          </el-select>
        </el-form-item>
        <!-- 是否显示余位 -->
        <el-form-item label="是否显示余位" prop="remainder">
          <el-radio-group v-model="form.remainder">
            <el-radio
              v-for="item in options.status"
              :key="item.dictValue"
              :label="Number(item.dictValue)"
            >
              {{ item.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 广告一 -->
        <el-form-item label="广告一">
          <el-input v-model="form.ggone" placeholder="请输入广告一" clearable size="small" />
        </el-form-item>
        <!-- 广告二 -->
        <el-form-item label="广告二">
          <el-input v-model="form.ggtwo" placeholder="请输入广告二" clearable size="small" />
        </el-form-item>
        <!-- 广告三 -->
        <el-form-item label="广告三">
          <el-input v-model="form.ggthree" placeholder="请输入广告三" clearable size="small" />
        </el-form-item>
        <!-- 广告四 -->
        <el-form-item label="广告四">
          <el-input v-model="form.ggfour" placeholder="请输入广告四" clearable size="small" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 二维码弹出层 -->
    <el-dialog
      title="无牌车进场请扫码"
      :visible.sync="qrcodeDialogVisible"
      width="30%"
      center
    >
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading" type="primary" icon="el-icon-download" @click="handleDownload">下载</el-button>
        <el-button type="primary" @click="qrcodeDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 引入api
import { getLaneByMid, getLaneById, addLane, updateLane, deleteLaneById } from '@/api/system/carSetting'
import validate from '@/utils/validate'

export default {
  name: 'LaneSet',
  // 定义页面数据
  data() {
    return {
      // 验证规则
      validate,
      rules: {
        name: validate.notEmpty,
        type: validate.notEmpty,
        cameraBrandType: validate.notEmpty,
        cameraSn: validate.notEmpty,
        cameraIp: validate.notEmpty,
        controllerCard: validate.notEmpty,
        haveScreen: validate.notEmpty,
        lineCount: validate.notEmpty,
        isOnLine: validate.notEmpty,
        remainder: validate.notEmpty
      },
      // 初始表单备份
      formBak: {},
      // 用户id备份
      manageridBak: '',
      // 二维码是否弹出
      qrcodeDialogVisible: false,
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
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        name: '',
        workstationId: '',
        type: '',
        managerid: ''
      },
      // 表单数据
      form: {
        name: '',
        type: '',
        workstationId: '',
        cameraBrandType: '',
        cameraSn: '',
        cameraIp: '',
        controllerCard: '',
        haveScreen: '',
        lineCount: '',
        isOnLine: '',
        remainder: '',
        managerid: undefined
        // gateState: undefined
      },
      // 遍历数据
      options: {
        // 车道类型
        laneCategory: [],
        // 是否状态
        status: [],
        // 屏幕行数
        screenLines: [],
        // 控制卡类型
        controllerCard: [],
        // 相机品牌
        cameraBrandType: [],
        // 所属岗亭
        watchhouseName: []
      }
    }
  },
  // 勾子
  created() {
    // 备份初始表单
    this.formBak = this.form

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
    // 获取屏幕行数字典
    this.getDataByType('LaneLineCountDic').then(res => {
      this.options.screenLines = res.data
    })
    // 获取是否字典
    this.getDataByType('yesOrNo').then(res => {
      this.options.status = res.data
    })
    // 取路由路径上的参数
    this.queryParams.managerid = this.manageridBak = this.form.managerid = this.$route.params && this.$route.params.id // 路由传参
    // 查询表格数据
    this.getlaneList()
  },
  async mounted() {
    await this.bus.$on('watchHouse', val => {
      this.options.watchhouseName = val
    })
  },
  // 方法
  methods: {
    // 翻译是否状态
    statusFormatter(row, column, cellValue) {
      if (cellValue !== null) {
        return this.selectDictLabel(this.options.status, cellValue.toString())
      }
    },
    // 翻译车道类型
    typeFormatter(row) {
      return this.selectDictLabel(this.options.laneCategory, row.type.toString())
    },
    // 翻译相机品牌
    cameraBrandTypeFormatter(row) {
      return this.selectDictLabel(this.options.cameraBrandType, row.cameraBrandType.toString())
    },
    // 翻译控制卡类型
    controllerCardFormatter(row) {
      return this.selectDictLabel(this.options.controllerCard, row.controllerCard.toString())
    },
    // 查询表格数据
    getlaneList() {
      this.loading = true // 打开遮罩
      getLaneByMid(this.queryParams).then(res => {
        this.laneList = res.data.list
        this.total = res.data.total
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
      this.queryParams.managerid = this.manageridBak
      this.getlaneList()
    },
    // 数据表格的多选择框选择时触发
    handleSelectionChnage(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
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
    },
    // 打开添加的弹出层
    handleAdd() {
      this.open = true
      this.reset()
      this.title = '添加车道'
    },
    // 打开修改的弹出层
    handleUpdate(row) {
      this.title = '修改车道'
      const id = row.id || this.ids
      // console.log(id)
      // const dictId = row.dictId === undefined ? this.ids[0] : row.dictId
      this.open = true
      this.reset()
      // 根据id查询车道信息
      this.loading = true
      getLaneById(id).then(res => {
        this.form = res.data
        this.loading = false
      })
    },
    // 执行删除
    handleDelete(row) {
      const id = row.id || this.ids
      this.$confirm('此操作将永久删除该车道数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLaneById(id).then(res => {
          this.msgSuccess('删除成功')
          this.getlaneList()// 全查询
        })
      }).catch(() => {
        this.msgError('删除已取消')
      })
    },
    // 监听 switch 闸口状态的改变
    // async gateStateChanged(row) {
    // const { data: res } = await this.$http.put(
    //   `users/${row.id}/state/${row.gateState}`
    // )
    // if (res.meta.status !== 200) {
    //   row.gateState = !row.gateState
    //   return this.$message.error('更新用户状态失败！')
    // }
    //   this.msgSuccess('闸口状态修改成功！')
    // },
    handleIn() {
      this.qrcodeDialogVisible = true
    },
    // 二维码下载
    handleDownload() {
      this.loading = true
      // import('@/vendor/Export2Excel').then(excel => {
      //   const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
      //   const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
      //   const data = this.formatJson(filterVal)
      //   excel.export_json_to_excel({
      //     header: tHeader,
      //     data,
      //     filename: 'table-list'
      //   })
      //   this.loading = false
      // })
      this.loading = false
    },
    // 保存
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 做添加
          this.loading = true
          if (this.form.id === undefined) {
            addLane(this.form).then(() => {
              this.msgSuccess('保存成功')
              this.loading = false
              this.getlaneList()// 列表重新查询
              this.open = false// 关闭弹出层
            }).catch(() => {
              this.loading = false
            })
          } else { // 做修改
            updateLane(this.form).then(res => {
              this.msgSuccess('修改成功')
              this.loading = false
              this.getlaneList()// 列表重新查询
              this.open = false// 关闭弹出层
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    // 取消
    cancel() {
      this.open = false
      this.title = ''
    },
    // 重置表单
    reset() {
      this.resetForm('form')
      this.form = this.formBak
      this.form.managerid = this.manageridBak
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
width: 80%;
margin: 0 auto;
}
</style>
