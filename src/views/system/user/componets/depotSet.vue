<template>
  <el-container>
    <el-header class="container" height="36px" style="padding:15px 0 45px;font-weight:700">
      车场配置
    </el-header>
    <el-container class="container">
      <el-form ref="form" :model="form" label-width="180px" style="width:750px" name="depotSetForm">
        <!-- 固定车辆进出场 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="固定车进场">
              <el-select v-model="form.fixedcarin" placeholder="请选择类型">
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
            <el-form-item label="固定车出场">
              <el-select v-model="form.fixedcarout" placeholder="请选择类型">
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
        <el-row>
          <el-col :span="12">
            <el-form-item label="固定车重复进场">
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
            <el-form-item label="固定车重复出场">
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
        </el-row>
        <!-- 临时车辆进出场 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="临时车进场">
              <el-select v-model="form.tempcarin" placeholder="请选择类型">
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
            <el-form-item label="临时车出场">
              <el-select v-model="form.tempcarout" placeholder="请选择类型">
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
          <el-col :span="12">
            <el-form-item label="临时车重复进场">
              <el-select v-model="form.tempcarduplicatein" placeholder="请选择类型">
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
            <el-form-item label="临时车0元出场">
              <el-select v-model="form.tempcarzeroout" placeholder="请选择类型">
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
            <el-form-item label="固定车无空位处理">
              <el-select v-model="form.registercarnovoidaction" placeholder="请选择类型">
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
            <el-form-item label="临时车无空位处理">
              <el-select v-model="form.tempcarnovoidaction" placeholder="请选择类型">
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
        <el-row>
          <el-col :span="12">
            <el-form-item label="过期车辆进场">
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
            <el-form-item label="过期车辆出场">
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
        </el-row>
        <!-- 无记录临时出场与出场费 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="无记录临时出场">
              <el-select v-model="form.norecordtempcarout" placeholder="请选择类型">
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
            <el-form-item v-if="form.norecordtempcarout === 3" label="无记录临时出场费用">
              <el-tooltip class="item" effect="dark" content="请输入费用" placement="right">
                <el-input-number v-model="form.norecordtempcaroutamount" :precision="2" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 进出场超时处理 -->
        <el-row>
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
        </el-row>
        <!-- 进出场超时时间 -->
        <el-row>
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
        </el-row>
        <!-- 空闲车位计数与自动清理天数 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="空闲车位计数">
              <el-select v-model="form.freecarsitecount" placeholder="请选择类型">
                <el-option
                  v-for="item in options.vacant"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自动清理天数">
              <el-tooltip class="item" effect="dark" content="请输入数字" placement="right">
                <el-input-number v-model="form.autocleancar" :precision="0" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 黄蓝牌车是否禁止入场 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="黄牌车禁止入场">
              <el-radio-group v-model="form.yellowcarin">
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
            <el-form-item label="蓝牌车禁止入场">
              <el-radio-group v-model="form.bluecarin">
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
            <el-form-item label="无牌车是否收费">
              <el-radio-group v-model="form.nonumbercarcharge">
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
            <el-form-item label="按车牌类型收费">
              <el-radio-group v-model="form.isfeebytype">
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
              <el-radio-group v-model="form.isfreeperiod">
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
            <el-form-item v-if="form.isfreeperiod === 1" label="高峰时间段">
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
        <!-- 按车牌类型收费 -->
        <!-- <el-form-item label="按车牌类型收费">
          <el-radio-group v-model="form.isfeebytype">
            <el-radio
              v-for="item in options.status"
              :key="item.dictValue"
              :label="Number(item.dictValue)"
            >
              {{ item.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item> -->
        <!-- 是否开启多位多车及其规则 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否开启多位多车">
              <el-radio-group v-model="form.fixedcarmoresitemorecar">
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
            <el-form-item v-if="form.fixedcarmoresitemorecar === 1" label="多位多车规则">
              <el-select v-model="form.moresitemorecarrule" placeholder="请选择类型">
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
        <el-form-item label="特殊车辆允许">
          <el-checkbox-group v-model="form.specialpass">
            <el-checkbox
              v-for="item in options.specialpass"
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

export default {
  name: 'DepotSet',
  data() {
    return {
      // 是否启用遮罩层
      loading: false,
      formBak: {},
      form: {
        // 是否开启高峰时间
        // isfreeperiod: '',
        // 高峰时间段
        // freeperiodend: '',
        // freeperiodstart: '',
        fixedcarin: '',
        fixedcarout: '',
        fixedcarduplicatein: '',
        fixedcarduplicateout: '',
        tempcarin: '',
        tempcarout: '',
        tempcarduplicatein: '',
        tempcarzeroout: '',
        registercarnovoidaction: '',
        tempcarnovoidaction: '',
        overduecarin: '',
        overduecarout: '',
        norecordtempcarout: '',
        norecordtempcaroutamount: '',
        freecarsitecount: '',
        autocleancar: '',
        yellowcarin: '',
        bluecarin: '',
        fixedcarmoresitemorecar: '',
        moresitemorecarrule: '',
        nonumbercarcharge: '',
        isfeebytype: '',
        specialpass: [2, 3, 4, 6, 12],
        intimeout: '',
        outtimeout: '',
        intimeoutaction: '',
        outtimeoutaction: ''
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
        specialpass: []
      },
      convert: {
        // 待转换的特殊车辆数组
        specialpassArr: []
        // 待转换的高峰时间,默认当前时间
        // businessHours: [new Date(), new Date()]
      }
    }
  },
  created() {
    // 取路由路径上的参数
    this.form.managerid = this.$route.params && this.$route.params.id // 路由传参
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
      this.options.specialpass = res.data
    })
  },
  methods: {
    async init() {
      this.loading = true // 打开遮罩
      await getParkOperationByMid(this.form.managerid).then(res => {
        this.resdata = res.data
        if (res.data !== null) {
          this.form = res.data
          // this.SubmitTitle = '已提交'
          this.handleCheckedStr(this.resdata.specialpass)
        }
        this.loading = false // 关闭遮罩
      })
    },
    onSubmit() {
      this.form.specialpass = this.form.specialpass.toString()
      // this.timeChange(this.convert.businessHours)
      if (this.resdata === null) {
        // this.timeChange()
        this.loading = true // 打开遮罩
        addDepotSet(this.form).then(() => {
          this.msgSuccess('添加成功')
          this.init()
          this.loading = false // 关闭遮罩
        }).catch(() => {
          this.msgError('添加失败')
          this.loading = false // 关闭遮罩
        })
      } else {
        this.loading = true // 打开遮罩

        updateDepotSet(this.form).then(() => {
          this.msgSuccess('修改成功')
          this.init()
          this.loading = false // 关闭遮罩
        }).catch(() => {
          this.msgError('修改失败')
          this.loading = false // 关闭遮罩
        })
      }
    },
    onReset() {
      this.$confirm('确定重置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form = this.formBak
        this.convert.businessHours = [new Date(), new Date()]
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
      this.form.specialpass = arrNumber
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
