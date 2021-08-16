<template>
  <el-container>
    <el-header class="container" height="36px" style="padding:15px 0 45px;font-weight:700">
      车场配置
    </el-header>
    <el-container class="container">
      <el-form ref="form" :model="form" label-width="180px" style="width:750px">
        <!-- 固定车辆进出场 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="固定车进场">
              <el-select v-model="form.fixedIn" placeholder="请选择类型">
                <el-option
                  v-for="item in options.access"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="固定车出场">
              <el-select v-model="form.fixedOut" placeholder="请选择类型">
                <el-option
                  v-for="item in options.access"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 固定车辆重复进出场 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="固定车重复进场">
              <el-select v-model="form.fixedRepIn" placeholder="请选择类型">
                <el-option
                  v-for="item in options.repetition"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="固定车重复出场">
              <el-select v-model="form.fixedRepOut" placeholder="请选择类型">
                <el-option
                  v-for="item in options.repetition"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 临时车辆进出场 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="临时车进场">
              <el-select v-model="form.temporaryIn" placeholder="请选择类型">
                <el-option
                  v-for="item in options.access"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="临时车出场">
              <el-select v-model="form.temporaryOut" placeholder="请选择类型">
                <el-option
                  v-for="item in options.access"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 临时车辆重复进场与0元出场 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="临时车重复进场">
              <el-select v-model="form.temporaryRepIn" placeholder="请选择类型">
                <el-option
                  v-for="item in options.repetition"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="临时车0元出场">
              <el-select v-model="form.temporaryZeroOut" placeholder="请选择类型">
                <el-option
                  v-for="item in options.access"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--固定车与临时车无空位处理 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="固定车无空位处理">
              <el-select v-model="form.fixedNoSpace" placeholder="请选择类型">
                <el-option
                  v-for="item in options.repetition"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="临时车无空位处理">
              <el-select v-model="form.temporaryNoSpace" placeholder="请选择类型">
                <el-option
                  v-for="item in options.repetition"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 过期车辆进出场 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="过期车辆进场">
              <el-select v-model="form.overdueIn" placeholder="请选择类型">
                <el-option
                  v-for="item in options.overdue"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="过期车辆出场">
              <el-select v-model="form.overdueOut" placeholder="请选择类型">
                <el-option
                  v-for="item in options.overdue"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 无记录临时出场与出场费 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="无记录临时出场">
              <el-select v-model="form.noRecordOut" placeholder="请选择类型">
                <el-option
                  v-for="item in options.noRecord"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.noRecordOut === '0'" label="无记录临时出场费用">
              <el-tooltip class="item" effect="dark" content="请输入费用" placement="right">
                <el-input-number v-model="form.noRecordFee" :precision="2" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 进出场超时时间 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="进场超时时间(分钟)">
              <el-tooltip class="item" effect="dark" content="请输入超时分钟数" placement="right">
                <el-input-number v-model="form.accessInTime" :precision="0" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出场超时时间(分钟)">
              <el-tooltip class="item" effect="dark" content="请输入超时分钟数" placement="right">
                <el-input-number v-model="form.accessOutTime" :precision="0" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 进出场超时处理 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="进场超时处理">
              <el-select v-model="form.accessInDeal" placeholder="请选择类型">
                <el-option
                  v-for="item in options.repetition"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出场超时处理">
              <el-select v-model="form.accessOutDeal" placeholder="请选择类型">
                <el-option
                  v-for="item in options.repetition"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 空闲车位计数与自动清理天数 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="空闲车位计数">
              <el-select v-model="form.freePortCount" placeholder="请选择类型">
                <el-option
                  v-for="item in options.vacant"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自动清理天数">
              <el-tooltip class="item" effect="dark" content="请输入数字" placement="right">
                <el-input-number v-model="form.autoClearDays" :precision="0" :step="1" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 黄蓝牌车是否禁止入场 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="黄牌车禁止入场">
              <el-radio-group v-model="form.yellowAccess">
                <el-radio
                  v-for="item in options.status"
                  :key="item.value"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="蓝牌车禁止入场">
              <el-radio-group v-model="form.blueAccess">
                <el-radio
                  v-for="item in options.status"
                  :key="item.value"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item></el-col>
        </el-row>
        <!-- 是否开启多位多车及其规则 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否开启多位多车">
              <el-radio-group v-model="form.morePortAndCarStatus">
                <el-radio
                  v-for="item in options.status"
                  :key="item.value"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.morePortAndCarStatus === '1'" label="多位多车规则">
              <el-select v-model="form.morePortAndCarRule" placeholder="请选择类型">
                <el-option
                  v-for="item in options.repetition"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 无牌车是否收费及是否开启高峰放行-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="无牌车是否收费">
              <el-radio-group v-model="form.unlicensedCars">
                <el-radio
                  v-for="item in options.status"
                  :key="item.value"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否开启高峰放行">
              <el-radio-group v-model="form.peakRelease">
                <el-radio
                  v-for="item in options.status"
                  :key="item.value"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 高峰时间段 -->
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.peakRelease === '1'" label="高峰时间段">
              <el-date-picker
                v-model="form.peakDuration"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 按车牌类型收费 -->
        <el-form-item label="按车牌类型收费">
          <el-radio-group v-model="form.feeForType">
            <el-radio
              v-for="item in options.status"
              :key="item.value"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 特殊车辆允许 -->
        <el-form-item label="特殊车辆允许">
          <el-checkbox-group v-model="form.specialVehicle">
            <el-checkbox
              v-for="item in options.specialVehicle"
              :key="item.value"
              :label="item.label"
              name="options.specialVehicle"
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <div class="footer">
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button>取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-container>
  </el-container>

</template>
<script>

export default {
  name: 'DepotSet',
  data() {
    return {
      form: {
        fixedIn: '',
        fixedOut: '',
        fixedRepIn: '',
        fixedRepOut: '',
        temporaryIn: '',
        temporaryOut: '',
        temporaryRepIn: '',
        temporaryZeroOut: '',
        fixedNoSpace: '',
        temporaryNoSpace: '',
        overdueIn: '',
        overdueOut: '',
        noRecordOut: '',
        noRecordFee: '9.99',
        freePortCount: '',
        autoClearDays: '',
        yellowAccess: '',
        blueAccess: '',
        morePortAndCarStatus: '',
        morePortAndCarRule: '',
        unlicensedCars: '',
        peakRelease: '',
        peakDuration: [],
        feeForType: '',
        specialVehicle: [],
        accessInTime: '',
        accessOutTime: '',
        accessInDeal: '',
        accessOutDeal: ''
      },
      options: {
        // 车辆进出场
        access: [
          {
            value: '0',
            label: '自动开闸'
          }, {
            value: '1',
            label: '确认开闸'
          }, {
            value: '2',
            label: '禁止通行'
          }
        ],
        // 车辆重复进出场
        repetition: [
          {
            value: '0',
            label: '人工确认'
          }, {
            value: '1',
            label: '禁止通行'
          }, {
            value: '2',
            label: '允许通行'
          }
        ],
        // 过期车辆进出场
        overdue: [
          {
            value: '0',
            label: '人工确认'
          }, {
            value: '1',
            label: '按固定车处理'
          }, {
            value: '2',
            label: '按临时车处理'
          }
        ],
        // 无记录临时出场
        noRecord: [
          {
            value: '0',
            label: '按固定金额处理'
          }, {
            value: '1',
            label: '禁止出场'
          }, {
            value: '2',
            label: '允许出场'
          }
        ],
        // 二元状态选择
        status: [
          {
            value: '1',
            label: '是'
          }, {
            value: '0',
            label: '否'
          }
        ],
        // 空闲车位计数
        vacant: [
          {
            value: '0',
            label: '临时车'
          }, {
            value: '1',
            label: '固定车'
          }, {
            value: '2',
            label: '所有车辆'
          }
        ],
        // 特殊车辆类型
        specialVehicle: [
          {
            value: '0',
            label: '蓝牌车'
          },
          {
            value: '1',
            label: '单层/双色黄牌车'
          }, {
            value: '2',
            label: '警车'
          },
          {
            value: '3',
            label: '武警车'
          }, {
            value: '4',
            label: '教练车'
          }, {
            value: '5',
            label: '军车'
          },
          {
            value: '6',
            label: '港澳车'
          }, {
            value: '7',
            label: '使馆车'
          }, {
            value: '8',
            label: '民航车'
          },
          {
            value: '9',
            label: '新能源车'
          }, {
            value: '10',
            label: '新能源大车'
          }, {
            value: '11',
            label: '消防车'
          },
          {
            value: '12',
            label: '无牌车'
          }, {
            value: '13',
            label: '其它'
          }
        ],
        // 进出场超时时间
        accessTimeout: {
          accessIn: '30',
          accessOut: '30'
        }
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    }
  }
}
</script>
<style lang="scss">
.container {
    display: -webkit-box;
     -webkit-box-pack:center;
}
.footer {
    margin-left: 50%;
    transform: translateX(-50%);
}
</style>
