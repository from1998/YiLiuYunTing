<template>
  <el-container>
    <!-- 标题 -->
    <el-header class="container" height="36px" style="padding:15px 0 45px;font-weight:700">
      车场信息
    </el-header>
    <!-- 主体 -->
    <el-container class="container">
      <el-form ref="depotForm" :model="form" label-width="150px" style="width:750px">
        <!-- 名称 简称 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="form.name">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="简称" prop="form.shortname">
              <el-input v-model="form.shortname" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 地区 详细地址 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="地区" prop="convert.region">
              <el-cascader
                v-model="convert.region"
                :options="addressOptions"
                :props="{ expandTrigger: 'hover' }"
                label-width="260px"
                filterable
                @change="handleChange(addressOptions,$event)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详细地址" prop="form.address">
              <el-input v-model="form.address" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 车场类型 -->
        <el-form-item label="类型" prop="form.lottype">
          <el-select v-model="form.lottype" placeholder="请选择车场类型">
            <el-option
              v-for="item in categoryOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="手机/电话" prop="form.mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机/电话号码" />
        </el-form-item>
        <el-form-item label="支付逗留时长" prop="form.payduration" placeholder="请输入支付逗留时长">
          <el-input v-model="form.payduration" />
        </el-form-item>
        <!-- 经纬度 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="经度" prop="form.longitude">
              <el-input v-model="form.longitude" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纬度" prop="form.latitude">
              <el-input v-model="form.latitude" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 总车位数与空闲车位数 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="总车位数" prop="form.total">
              <el-input v-model="form.total" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="空闲车位数" prop="form.emptynum">
              <el-input v-model="form.emptynum" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 连接方式与展示车位 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="连接方式" prop="form.linktype">
              <el-radio-group v-model="form.linktype">
                <el-radio
                  v-for="item in linkTypeOptions"
                  :key="item.dictValue"
                  :label="item.dictValue"
                  @change="stateChange()"
                >
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否展示车位" prop="form.isshowsite">
              <el-radio-group v-model="form.isshowsite">
                <el-radio
                  v-for="item in stateOptions"
                  :key="item.dictValue"
                  :label="item.dictValue"
                  @change="stateChange()"
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
            <el-form-item label="是否收费" prop="form.charge">
              <el-radio-group v-model="form.charge">
                <el-radio
                  v-for="item in stateOptions"
                  :key="item.dictValue"
                  :label="item.dictValue"
                  @change="stateChange()"
                >
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 手续费及停车费分成 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="手续费(百分比)" prop="form.commissioncharge">
              <el-tooltip class="item" effect="dark" content="请输入手续费(百分比)" placement="right">
                <el-input-number v-model="form.commissioncharge" :precision="2" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="停车费分成(百分比)" prop="form.parkfeecharge">
              <el-tooltip class="item" effect="dark" content="请输入停车费分成(百分比)" placement="right">
                <el-input-number v-model="form.parkfeecharge" :precision="2" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 是否有充电桩 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否有充电桩" prop="form.chargingPile">
              <el-radio-group v-model="form.chargingPile">
                <el-radio
                  v-for="item in stateOptions"
                  :key="item.dictValue"
                  :label="item.dictValue"
                  @change="stateChange()"
                >
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- 状态 -->
          <el-col :span="12">
            <el-form-item label="是否可用" prop="form.state">
              <el-radio-group v-model="form.state">
                <el-radio
                  v-for="item in stateOptions"
                  :key="item.dictValue"
                  :label="item.dictValue"
                  @change="stateChange()"
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
            <el-form-item label="是否上传监管平台" prop="form.isuploaddata">
              <el-radio-group v-model="form.isuploaddata">
                <el-radio
                  v-for="item in stateOptions"
                  :key="item.dictValue"
                  :label="item.dictValue"
                  @change="stateChange()"
                >
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 平台及识别码 -->
        <el-row v-if="form.isuploaddata === '1'">
          <el-col :span="12">
            <el-form-item label="平台" prop="form.uploadplatform">
              <el-select v-model="form.uploadplatform" placeholder="请选择平台">
                <el-option
                  v-for="item in monitorPlatformOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="平台识别码" prop="form.uploadplatformsn">
              <el-input v-model="form.uploadplatformsn" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="营业时间" prop="convert.businessHours">
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
              <el-button type="danger" @click="resetForm('depotForm')">重置</el-button>
            </div>
          </el-form-item>
        </el-row>
      </el-form>
    </el-container>

  </el-container>

</template>
<script>

import { getDepotById, addDepotInfo } from '@/api/system/carSetting'

import area from '@/assets/json/citys.json'

export default {
  name: 'DepotInfo',
  data() {
    return {
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
        businessHours: [new Date(0, 0, 0, 8, 0), new Date(0, 0, 0, 19, 0)]
      },
      form: {
        // 车场名称
        name: '',
        // 车场简称
        shortname: '',
        // 地区 省市区
        provincename: '',
        cityname: '',
        areaname: '',
        // 详细地址
        address: '',
        // 车场类型
        lottype: '',
        // 车场电话
        mobile: '',
        // 支付后逗留时长
        payduration: '',
        // 经纬度
        longitude: '',
        latitude: '',
        // 总车位数
        total: '',
        // 空闲车位数
        emptynum: '',
        // 是否展示车位
        isshowsite: '1',
        // 连接方式
        linktype: 1,
        // 是否收费
        charge: '1',
        // 手续费
        commissioncharge: null,
        // 停车费
        parkfeecharge: null,
        // 是否有充电桩
        chargingPile: '1',
        // 是否可用
        state: '1',
        // 是否上传监管平台
        isuploaddata: '1',
        // 上传的监管平台
        uploadplatform: '',
        // 监管平台标识码
        uploadplatformsn: '',
        // 营业时间
        starthours: '',
        endhours: ''
      },
      addressOptions: area
    }
  },
  created() {
    // 取路由路径上的参数
    const id = this.$route.params && this.$route.params.id // 路由传参
    // 根据字典类型ID查询字典的dictType
    getDepotById(id).then(res => {
      this.resdata = res.data
    })
    // 获取字典数据
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
    stateChange() {
      console.log(this.form.chargingPile)
    },
    onSubmit() {
      console.log('submit!')
      console.log(this.resdata)
      if (this.resdata === null) {
        addDepotInfo(this.form).then(res => {
          this.msgSuccess('添加成功')
        }).catch(() => {
          this.msgError('添加失败')
        })
      }
    },
    // onReset(formName) {
    //   this.resetForm(formName)
    // },
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
      this.form.provincename = vals[0]
      this.form.cityname = vals[1]
      this.form.areaname = vals[2]
    },
    timeChange(val) {
      this.form.starthours = val[0]
      this.form.endhours = val[1]
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
    display: -webkit-box;
     -webkit-box-pack:center;
}
.footer {
    margin-left: 50%;
    transform: translateX(-50%);
}
</style>
