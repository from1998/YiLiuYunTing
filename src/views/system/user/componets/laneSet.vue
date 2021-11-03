<template>
  <div class="container">
    <el-header height="36px" style="padding:15px 0 45px;font-weight:700" align="center">
      <el-col :span="4" :offset="10" style="text-align:center">
        车道设置
      </el-col>
      <el-col :span="3" :offset="7">
        <el-button type="success" size="mini" @click="handleAccess(sn,'pre')">
          <svg-icon icon-class="qrcode" />
          预付款二维码
        </el-button>
      </el-col>
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
            <el-button type="danger" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
      <el-table-column label="相机IP" align="center" prop="cameraIp" width="120px" />
      <el-table-column label="是否在线" align="center">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.isOnLine===0" type="danger" size="mini" effect="dark"><i class="el-icon-close" />离线</el-tag>
          <el-tag v-show="scope.row.isOnLine===1" type="success" size="mini" effect="dark"><i class="el-icon-check" />在线</el-tag>
        </template>
      </el-table-column>
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
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          <el-button
            v-if="scope.row.type===1"
            type="text"
            size="mini"
            @click="handleAccess(scope.row,'in')"
          >
            <svg-icon icon-class="qrcode" />
            无牌进场二维码
          </el-button>
          <el-button
            v-if="scope.row.type===2"
            type="text"
            size="mini"
            @click="handleAccess(scope.row,'out')"
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
      width="660px"
      center
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" label-width="110px" :rules="rules">
        <el-row>
          <el-col :span="12" :offset="0">
            <!-- 车道名称 -->
            <el-form-item label="车道名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入车道名称" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <!-- 车道类型 -->
            <el-form-item label="车道类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择车道类型" size="small" clearable>
                <el-option
                  v-for="item in options.laneCategory"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="0">
            <!-- 所属岗亭 -->
            <el-form-item label="所属岗亭">
              <el-select v-model="form.workstationId" placeholder="请选择所属岗亭" size="small" clearable>
                <el-option
                  v-for="item in options.watchhouseName"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <!-- 相机品牌 -->
            <el-form-item label="相机品牌" prop="cameraBrandType">
              <el-select v-model="form.cameraBrandType" placeholder="请选择相机品牌" size="small" clearable>
                <el-option
                  v-for="item in options.cameraBrandType"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" :offset="0">        <!-- 相机识别码 -->
            <el-form-item label="相机识别码" prop="cameraSn">
              <el-input v-model="form.cameraSn" placeholder="请输入相机识别码" clearable size="small" />
            </el-form-item></el-col>
          <el-col :span="12" :offset="0">        <!-- 相机IP -->
            <el-form-item label="相机IP" prop="cameraIp">
              <el-input v-model="form.cameraIp" placeholder="请输入相机IP" clearable size="small" />
            </el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="0">        <!-- 控制卡类型 -->
            <el-form-item label="控制卡类型" prop="controllerCard">
              <el-select v-model="form.controllerCard" placeholder="请选择控制卡类型" size="small" clearable>
                <el-option
                  v-for="item in options.controllerCard"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item></el-col>
          <el-col :span="12" :offset="0">        <!-- 是否有屏 -->
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
            </el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="0">        <!-- 屏幕行数 -->
            <el-form-item v-show="form.haveScreen === 1" label="屏幕行数">
              <el-select v-model="form.lineCount" placeholder="请选择屏幕行数" size="small" clearable>
                <el-option
                  v-for="item in options.screenLines"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item></el-col>
          <el-col :span="12" :offset="0">        <!-- 是否显示余位 -->
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
            </el-form-item></el-col>
        </el-row>

        <div v-show="form.haveScreen === 1" :gutter="0">
          <el-row>
            <el-col :span="12" :offset="0">          <!-- 广告一 -->
              <el-form-item label="广告一">
                <el-input v-model="form.ggOne" placeholder="请输入广告一" clearable size="small" />
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">          <!-- 广告二 -->
              <el-form-item label="广告二">
                <el-input v-model="form.ggTwo" placeholder="请输入广告二" clearable size="small" />
              </el-form-item></el-col>
          </el-row>

          <el-row>
            <el-col :span="12" :offset="0">          <!-- 广告三 -->
              <el-form-item v-show="form.lineCount === 4" label="广告三">
                <el-input v-model="form.ggThree" placeholder="请输入广告三" clearable size="small" />
              </el-form-item></el-col>
            <el-col :span="12" :offset="0">          <!-- 广告四 -->
              <el-form-item v-show="form.lineCount === 4" label="广告四">
                <el-input v-model="form.ggFour" placeholder="请输入广告四" clearable size="small" />
              </el-form-item></el-col>
          </el-row>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 二维码 -->
    <canvas v-show="false" id="canvas" />
    <!-- 联系方式 -->
    <canvas v-show="false" id="textCanvas" />
    <!-- 车道 -->
    <canvas v-show="false" id="laneCanvas" />
    <!-- 二维码弹出层 -->
    <el-dialog
      :title="qrcodeTitle"
      :visible.sync="qrcodeDialogVisible"
      width="770px"
      center
      :close-on-click-modal="false"
    >
      <canvas
        id="myCanvas"
        width="720"
      />
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading" type="success" icon="el-icon-s-opportunity" @click="handleEmergency">设置应急联系方式</el-button>
        <el-button :loading="loading" type="primary" icon="el-icon-download" @click="handleDownload">下载</el-button>
        <el-button :loading="loading" type="warning" icon="el-icon-refresh" @click="handleChangeStyle">换个样式</el-button>
        <el-button type="danger" icon="el-icon-close" @click="qrcodeDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 应急联系方式弹出层设置 -->
    <el-dialog
      title="应急联系方式设置"
      :visible.sync="emergencyOpen"
      width="500px"
      center
      append-to-body
      :close-on-click-modal="false"
    >
      <el-input v-model="emergencyPhone" clearable size="small" placeholder="请输入应急联系方式" @keyup.enter.native="handleEmergencyConfirm" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleEmergencyConfirm">确 定</el-button>
        <el-button @click="emergencyOpen = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 引入api
import {
  getLaneByMid,
  getLaneById,
  addLane,
  updateLane,
  deleteLaneById,
  getQrcodeDoMain
} from '@/api/system/carSetting'
import QRCode from 'qrcode'
import { prod_url } from '../../../../../proxyConfig/pro.env'
import validate from '@/utils/validate'

export default {
  name: 'LaneSet',
  // 定义页面数据
  data() {
    return {
      id: '',
      // 图片下载地址
      src: '',
      qrcodeTitle: '',
      qrcodeBg: '', // 二维码背景图
      // 二维码是否弹出
      qrcodeDialogVisible: false,
      // 应急联系方式设置
      emergencyOpen: false,
      // 应急联系方式
      emergencyPhone: undefined,
      // 应急联系方式的dataUrl
      emergencyPhoneImg: undefined,
      // 车道的dataUrl
      laneImg: undefined,
      // 二维码的dataUrl
      qrcodeUrl: '',
      // 生成二维码的url
      creatCodeUrl: '',
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
        managerId: ''
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
        managerId: undefined,
        ggOne: '一流云停',
        ggTwo: '与你同行',
        ggThree: '与你同行',
        ggFour: '与你同行'

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
        watchhouseName: [],
        // 车场sn
        sn: ''
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
    this.queryParams.managerId = this.manageridBak = this.form.managerId = this.$route.params && this.$route.params.id // 路由传参
    // 查询表格数据
    this.getlaneList()
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
        this.options.watchhouseName = res.data.workStation
        this.total = res.data.total
        this.sn = res.data.sn
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
      this.getlaneList()
    },
    // 打开修改的弹出层
    handleUpdate(row) {
      this.title = '修改车道'
      const id = row.id || this.ids[0]
      // console.log(id)
      // const dictId = row.dictId === undefined ? this.ids[0] : row.dictId
      this.open = true
      this.reset()
      // 根据id查询车道信息
      this.loading = true
      this.getlaneList()
      getLaneById({
        id: id
      }).then(res => {
        this.form = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false// 关闭遮罩
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
          this.msgSuccess(res.msg)
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
    // 确认二维码应急联系方式
    async handleEmergencyConfirm() {
      window.localStorage.setItem(this.id, this.emergencyPhone)
      await this.createText(this.emergencyPhone)
      await this.drawqrCodeImage(this.qrcodeBg, this.qrcodeUrl, this.emergencyPhoneImg, this.laneImg)
      this.emergencyOpen = false
    },
    // 设置二维码应急联系方式
    handleEmergency() {
      this.emergencyOpen = true
    },
    // 点击查看二维码
    async handleAccess(row, type) {
      if (typeof (row) === 'string') {
        this.qrcodeBg = require('@/assets/images/prePayBg1.jpg')
      } else {
        this.id = row.id
        if (row.type === 1) {
          this.qrcodeBg = require('@/assets/images/accessInBg1.jpg')
        } else {
          this.qrcodeBg = require('@/assets/images/accessOutBg1.jpg')
        }
      }
      // const id = this.encode64(row.id.toString())
      this.qrcodeDialogVisible = true
      await getQrcodeDoMain().then(async res => {
        // await this.encode64(row.parkSn)
        // await this.encode64(row.id)
        if (type === 'in') {
          this.qrcodeTitle = '无牌车进场请扫码'
          this.creatCodeUrl = res.data + prod_url + '/third/no_plate_enter_' + row.parkSn + '_' + row.id
        } else if (type === 'out') {
          this.qrcodeTitle = '出场支付请扫码'
          this.creatCodeUrl = res.data + prod_url + '/third/leave_code_' + row.parkSn + '_' + row.id
        } else {
          this.qrcodeTitle = '预付款请扫码'
          this.creatCodeUrl = res.data + prod_url + '/third/index_' + row
        }
      })
      this.emergencyPhone = await window.localStorage.getItem(row.id)
      await this.createQrcode(this.creatCodeUrl)
      await this.createText(this.emergencyPhone)
      await this.createLane(row.name)
      this.drawqrCodeImage(this.qrcodeBg, this.qrcodeUrl, this.emergencyPhoneImg, this.laneImg)
    },
    // 生成二维码
    createQrcode(text) {
      const canvas = document.getElementById('canvas')
      QRCode.toCanvas(canvas, text, {
        margin: 0
      })
      const data = canvas.toDataURL('image/png', 1)
      this.qrcodeUrl = data
    },
    // 生成应急联系方式
    createText(text) {
      if (text === null) {
        text = ''
      }
      const canvas = document.getElementById('textCanvas')
      canvas.style.letterSpacing = '5px'
      var context = canvas.getContext('2d')
      context.clearRect(0, 0, 300, 150)
      context.font = '18px KaiTi KaiTi_GB2312'
      context.fillStyle = '#FFF'
      context.fillText(text, 10, 50)
      this.emergencyPhoneImg = canvas.toDataURL('image/png', 1)
    },
    // 生成车道
    createLane(text) {
      if (text === undefined) {
        text = '预付款'
      }
      const canvas = document.getElementById('laneCanvas')
      canvas.width = 500
      canvas.height = 150
      // canvas.style.letterSpacing = '8px'
      var context = canvas.getContext('2d')
      context.clearRect(0, 0, 500, 150)
      context.font = '26px KaiTi KaiTi_GB2312'
      context.fillStyle = '#fff'
      context.fillText('<<=== ' + text + ' ===>>', (canvas.width - context.measureText(text).width) / 4, 30)
      this.laneImg = canvas.toDataURL('image/png', 1)
    },
    // img1背景图、img2二维码
    drawqrCodeImage(bgImg, qrCodeImg, emergency, lane) {
      const canvas = document.getElementById('myCanvas')
      canvas.width = 720
      canvas.height = 446
      const context = canvas.getContext('2d')
      context.rect(0, 0, canvas.width, canvas.height)
      context.fillStyle = '#FFF'
      context.fill()
      const bgImage = new Image()
      bgImage.src = bgImg
      bgImage.crossOrigin = 'Anonymous'
      bgImage.onload = () => {
        context.drawImage(bgImage, 0, 0, 720, 446)
        const that = this
        function func1() {
          const qrCodeImage = new Image()
          qrCodeImage.src = qrCodeImg
          qrCodeImage.crossOrigin = 'Anonymous'
          qrCodeImage.onload = () => {
            context.drawImage(qrCodeImage, 58, 149, 180, 180)
          }
        }

        function func2() {
          const laneImage = new Image()
          laneImage.src = lane
          laneImage.crossOrigin = 'Anonymous'
          laneImage.onload = () => {
            context.drawImage(laneImage, 228, 100, 500, 150)
          }
        }

        function func3() {
          const emergencyImg = new Image()
          emergencyImg.src = emergency
          emergencyImg.crossOrigin = 'Anonymous'
          emergencyImg.onload = () => {
            context.drawImage(emergencyImg, 182, 369, 300, 150)
            const base64 = canvas.toDataURL('image/png')
            const img = document.getElementById('myCanvas')
            img.setAttribute('src', base64)
            that.src = base64
          }
        }
        func1()
        func2()
        func3()
      }
    },
    // 二维码下载
    handleDownload() {
      this.loading = true
      var a = document.createElement('a')
      var event = new MouseEvent('click')
      if (this.qrcodeTitle === '无牌车进场请扫码') {
        a.download = '无牌车进场二维码'
      } else if (this.qrcodeTitle === '出场支付请扫码') {
        a.download = '出场支付二维码'
      } else {
        a.download = '预付款二维码'
      }
      a.href = this.src
      a.dispatchEvent(event)
      this.loading = false
    },
    // 二维码换个样式
    handleChangeStyle() {
      switch (this.qrcodeBg) {
        case require('@/assets/images/accessInBg1.jpg'):
          this.qrcodeBg = require('@/assets/images/accessInBg2.jpg')
          break
        case require('@/assets/images/accessInBg2.jpg'):
          this.qrcodeBg = require('@/assets/images/accessInBg1.jpg')
          break
        case require('@/assets/images/accessOutBg1.jpg'):
          this.qrcodeBg = require('@/assets/images/accessOutBg2.jpg')
          break
        case require('@/assets/images/accessOutBg2.jpg'):
          this.qrcodeBg = require('@/assets/images/accessOutBg1.jpg')
          break
        case require('@/assets/images/prePayBg1.jpg'):
          this.qrcodeBg = require('@/assets/images/prePayBg2.jpg')
          break
        case require('@/assets/images/prePayBg2.jpg'):
          this.qrcodeBg = require('@/assets/images/prePayBg1.jpg')
          break
      }
      this.drawqrCodeImage(this.qrcodeBg, this.qrcodeUrl, this.emergencyPhoneImg, this.laneImg)
    },
    // 保存
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 做添加
          this.loading = true
          if (this.form.id === undefined) {
            addLane(this.form).then((res) => {
              this.msgSuccess(res.msg)
              this.loading = false
              this.getlaneList()// 列表重新查询
              this.open = false// 关闭弹出层
            }).catch(() => {
              this.loading = false
            })
          } else { // 做修改
            updateLane(this.form).then(res => {
              this.msgSuccess(res.msg)
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
      this.form.managerId = this.manageridBak
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
