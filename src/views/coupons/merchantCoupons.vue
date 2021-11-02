<template>
  <div class="app-container">
    <el-row :gutter="0">
      <el-col :span="6" :offset="9" style="text-align:center;font-weight:700;padding-top:5px">
        <span>{{ laneName }}</span>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px">
      <!-- 表格工具按钮开始 -->
      <el-col v-if="getUserInfo().role !== 7" :span="4" style="width:240px">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">添加商家优惠券</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <!-- 查询条件开始 -->
      <el-col :span="14" :offset="0">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="48px">
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入优惠券名称"
              size="small"
              style="width:180px"
              clearable
            />
          </el-form-item>
          <el-form-item label="类型" prop="category">
            <el-select v-cloak v-model="queryParams.category" clearable style="width:180px" placeholder="请选择优惠券类型" size="small">
              <el-option
                v-for="item in stateOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="Number(item.dictValue)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="付款方式" prop="payType" label-width="70px">
            <el-select v-cloak v-model="queryParams.payType" clearable style="width:180px" placeholder="请选择付款方式" size="small">
              <el-option
                v-for="item in payType"
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
        <!-- 查询条件结束 -->
      </el-col>
      <el-col :span="3" :offset="3">
        <el-select
          v-cloak
          v-show="getUserInfo().role === 1 || getUserInfo().role === 3"
          v-model="queryParams.parkId"
          placeholder="请选择车场"
          size="small"
          style="width:220px;margin-left:26px"
          clearable
          @change="handleLaneName"
        >
          <el-option
            v-for="(item, index) in CarList"
            :key="index"
            :label="item.name"
            :value="Number(item.id)"
          />
        </el-select>
      </el-col>

    </el-row>

    <!-- 数据表格开始 -->
    <el-table
      v-loading="loading"
      border
      :data="carTableList"
      stripe
      @selection-change="handleSelectionChnage"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        align="center"
        label="优惠券名称"
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>优惠券名称: {{ scope.row.name }}</p>
            <div v-show="scope.row.name" slot="reference" class="name-wrapper">
              <el-tag size="medium" style="max-width:100%;overflow:hidden;text-overflow:ellipsis;">{{ scope.row.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.category===1" type="warning" size="mini" effect="dark"><i class="el-icon-coin" /> 代金券</el-tag>
          <el-tag v-show="scope.row.category===2" type="danger" size="mini" effect="dark"><i class="el-icon-time" /> 时间券</el-tag>
          <el-tag v-show="scope.row.category===3" type="primary" size="mini" effect="dark"><i class="el-icon-money" /> 折扣券</el-tag>
          <el-tag v-show="scope.row.category===4" type="success" size="mini" effect="dark"><i class="el-icon-check" /> 全免券</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="所属商户"
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>所属商户: {{ scope.row.merchantIdString }}</p>
            <div v-show="scope.row.merchantIdString" slot="reference" class="name-wrapper">
              <el-tag size="medium" style="max-width:100%;overflow:hidden;text-overflow:ellipsis;">{{ scope.row.merchantIdString }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="总数" align="center">
        <template slot-scope="scope">
          <el-tag type="info" size="mini" effect="dark">{{ scope.row.total }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="剩余" align="center">
        <template slot-scope="scope">
          <el-tag type="danger" size="mini" effect="dark">{{ scope.row.residue }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="优惠力度" align="center">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.category===1" type="success" size="mini" effect="dark">减免￥{{ scope.row.discount }}元</el-tag>
          <el-tag v-show="scope.row.category===2" type="success" size="mini" effect="dark"> <i class="el-icon-time" /> {{ scope.row.discount }}分钟内免费</el-tag>
          <el-tag v-show="scope.row.category===3" type="success" size="mini" effect="dark">{{ scope.row.discount }}折</el-tag>
          <el-tag v-show="scope.row.category===4" type="success" size="mini" effect="dark"><i class="el-icon-check" /> 费用全免</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" align="center">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.payType===1" type="warning" size="mini" effect="dark"><i class="el-icon-coin" /> 余额</el-tag>
          <el-tag v-show="scope.row.payType===2" type="primary" size="mini" effect="dark">
            <svg-icon icon-class="zhifubaozhifu" /> 支付宝
          </el-tag>
          <el-tag v-show="scope.row.payType===3" type="success" size="mini" effect="dark">
            <svg-icon icon-class="weixin" /> 微信
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="handlePreview(scope.row)"
          >
            <svg-icon icon-class="qrcode" />
            查看二维码
          </el-button>
          <el-button v-if="getUserInfo().role !== 7" type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-edit" size="mini" @click="grant(scope.row)">发放</el-button>
          <el-button v-if="getUserInfo().role !== 7" type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 分页控件结束 -->
    <!--  发放  -->
    <el-dialog
      width="450px"
      center
      append-to-body
      title="发放优惠券"
      :visible.sync="grantShow"
      :close-on-click-modal="false"
    >
      <el-form
        ref="grantForm"
        :model="grantForm"
        label-width="70px"
        :rules="rules"
      >
        <el-form-item label="车牌号" prop="carNumber">
          <el-input v-model="grantForm.carNumber" placeholder="请输入发放对象的车牌号" size="normal" clearable />
        </el-form-item>
        <!--      <el-form-item label="优惠券唯一识别码" prop="sn">-->
        <!--        <el-input v-model="grantForm.sn" placeholder="优惠券唯一识别码" clearable size="small" />-->
        <!--      </el-form-item>-->

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="grantSubmit">确 定</el-button>
        <el-button @click="grantCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 添加修改弹出层开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      center
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" label-width="110px" :rules="rules">
        <el-form-item
          v-if="roleId === 1 && title === '添加商家优惠券' "
          label="车场"
          prop="parkId"
        >
          <el-select
            v-cloak
            v-model="form.parkId"
            placeholder="请选择车场"
            style="width:330px"
            @change="getShopName"
          >
            <el-option
              v-for="(item, index) in CarList"
              :key="index"
              :label="item.name"
              :value="Number(item.id)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属优惠劵" prop="couponsId">
          <el-select
            v-model="form.couponsId"
            placeholder="请选择所属优惠劵"
            clearable
            size="small"
            style="width:330px"
          >
            <el-option
              v-for="(d,index) in listCoupons"
              :key="index"
              :label="d.name"
              :value="Number(d.id)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属商家" prop="merchantId">
          <el-tooltip class="item" effect="dark" content="请先选择车场再选择该字段" placement="bottom">
            <el-select
              v-model="form.merchantId"
              placeholder="请选择所属商家"
              clearable
              size="small"
              style="width:330px"
            >
              <el-option
                v-for="d in shopList"
                :key="d.dictValue"
                :label="d.dictLabel"
                :value="String(d.username)"
              />
            </el-select>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="优惠券名称" prop="name">
          <el-input v-model="form.name" placeholder="商家优惠券名称" clearable size="small" style="width: 330px" />
        </el-form-item>
        <el-form-item label="总数" prop="total">
          <el-input v-model="form.total" placeholder="发放总数" clearable size="small" style="width: 330px" />
        </el-form-item>
        <el-form-item label="剩余" prop="residue">
          <el-input v-model="form.residue" placeholder="剩余数量" clearable size="small" style="width: 330px" />
        </el-form-item>
        <el-form-item label="优惠力度" prop="discount">
          <el-tooltip class="item" effect="dark" content="时间劵：单位为分钟;  代金劵：单位是元;  折扣劵：小数,例如9折为0.9" placement="bottom">
            <el-input v-model="form.discount" placeholder="请输入优惠力度" clearable size="small" style="width: 330px" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="是否立即生效" prop="isEffectiveNow">
          <el-select
            v-model="form.isEffectiveNow"
            placeholder="请选择是否立即生效"
            clearable
            size="small"
            style="width:330px"
            @change="isEffective"
          >
            <el-option
              v-for="d in YesOrNo"
              :key="d.dictValue"
              :label="d.dictLabel"
              :value="Number(d.dictValue)"
            />
          </el-select>
          <el-date-picker
            v-if="form.isEffectiveNow === 0"
            v-model="form.effectiveTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            clearable
            size="small"
            placeholder="请选择生效时间"
            align="center"
          />
        </el-form-item>
        <el-form-item label="是否按天有效" prop="isExpireDay">
          <el-select
            v-model="form.isExpireDay"
            placeholder="请选择是否按天有效"
            clearable
            size="small"
            style="width:330px"
          >
            <el-option
              v-for="d in dayList"
              :key="d.dictValue"
              :label="d.dictLabel"
              :value="Number(d.dictValue)"
            />
          </el-select>
          <el-date-picker
            v-if="form.isExpireDay === 0"
            v-model="form.expireTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择失效时间"
            type="date"
          />
          <el-input v-if="form.isExpireDay=== 1" v-model="form.days" placeholder="有效期(天)" size="small" style="width: 330px" />
        </el-form-item>
        <el-form-item label="付款方式" prop="payType">
          <el-select
            v-model="form.payType"

            placeholder="请选择付款方式"
            clearable
            size="small"
            style="width:330px"
          >
            <el-option
              v-for="d in payType"
              :key="d.dictValue"
              :label="d.dictLabel"
              :value="Number(d.dictValue)"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 二维码弹出层 -->
    <el-dialog
      :title="qrTitle"
      :visible.sync="qrcodeDialogVisible"
      width="300px"
      center
      :close-on-click-modal="false"
    >
      <!-- 二维码 -->
      <canvas v-show="true" id="canvas" />
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading" type="primary" icon="el-icon-download" @click="handleDownload">下载</el-button>
        <el-button type="danger" icon="el-icon-close" @click="qrcodeDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { listMerchantForPage, addMerchant, getMerchantCouponsById, updateMerchantCoupons, deleteMerchantCoupons, getMerchantCoupons, selectMerchantByParkId, selectCouponsByParkId } from '@/api/coupons/merchant'
import { listAll } from '@/api/coupons/couponsManger'
import validate from '@/utils/validate'
import { getQrcodeDoMain } from '@/api/system/carSetting'
import { prod_url } from '../../../proxyConfig/pro.env'
import QRCode from 'qrcode'
export default {
  // 定义页面数据
  data() {
    return {
      // 图片下载地址
      src: '',
      // 二维码是否弹出
      qrcodeDialogVisible: false,
      // 生成二维码的url
      creatCodeUrl: '',
      // 验证规则
      validate,
      rules: {
        residue: validate.notEmpty,
        payType: validate.notEmpty,
        name: validate.notEmpty,
        discount: validate.notEmpty,
        isEffectiveNow: validate.notEmpty,
        total: validate.notEmpty,
        parkId: validate.notEmpty,
        category: validate.notEmpty,
        couponsId: validate.notEmpty,
        merchantId: validate.notEmpty,
        carNumber: validate.carNumber
      },
      carTableList: [],
      // 是否启用遮罩层
      loading: false,
      // 选中数组
      ids: [],

      id: '', // 用户id
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 分页数据总条数
      total: 0,
      // 字典表格数据
      roleTableList: [],
      // 弹出层标题
      title: '',
      qrTitle: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        parkId: undefined,
        payType: undefined,
        category: undefined,
        name: undefined
      },
      // 表单数据
      form: {
        status: '1',
        days: ''
        // expireTime:''
      },
      grantForm: {
        carNumber: ''
      }, // 发放表单
      // 是否打开分配权限的弹出层
      selectMenuOpen: false,
      // 菜单树的数据
      menuOptions: [],
      // 当前选中持角色ID
      currentRoleId: undefined,
      categoryList: [], // 优惠券类型
      shopList: [], // 商家名称
      YesOrNo: [], // 是否生效
      dayList: [], // 是否按天生效
      payType: [], // 付款方式
      isShow: false, // 是否立即生效
      isShow1: false, // 是否按天有效
      dayType: undefined,
      listCoupons: [],
      grantShow: false,
      CarList: [],
      stateOptions: [],
      parkId: '',
      laneName: ''
    }
  },
  // 勾子
  created() {
    // 使用全局的根据字典类型查询字典数据的方法查询字典数据  2禁用 1正常 优惠券类型
    this.getDataByType('CouponsCategoryDic').then((res) => {
      this.stateOptions = res.data
    })
    // 使用全局的根据字典类型查询字典数据的方法查询字典数据
    this.getDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
    // 获取是否字典
    this.getDataByType('yesOrNo').then(res => {
      this.YesOrNo = res.data
      this.dayList = res.data
    })
    // 获取 付款方式 字典
    this.getDataByType('CouponsPayTypeDic').then(res => {
      this.payType = res.data
    })
    // 查询表格数据
    this.getMerchantCouponsList()
    // this.getShopName()
    this.roleId = this.getUserInfo().role
    this.id = this.getUserInfo().id
    this.getCarList()
  },
  // 方法
  methods: {
    // 生成二维码
    createQrcode(text) {
      const canvas = document.getElementById('canvas')
      QRCode.toCanvas(canvas, text, {
        margin: 12
      })
      this.src = canvas.toDataURL('image/png', 1)
    },
    async handlePreview(row) {
      this.qrcodeDialogVisible = true
      this.qrTitle = row.name
      await getQrcodeDoMain().then(async res => {
        this.creatCodeUrl = res.data + prod_url + '/third/coupons_code_' + row.parkSn + '_' + row.sn
      })
      this.createQrcode(this.creatCodeUrl)
    },
    // 二维码下载
    handleDownload() {
      this.loading = true
      var a = document.createElement('a')
      var event = new MouseEvent('click')
      a.download = '优惠券二维码'
      a.href = this.src
      a.dispatchEvent(event)
      this.loading = false
    },
    handleLaneName(val) {
      if (val === '') {
        this.laneName = ''
        this.getMerchantCouponsList()
      } else {
        this.getMerchantCouponsList()
        for (const key in this.CarList) {
          if (this.CarList[key].id === val) {
            this.laneName = this.CarList[key].name
          }
        }
      }
    },
    // 获取车厂信息
    getCarList() {
      listAll().then(res => {
        this.CarList = res.data
        this.queryParams.parkId = this.roleId === 1 ? '' : res.data[0].id
      }).catch(err => {
        console.log(err)
      })
    },
    // 发放确定按钮
    grantSubmit() {
      this.$refs['grantForm'].validate((valid) => {
        if (valid) {
          getMerchantCoupons({
            sn: this.grantForm.sn,
            carNumber: this.grantForm.carNumber
          }).then(res => {
            this.msgSuccess(res.msg)
            this.grantShow = false
            this.getMerchantCouponsList()
          })
        }
      })
    },
    // 发放弹出层隐藏
    grantCancel() {
      this.grantShow = false
    },
    // 发放按钮
    grant(row) {
      // console.log(this.grantForm.carNumber)
      this.grantShow = true
      getMerchantCouponsById({
        id: row.id
      }).then(res => {
        this.grantForm = res.data
      })
    },
    // 翻译类型 优惠卷类型
    // carTypeFormatter(row) {
    //   return this.selectDictLabel(this.stateOptions, row.category.toString())
    // },
    // 翻译状态 是否立即生效
    statusFormatter(row) {
      return this.selectDictLabel(this.YesOrNo, row.isEffectiveNow.toString())
    },
    // 是否立即失效
    isEffective(e) {
      if (e === 0) {
        this.isShow = true
      } else {
        this.isShow = false
        this.form.effectiveTime = ''
      }
    },
    // 所属商家列表
    getShopName(e) {
      // this.form.parkId = this.queryParams.parkId
      if (e) {
        this.form.parkId = e
      }
      selectCouponsByParkId({
        id: this.form.parkId
      }).then(res => {
        this.listCoupons = res.data.data
      }).catch(err => {
        console.log(err)
      })
      selectMerchantByParkId({
        id: this.form.parkId
      }).then(res => {
        this.shopList = res.data
      }).catch(err => {
        console.log(err)
      })
    },

    // 翻译类型 优惠券
    // carTypeFormatter(row) {
    //   return this.selectDictLabel(this.stateOptions, row.couponsId.toString())
    // },
    // 查询表格数据
    getMerchantCouponsList() {
      this.loading = true // 打开遮罩
      listMerchantForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.carTableList = res.data.list
        this.total = res.data.total
        this.loading = false// 关闭遮罩
      })
    },
    // 条件查询
    handleQuery() {
      // var arr = this.CarList.filter(item => {
      //   return item.name === this.queryParams.parkId
      // })
      // this.queryParams.parkId = arr[0].id
      this.getMerchantCouponsList()
    },
    // 重置查询条件
    resetQuery() {
      this.resetForm('queryForm')
      if (this.roleId === 4) {
        this.queryParams.parkId = this.CarList[0].id
      }
      if (this.roleId === 1) {
        this.queryParams.parkId = ''
      }
      this.dateRange = []
      this.getMerchantCouponsList()
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
      this.getMerchantCouponsList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.page = val
      // 重新查询
      this.getMerchantCouponsList()
    },
    // 翻译状态
    // statusFormatter(row) {
    //   return this.selectDictLabel(this.statusOptions, row.status)
    // },
    // 打开添加的弹出层
    handleAdd() {
      this.open = true
      this.reset()
      this.title = '添加商家优惠券'
      if (this.roleId === 4) {
        this.parkId = this.queryParams.parkId
        this.getShopName(this.parkId)
      }
    },
    // 打开修改的弹出层
    handleUpdate(row) {
      this.parkId = row.parkId
      this.getShopName(this.parkId)
      this.title = '修改' + row.name
      // const roleId = row.roleId || this.ids
      // const dictId = row.dictId === undefined ? this.ids[0] : row.dictId
      this.open = true
      this.reset()
      // 根据dictId查询一个字典信息
      this.loading = true
      getMerchantCouponsById({
        id: row.id
      }).then(res => {
        this.form = res.data
        const arr = this.shopList.filter((item) => {
          return this.form.merchantId === item.id
        })
        this.form.merchantId = arr[0].username
        this.loading = false
      })
    },
    // 执行删除
    handleDelete(row) {
      const roleIds = row.id || this.ids
      this.$confirm('此操作将永久删除该商家优惠券, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteMerchantCoupons(roleIds).then(res => {
          this.loading = false
          this.msgSuccess(res.msg)
          this.getMerchantCouponsList()// 全查询
        })
      }).catch(() => {
        this.msgError('删除已取消')
        this.loading = false
      })
    },
    // 保存
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 做添加
          this.loading = true
          if (this.form.id === undefined) {
            const arr = this.shopList.filter((item) => {
              return this.form.merchantId === item.username
            })
            this.form.merchantId = arr[0].id
            // 是否按天有效
            if (this.form.isExpireDay === 0) {
              this.form.days = ''
            } else {
              this.form.expireTime = ''
            }
            addMerchant(this.form).then(res => {
              this.msgSuccess(res.msg)
              this.loading = false
              this.resetQuery()
              this.open = false// 关闭弹出层
            }).catch(() => {
              this.loading = false
            })
          } else { // 做修改
            const arr = this.shopList.filter((item) => {
              return this.form.merchantId === item.username
            })
            this.form.merchantId = arr[0].id
            updateMerchantCoupons(this.form).then(res => {
              this.msgSuccess(res.msg)
              this.loading = false
              this.getMerchantCouponsList()// 列表重新查询
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
      this.loading = false
      this.title = ''
    },
    // 重置表单
    reset() {
      this.resetForm('form')
      this.form = {
        roleId: undefined,
        roleName: undefined,
        roleCode: undefined,
        roleSort: 0,
        remark: undefined,
        status: '0'
      }
    }
  }
}
</script>
