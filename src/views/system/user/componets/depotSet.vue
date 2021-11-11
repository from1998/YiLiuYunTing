<template>
  <el-container>
    <el-header class="container" height="36px" style="padding:15px 0 45px;font-weight:700">
      车场配置
    </el-header>
    <el-container class="container">
      <el-form ref="depotSetForm" :model="form" label-width="180px" style="width:750px" :rules="rules">
        <!-- 固定车辆进出场 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="固定车进场" prop="fixedCarIn">
              <el-select v-model="form.fixedCarIn" placeholder="请选择类型">
                <el-option
                  v-for="item in options.access"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="固定车出场" prop="fixedCarOut">
              <el-select v-model="form.fixedCarOut" placeholder="请选择类型">
                <el-option
                  v-for="item in options.access"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 固定车辆重复进出场 -->
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="固定车重复进场" prop="fixedcarduplicatein">
              <el-select v-model="form.fixedcarduplicatein" placeholder="请选择类型">
                <el-option
                  v-for="item in options.access"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="固定车重复出场" prop="fixedcarduplicateout">
              <el-select v-model="form.fixedcarduplicateout" placeholder="请选择类型">
                <el-option
                  v-for="item in options.access"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->
        <!-- 临时车辆进出场 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="临时车进场" prop="tempCarIn">
              <el-select v-model="form.tempCarIn" placeholder="请选择类型">
                <el-option
                  v-for="item in options.access"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="临时车出场" prop="tempCarOut">
              <el-select v-model="form.tempCarOut" placeholder="请选择类型">
                <el-option
                  v-for="item in options.access"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 临时车辆重复进场与0元出场 -->
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="临时车重复进场" prop="tempcarduplicatein">
              <el-select v-model="form.tempcarduplicatein" placeholder="请选择类型">
                <el-option
                  v-for="item in options.access"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="固定车过期提醒" prop="fixedCarOverDue">
              <el-tooltip class="item" effect="dark" content="请输入过期提醒天数" placement="right">
                <el-input-number v-model="form.fixedCarOverDue" :precision="0" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="临时车0元出场" prop="tempCarZeroOut">
              <el-select v-model="form.tempCarZeroOut" placeholder="请选择类型">
                <el-option
                  v-for="item in options.access"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--固定车与临时车无空位处理 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="固定车无空位处理" prop="registerCarNoVoidAction">
              <el-select v-model="form.registerCarNoVoidAction" placeholder="请选择类型">
                <el-option
                  v-for="item in options.access"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="临时车无空位处理" prop="tempCarNoVoidAction">
              <el-select v-model="form.tempCarNoVoidAction" placeholder="请选择类型">
                <el-option
                  v-for="item in options.access"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 过期车辆进出场 -->
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="过期车辆进场" prop="overduecarin">
              <el-select v-model="form.overduecarin" placeholder="请选择类型">
                <el-option
                  v-for="item in options.overDue"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="过期车辆出场" prop="overduecarout">
              <el-select v-model="form.overduecarout" placeholder="请选择类型">
                <el-option
                  v-for="item in options.overDue"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->
        <!-- 无记录临时出场与出场费 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="无记录临时出场" prop="noRecordTempCarOut">
              <el-select v-model="form.noRecordTempCarOut" placeholder="请选择类型">
                <el-option
                  v-for="item in options.noRecord"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.noRecordTempCarOut === 5" label="无记录临时出场费用">
              <el-tooltip class="item" effect="dark" content="请输入费用" placement="right">
                <el-input-number v-model="form.noRecordTempCarOutAmount" :precision="2" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 进出场超时处理 -->
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="进场超时处理">
              <el-select v-model="form.intimeoutaction" placeholder="请选择类型">
                <el-option
                  v-for="item in options.access"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出场超时处理">
              <el-select v-model="form.outtimeoutaction" placeholder="请选择类型">
                <el-option
                  v-for="item in options.access"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->
        <!-- 进出场超时时间 -->
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="进场超时时间(分钟)">
              <el-tooltip class="item" effect="dark" content="请输入超时分钟数" placement="right">
                <el-input-number v-model="form.intimeout" :precision="0" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出场超时时间(分钟)">
              <el-tooltip class="item" effect="dark" content="请输入超时分钟数" placement="right">
                <el-input-number v-model="form.outtimeout" :precision="0" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row> -->
        <!-- 空闲车位计数与自动清理天数 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="空闲车位计数类型" prop="freeCarSiteCount">
              <el-select v-model="form.freeCarSiteCount" placeholder="请选择类型">
                <el-option
                  v-for="item in options.vacant"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="自动清理天数" prop="autocleancar">
              <el-tooltip class="item" effect="dark" content="请输入数字" placement="right">
                <el-input-number v-model="form.autocleancar" :precision="0" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col> -->
        </el-row>
        <!-- 黄蓝牌车是否禁止入场 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="黄牌车禁止入场" prop="yellowCarIn">
              <el-radio-group v-model="form.yellowCarIn">
                <el-radio
                  v-for="item in options.status"
                  :key="item.dictValue"
                  :label="Number(item.dictValue)"
                >
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="蓝牌车禁止入场" prop="blueCarIn">
              <el-radio-group v-model="form.blueCarIn">
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
        <!-- 无牌车是否收费及是否开启高峰放行-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="无牌车是否收费" prop="noNumberCarCharge">
              <el-radio-group v-model="form.noNumberCarCharge">
                <el-radio
                  v-for="item in options.status"
                  :key="item.dictValue"
                  :label="Number(item.dictValue)"
                >
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="按车牌类型收费" prop="isFeeByType">
              <el-radio-group v-model="form.isFeeByType">
                <el-radio
                  v-for="item in options.status"
                  :key="item.dictValue"
                  :label="Number(item.dictValue)"
                >
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="是否开启高峰放行">
              <el-radio-group v-model="form.isFreePeriod">
                <el-radio
                  v-for="item in options.status"
                  :key="item.dictValue"
                  :label="Number(item.dictValue)"
                >
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
        </el-row>
        <!-- 高峰时间段 -->
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.isFreePeriod === 1" label="高峰时间段">
              <el-date-picker
                v-model="convert.businessHours"
                value-format="yyyy-MM-dd HH-mm-ss"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timeChange(convert.businessHours)"
              />
            </el-form-item>
          </el-col>
        </el-row> -->
        <!-- 是否开启多位多车及其规则 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否开启多位多车" prop="fixedCarMoreSiteMoreCar">
              <el-radio-group v-model="form.fixedCarMoreSiteMoreCar">
                <el-radio
                  v-for="item in options.status"
                  :key="item.dictValue"
                  :label="Number(item.dictValue)"
                >
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.fixedCarMoreSiteMoreCar === 1" label="多位多车规则">
              <el-select v-model="form.moreSiteMoreCarRule" placeholder="请选择类型">
                <el-option
                  v-for="item in options.access"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 特殊车辆允许 -->
        <el-form-item label="特殊车辆允许" prop="specialPass">
          <el-checkbox-group v-model="form.specialPass">
            <el-checkbox
              v-for="item in options.specialPass"
              :key="item.dictValue"
              :label="Number(item.dictValue)"
            >
              {{ item.dictLabel }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-row :gutter="20">
          <el-form-item>
            <div class="footer">
              <el-button type="primary" @click="onSubmit">提交</el-button>
              <el-button type="danger" @click="onReset">重置</el-button>
            </div>
          </el-form-item>
        </el-row>
      </el-form>
    </el-container>
  </el-container>

</template>
<script>
import { updateDepotSet, addDepotSet, getParkOperationByMid } from '@/api/system/carSetting'
import validate from '@/utils/validate'

export default {
  name: 'DepotSet',
  data() {
    return {
      // 验证规则
      validate,
      rules: {
        fixedCarIn: validate.notEmpty,
        fixedCarOut: validate.notEmpty,
        tempCarIn: validate.notEmpty,
        tempCarOut: validate.notEmpty,
        tempCarZeroOut: validate.notEmpty,
        registerCarNoVoidAction: validate.notEmpty,
        tempCarNoVoidAction: validate.notEmpty,
        overduecarout: validate.notEmpty,
        noRecordTempCarOut: validate.notEmpty,
        fixedCarOverDue: validate.notEmpty,
        freeCarSiteCount: validate.notEmpty,
        yellowCarIn: validate.notEmpty,
        blueCarIn: validate.notEmpty,
        fixedCarMoreSiteMoreCar: validate.notEmpty,
        noNumberCarCharge: validate.notEmpty,
        specialPass: validate.notEmpty
      },
      // 是否启用遮罩层
      loading: false,
      formBak: {},
      form: {
        fixedCarIn: '',
        fixedCarOut: '',
        tempCarIn: '',
        tempCarOut: '',
        tempCarZeroOut: '',
        registerCarNoVoidAction: '',
        tempCarNoVoidAction: '',
        overduecarout: 2,
        noRecordTempCarOut: '',
        fixedCarOverDue: 0,
        noRecordTempCarOutAmount: 0,
        freeCarSiteCount: 3,
        yellowCarIn: 0,
        blueCarIn: 0,
        fixedCarMoreSiteMoreCar: 0,
        moreSiteMoreCarRule: '',
        noNumberCarCharge: 1,
        isFeeByType: 0,
        specialPass: [3, 4, 6, 12]
      },
      options: {
        // 车辆进出场
        access: [],
        // 超时处理
        overDue: [],
        // 无记录临时出场
        noRecord: [],
        // 是否二元状态选择
        status: [],
        // 空闲车位计数
        vacant: [],
        // 特殊车辆类型
        specialPass: []
      },
      convert: {
        // 待转换的特殊车辆数组
        specialPassArr: []
        // 待转换的高峰时间,默认当前时间
        // businessHours: [new Date(), new Date()]
      }
    }
  },
  created() {
    // 取路由路径上的参数
    this.form.managerId = this.$route.params && this.$route.params.id // 路由传参
    this.formBak = this.form
    this.init()
    // 获取进出场字典数据
    this.getDataByType('AutoOrManagerDic').then(res => {
      this.options.access = res.data
    })
    // 获取空闲车位计数字典
    this.getDataByType('FreeCarSiteCountDic').then(res => {
      this.options.vacant = res.data
    })
    // 获取是否字典
    this.getDataByType('yesOrNo').then(res => {
      this.options.status = res.data
    })
    // 获取超时处理字典
    this.getDataByType('LaneEffectiveOpenTypeDic').then(res => {
      this.options.overDue = res.data
    })
    // 无记录临时出场
    this.getDataByType('NoRecordOutDic').then(res => {
      this.options.noRecord = res.data
    })
    // 特殊车辆允许字典
    this.getDataByType('CarNumberTypeDic').then(res => {
      this.options.specialPass = res.data
    })
  },
  methods: {
    async init() {
      this.loading = true // 打开遮罩
      await getParkOperationByMid({
        managerId: this.form.managerId
      }).then(res => {
        this.resdata = res.data
        if (res.data !== null) {
          this.form = res.data
          // this.SubmitTitle = '已提交'
          this.handleCheckedStr(this.resdata.specialPass)
        }
        this.loading = false // 关闭遮罩
      })
    },
    onSubmit() {
      this.$refs['depotSetForm'].validate((valid) => {
        if (valid) {
          this.form.specialPass = this.form.specialPass.toString()
          // this.timeChange(this.convert.businessHours)
          if (this.resdata === null) {
            // this.timeChange()
            this.loading = true // 打开遮罩
            addDepotSet(this.form).then((res) => {
              this.msgSuccess(res.msg)
              this.init()
              this.loading = false // 关闭遮罩
            }).catch(() => {
              this.init()
              this.loading = false // 关闭遮罩
            })
          } else {
            this.loading = true // 打开遮罩
            updateDepotSet(this.form).then((res) => {
              this.msgSuccess(res.msg)
              this.init()
              this.loading = false // 关闭遮罩
            }).catch(() => {
              this.init()
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
        // this.form = this.formBak
        this.clear()
        // this.convert.businessHours = [new Date(), new Date()]
        this.msgSuccess('重置成功')
      }).catch(() => {
        this.msgError('重置已取消')
      })
    },
    handleCheckedStr(str) {
      var arr = str.split(',')
      var arrNumber = []
      arr.forEach(val => {
        arrNumber.push(Number(val))
      })
      this.form.specialPass = arrNumber
    },
    clear() {
      var data = {
        fixedCarIn: '',
        fixedCarOut: '',
        tempCarIn: '',
        tempCarOut: '',
        tempCarZeroOut: '',
        registerCarNoVoidAction: '',
        tempCarNoVoidAction: '',
        overduecarout: 2,
        noRecordTempCarOut: '',
        fixedCarOverDue: 0,
        noRecordTempCarOutAmount: 0,
        freeCarSiteCount: 3,
        yellowCarIn: 0,
        blueCarIn: 0,
        fixedCarMoreSiteMoreCar: 0,
        moreSiteMoreCarRule: '',
        noNumberCarCharge: 1,
        isFeeByType: 0,
        specialPass: [3, 4, 6, 12]
      }
      this.form = Object.assign(this.form, data)
    }
    // 处理时间
  //   timeChange(val) {
  //     this.form.freeperiodstart = val[0]
  //     this.form.freeperiodend = val[1]
  //   }
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
