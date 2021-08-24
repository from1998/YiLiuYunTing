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
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="简称" prop="sName">
              <el-input v-model="form.sName" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 地区 详细地址 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="地区" prop="region">
              <el-cascader
                v-model="form.region"
                :options="addressOptions"
                :props="{ expandTrigger: 'hover' }"
                label-width="260px"
                @change="handleChange"
                @expand-change="expandChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详细地址" prop="detailAddress">
              <el-input v-model="form.detailAddress" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 车场类型 -->
        <el-form-item label="类型" prop="category">
          <el-select v-model="form.category" placeholder="请选择车场类型">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="手机/电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机/电话号码" />
        </el-form-item>
        <el-form-item label="支付逗留时长" prop="remain" placeholder="请输入支付逗留时长">
          <el-input v-model="form.remain" />
        </el-form-item>
        <!-- 经纬度 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="经度" prop="longitude">
              <el-input v-model="form.longitude" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纬度" prop="latitude">
              <el-input v-model="form.latitude" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 总车位数与空闲车位数 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="总车位数" prop="allPort">
              <el-input v-model="form.allPort" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="空闲车位数" prop="freePort">
              <el-input v-model="form.freePort" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 连接方式与展示车位 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="连接方式" prop="connectMethod">
              <el-radio-group v-model="form.connectMethod">
                <el-radio label="1" selected>直连</el-radio>
                <el-radio label="0">间连</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否展示车位" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 是否收费 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否收费" prop="feeStatus">
              <el-radio-group v-model="form.feeStatus">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 手续费及停车费分成 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="手续费(百分比)" prop="procedureFee">
              <el-tooltip class="item" effect="dark" content="请输入手续费(百分比)" placement="right">
                <el-input-number v-model="form.procedureFee" :precision="2" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="停车费分成(百分比)" prop="parkingFee">
              <el-tooltip class="item" effect="dark" content="请输入停车费分成(百分比)" placement="right">
                <el-input-number v-model="form.parkingFee" :precision="2" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 是否有充电桩 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否有充电桩" prop="chargingPile">
              <el-radio-group v-model="form.chargingPile">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- 状态 -->
          <el-col :span="12">
            <el-form-item label="是否可用" prop="usable">
              <el-radio-group v-model="form.usable">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 上传监管平台与上传平台 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否上传监管平台" prop="uploadMonitorPlatform">
              <el-radio-group v-model="form.uploadMonitorPlatform">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 平台及识别码 -->
        <el-row v-if="form.uploadMonitorPlatform === '1'">
          <el-col :span="12">
            <el-form-item label="平台" prop="monitorPlatform">
              <el-select v-model="form.monitorPlatform" placeholder="请选择平台">
                <el-option
                  v-for="item in monitorPlatformOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="平台识别码" prop="PlatformIdentification">
              <el-input v-model="form.PlatformIdentification" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="营业时间" prop="businessHours">
          <el-time-picker
            v-model="businessHours"
            is-range
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            value-format="hh-mm-ss"
            @change="timeChange(businessHours)"
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
import area from '@/assets/json/citys.json'

export default {
  name: 'DepotInfo',
  data() {
    return {
      businessHours: [new Date(2016, 9, 10, 9, 0), new Date(2016, 9, 10, 17, 0)],
      form: {
        name: '',
        sName: '',
        region: [],
        detailAddress: '',
        category: '',
        phone: '',
        remain: '',
        longitude: '',
        latitude: '',
        allPort: '',
        freePort: '',
        status: '1',
        connectMethod: '1',
        feeStatus: '1',
        procedureFee: '',
        parkingFee: '',
        chargingPile: '1',
        pertainRole: '',
        usable: '1',
        uploadMonitorPlatform: '1',
        monitorPlatform: '',
        PlatformIdentification: '',
        remark: '',
        start: '',
        end: ''
      },
      categoryOptions: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      addressOptions: area,
      statusOptions: [
        {
          value: '1',
          label: '是'
        },
        {
          value: '0',
          label: '否'
        }
      ],
      connectOptions: [
        {
          value: '1',
          label: '间接'
        },
        {
          value: '0',
          label: '直连'
        }
      ],
      pertainRoleOptions: [
        {
          value: '1',
          label: '测试'
        },
        {
          value: '0',
          label: '超管'
        },
        {
          value: '2',
          label: '运营'
        }
      ],
      monitorPlatformOptions: [
        {
          value: '0',
          label: '合肥市城管停车平台'
        },
        {
          value: '1',
          label: '省立交警大队'
        },
        {
          value: '2',
          label: '安徽停车综合监控办公室'
        }
      ]
    }
  },
  methods: {
    onSubmit() {
      // console.log('submit!')
    },
    // onReset(formName) {
    //   this.resetForm(formName)
    // },
    handleChange(value) {
      console.log(value)
    },
    expandChange(value) {
      // console.log(value)
    },
    timeChange(val) {
      console.log(val)
      this.form.start = val[0]
      this.form.end = val[1]
      console.log(this.form.start)
      console.log(this.form.end)
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
