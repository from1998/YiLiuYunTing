<template>
  <el-container>
    <!-- 标题 -->
    <el-header class="container" height="36px" style="padding:15px 0 45px;font-weight:700">
      <el-tooltip effect="dark" content="点击右侧SN值即可复制车场SN。" placement="bottom">
        <span>车场信息</span>
      </el-tooltip>
      <el-button v-if="form.sn" v-clipboard:copy="form.sn" v-clipboard:success="clipboardSuccess" type="text" icon="el-icon-success" size="mini" style="color:#67C23A">
        {{ 'SN : '+ form.sn }}
      </el-button>
    </el-header>
    <!-- 主体 -->
    <el-container class="container">
      <el-form ref="depotForm" v-loading="loading" :model="form" label-width="150px" style="width:750px" :rules="rules">
        <!-- 名称 简称 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="简称">
              <el-input v-model="form.shortName" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 地区 详细地址 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="地区">
              <el-cascader
                v-model="convert.region"
                :options="addressOptions"
                :props="{ expandTrigger: 'hover' }"
                label-width="260px"
                filterable
                clearable
                @change="handleChange(addressOptions,$event)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="form.address" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 车场类型 -->
        <el-form-item label="类型" prop="lotType">
          <el-select v-cloak v-model="form.lotType" placeholder="请选择车场类型">
            <el-option
              v-for="item in categoryOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="Number(item.dictValue)"
            />
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机/电话" prop="mobile">
              <el-input v-model="form.mobile" placeholder="请输入手机/电话号码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付逗留时长" placeholder="请输入支付逗留时长" prop="payDuration">
              <el-input v-model="form.payDuration" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 经纬度 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="经度">
              <el-input v-model="form.longitude" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纬度">
              <el-input v-model="form.latitude" />
            </el-form-item>
            <el-link href="https://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank" class="coord" type="primary" icon="el-icon-thumb">拾取坐标</el-link>
          </el-col>
        </el-row>
        <!-- 总车位数与空闲车位数 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="总车位数" prop="total">
              <el-input v-model="form.total" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="空闲车位数" prop="emptyNum">
              <el-input v-model="form.emptyNum" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 连接方式与展示车位 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="连接方式" prop="linkType">
              <el-radio-group v-model="form.linkType">
                <el-radio
                  v-for="item in linkTypeOptions"
                  :key="item.dictValue"
                  :label="Number(item.dictValue)"
                >
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否展示车位" prop="isShowSite">
              <el-radio-group v-model="form.isShowSite">
                <el-radio
                  v-for="item in stateOptions"
                  :key="item.dictValue"
                  :label="Number(item.dictValue)"
                >
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 是否收费 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否收费" prop="charge">
              <el-radio-group v-model="form.charge">
                <el-radio
                  v-for="item in stateOptions"
                  :key="item.dictValue"
                  :label="Number(item.dictValue)"
                >
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否共享" prop="share">
              <el-radio-group v-model="form.share">
                <el-radio
                  v-for="item in stateOptions"
                  :key="item.dictValue"
                  :label="Number(item.dictValue)"
                >
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 手续费及停车费分成 -->
        <el-row v-if="getUserInfo().role === 1 || getUserInfo().role === 4">
          <el-col :span="12">
            <el-form-item label="手续费(千分比)" prop="commissionCharge" :disabled="getUserInfo().role === 4?'true':'false'">
              <el-tooltip class="item" effect="dark" content="请输入手续费(千分比)" placement="right">
                <el-input-number v-model="form.commissionCharge" :precision="0" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="停车费分成比(0-10)" prop="parkFeeCharge" :disabled="getUserInfo().role === 4?'true':'false'">
              <el-tooltip class="item" effect="dark" content="请输入停车费分成(占比)" placement="right">
                <el-input-number v-model="form.parkFeeCharge" :precision="0" :step="1" :max="10" :min="0" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 是否有充电桩 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否有充电桩" prop="chargingPile">
              <el-radio-group v-model="form.chargingPile">
                <el-radio
                  v-for="item in stateOptions"
                  :key="item.dictValue"
                  :label="Number(item.dictValue)"
                >
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- 状态 -->
          <el-col :span="12">
            <el-form-item label="是否可用" prop="state">
              <el-radio-group v-model="form.state">
                <el-radio
                  v-for="item in stateOptions"
                  :key="item.dictValue"
                  :label="Number(item.dictValue)"
                  :value="item.dictValue"
                >
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 上传监管平台与上传平台 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否上传监管平台" prop="isUploadData">
              <el-radio-group v-model="form.isUploadData">
                <el-radio
                  v-for="item in stateOptions"
                  :key="item.dictValue"
                  :label="Number(item.dictValue)"
                >
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 平台及识别码 -->
        <el-row v-if="form.isUploadData === 1">
          <el-col :span="12">
            <el-form-item label="平台" prop="uploadPlatform">
              <el-select v-model="form.uploadPlatform" placeholder="请选择平台">
                <el-option
                  v-for="item in monitorPlatformOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="平台识别码" prop="uploadPlatformSn">
              <el-input v-model="form.uploadPlatformSn" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="营业时间">
          <el-time-picker
            v-model="convert.businessHours"
            is-range
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            value-format="HH-mm-ss"
            @change="timeChange(convert.businessHours)"
          />
        </el-form-item>
        <el-row :gutter="30">
          <el-form-item>
            <div class="footer">
              <el-button type="primary" @click="onSubmit">提交</el-button>
              <!-- <el-button type="primary" :disabled="SubmitTitle==='已提交'?true:false" @click="onSubmit">{{ SubmitTitle }}</el-button> -->
              <el-button type="danger" @click="onReset">重置</el-button>
            </div>
          </el-form-item>
        </el-row>
      </el-form>
    </el-container>

  </el-container>

</template>
<script>

import { getDepotById, addDepotInfo, updateDepotInfo } from '@/api/system/carSetting'

import area from '@/assets/json/citys.json'

import validate from '@/utils/validate'

import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive

export default {
  name: 'DepotInfo',
  directives: {
    clipboard
  },
  data() {
    return {
      // 验证规则
      validate,
      rules: {
        mobile: validate.phone,
        name: validate.notEmpty,
        shortName: validate.notEmpty,
        region: validate.notEmpty,
        address: validate.notEmpty,
        lotType: validate.notEmpty,
        payDuration: validate.notEmpty,
        total: validate.notEmpty,
        emptyNum: validate.notEmpty,
        linkType: validate.notEmpty,
        isShowSite: validate.notEmpty,
        charge: validate.notEmpty,
        commissionCharge: validate.notEmpty,
        parkFeeCharge: validate.notEmpty,
        chargingPile: validate.notEmpty,
        state: validate.notEmpty,
        isUploadData: validate.notEmpty,
        uploadPlatform: validate.notEmpty,
        uploadPlatformSn: validate.notEmpty,
        share: validate.notEmpty
      },
      // 是否启用遮罩层
      loading: false,
      // SubmitTitle: '提交',
      // 返回数据
      resdata: [],
      // 字典数据
      dictDatas: [],
      // 是否状态
      stateOptions: [],
      // 车场类型
      categoryOptions: [],
      // 平台类型
      monitorPlatformOptions: [],
      // 连接方式
      linkTypeOptions: [],
      convert: {
        // 待转换的车场地区数组
        region: [],
        // 待转换的营业时间,默认朝8晚7
        businessHours: [new Date(0, 0, 0, 0, 0), new Date(0, 0, 0, 23, 0)]
      },
      form: {
        // 用户id
        managerId: '',
        // 车场名称
        name: '',
        // 车场简称
        shortName: '',
        // 地区 省市区
        provinceName: '',
        cityName: '',
        areaName: '',
        // 详细地址
        address: '',
        // 车场类型
        lotType: '',
        // 车场电话
        mobile: '',
        // 支付后逗留时长
        payDuration: '',
        // 经纬度
        longitude: '',
        latitude: '',
        // 总车位数
        total: '',
        // 空闲车位数
        emptyNum: '',
        // 是否展示车位
        isShowSite: 1,
        // 连接方式
        linkType: 2,
        // 是否收费
        charge: 1,
        // 是否共享
        share: 0,
        // 手续费
        commissionCharge: null,
        // 停车费
        parkFeeCharge: null,
        // 是否有充电桩
        chargingPile: 1,
        // 是否可用
        state: 1,
        // 是否上传监管平台
        isUploadData: 1,
        // 上传的监管平台
        uploadPlatform: '',
        // 监管平台标识码
        uploadPlatformSn: '',
        // 营业时间
        startHours: '00-00-00',
        endHours: '23-59-59'
      },
      addressOptions: area
    }
  },
  created() {
    // 取路由路径上的参数
    this.form.managerId = this.$route.params && this.$route.params.id // 路由传参
    // 根据字典类型ID查询字典的dictType
    this.init()
    // 获取是否字典数据
    this.getDataByType('yesOrNo').then(res => {
      this.stateOptions = res.data
    })
    // 车场类型
    this.getDataByType('ParkLotTypeDic').then(res => {
      this.categoryOptions = res.data
    })
    // 平台类型
    this.getDataByType('UploadPlatformDic').then(res => {
      this.monitorPlatformOptions = res.data
    })
    // 连接方式
    this.getDataByType('ParkLinkTypeDic').then(res => {
      this.linkTypeOptions = res.data
    })
  },
  methods: {
    // 复制SN值成功的回调函数
    clipboardSuccess() {
      this.msgSuccess('复制成功！SN值已复制到剪贴板。')
    },
    async init() {
      this.loading = true // 打开遮罩
      await getDepotById({
        managerId: this.form.managerId
      }).then(res => {
        this.resdata = res.data
        if (res.data !== null) {
          this.form = res.data
          this.handleRegion(this.addressOptions)
          this.handletime()
          this.form.commissionCharge = this.form.commissionCharge * 1000
          this.form.parkFeeCharge = this.form.parkFeeCharge * 10
        }
        this.loading = false // 关闭遮罩
      })
    },
    onSubmit() {
      this.$refs['depotForm'].validate((valid) => {
        if (valid) {
          if (this.resdata === null) {
            this.loading = true // 打开遮罩
            addDepotInfo(this.form).then(res => {
              this.msgSuccess(res.msg)
              this.init()
              this.loading = false // 关闭遮罩
            }).catch(() => {
              this.loading = false // 关闭遮罩
            })
          } else {
            this.loading = true // 打开遮罩
            updateDepotInfo(this.form).then((res) => {
              this.msgSuccess(res.msg)
              this.init()
              this.loading = false // 关闭遮罩
            }).catch(() => {
              this.loading = false // 关闭遮罩
            })
          }
        }
      })
    },
    onReset() {
      this.$confirm('确定重置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.clear()
        this.convert.region = []
        this.msgSuccess('重置成功')
      }).catch(() => {
        this.msgError('重置已取消')
      })
    },
    handleRegion(opt) {
      this.convert.region = [this.form.provinceName, this.form.cityName, this.form.areaName]
      this.convert.region = this.convert.region.map(function(value) {
        for (var itm of opt) {
          if (itm.label === value) {
            opt = itm.children
            return itm.value
          }
        }
        return null
      })
    },
    handleChange(opt, val) {
      const vals = val.map(function(value) {
        for (var itm of opt) {
          if (itm.value === value) {
            opt = itm.children
            return itm.label
          }
        }
        return null
      })
      this.form.provinceName = vals[0]
      this.form.cityName = vals[1]
      this.form.areaName = vals[2]
    },
    handletime() {
      this.convert.businessHours = [this.form.startHours, this.form.endHours]
    },
    timeChange(val) {
      this.form.startHours = val[0]
      this.form.endHours = val[1]
    },
    clear() {
      var data = {
        // 用户id
        managerId: '',
        // 车场名称
        name: '',
        // 车场简称
        shortName: '',
        // 地区 省市区
        provinceName: '',
        cityName: '',
        areaName: '',
        // 详细地址
        address: '',
        // 车场类型
        lotType: '',
        // 车场电话
        mobile: '',
        // 支付后逗留时长
        payDuration: '',
        // 经纬度
        longitude: '',
        latitude: '',
        // 总车位数
        total: '',
        // 空闲车位数
        emptyNum: '',
        // 是否展示车位
        isShowSite: 1,
        // 连接方式
        linkType: 2,
        // 是否收费
        charge: 1,
        // 是否共享
        share: 0,
        // 手续费
        commissionCharge: null,
        // 停车费
        parkFeeCharge: null,
        // 是否有充电桩
        chargingPile: 1,
        // 是否可用
        state: 1,
        // 是否上传监管平台
        isUploadData: 1,
        // 上传的监管平台
        uploadPlatform: '',
        // 监管平台标识码
        uploadPlatformSn: '',
        // 营业时间
        startHours: '00-00-00',
        endHours: '23-59-59'
      }
      this.form = Object.assign(this.form, data)
      this.convert.businessHours = ['00-00-00', '23-59-59']
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
    display: -webkit-box;
     -webkit-box-pack:center;
}
.el-button--mini {
  padding: 0 5px!important;
  height: 17px;
}
.footer {
    margin-left: 50%;
    transform: translateX(-50%);
}
  [v-cloak]{
    /* 元素隐藏    */
    display: none;
  }
  .coord {
    position: absolute;
    top: 18.1%;
    left: 4%;
  }
</style>
