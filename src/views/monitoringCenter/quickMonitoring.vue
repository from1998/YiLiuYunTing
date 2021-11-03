<template>
  <el-container>
    <!-- 标题 -->
    <el-header class="container" height="46px" style="padding:25px 0 60px;font-size:30px;font-weight:700;text-align:center;background-color: #fff;">
      监控中心
    </el-header>
    <!-- 主体 -->
    <el-container class="container">
      <!-- 开闸放行弹出层 -->
      <el-dialog
        title="开闸放行"
        :visible.sync="openLane"
        width="500px"
        center
        append-to-body
        :close-on-click-modal="false"
      >
        <el-form ref="form" v-loading="loading" :model="form" label-width="70px">
          <el-form-item label="来访原因" prop="comereason">
            <el-input v-model="form.comereason" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确认</el-button>
          <el-button type="primary" @click="openLane=false">取消</el-button>
        </span>
      </el-dialog>
      <!-- 查看详情弹出层 -->
      <el-dialog
        title="进出场详情"
        :visible.sync="open"
        width="700px"
        center
        append-to-body
      >
        <el-row :gutter="20">
          <el-col :span="8" :offset="0">
            <span>车牌号: {{ detailOptions.length!==0 && detailOptions.carnumber }}</span>

          </el-col>
          <el-col :span="8" :offset="0">
            <span>车辆类型: {{ detailOptions.length!==0 && detailOptions.recordcartype }}</span>
          </el-col>
          <el-col :span="8" :offset="0">
            <span>车辆颜色: {{ detailOptions.length!==0 && detailOptions.carnumbercolor }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top:15px">
          <el-col :span="8" :offset="0">
            <span>是否进场: {{ detailOptions.length!==0 && (detailOptions.isenter===1?'已进场':'未进场') }}</span>
          </el-col>
          <el-col :span="8" :offset="0">
            <span>进场车道: {{ detailOptions.length!==0 && detailOptions.eLaneName }}</span>
          </el-col>
          <el-col :span="8" :offset="0">
            <span>进场时间: {{ detailOptions.length!==0 && detailOptions.entered }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top:15px">
          <el-col :span="8" :offset="0">
            <span>是否出场: {{ detailOptions.length!==0 && (detailOptions.isleave===1?'已出场':'未出场') }}</span>
          </el-col>
          <el-col :span="8" :offset="0">
            <span>出场车道: {{ detailOptions.length!==0 && detailOptions.lLaneName }}</span>
          </el-col>
          <el-col :span="8" :offset="0">
            <span>出场时间: {{ detailOptions.length!==0 && detailOptions.leaved }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top:15px;margin-bottom:25px">
          <el-col :span="6" :offset="0">
            <span>停车时长: {{ detailOptions.length!==0 && (detailOptions.duration / 60).toFixed(2) }} 小时</span>
          </el-col>
          <el-col :span="6" :offset="0">
            <span>应交金额: {{ detailOptions.length!==0 && detailOptions.money }}</span>
          </el-col>
          <el-col :span="6" :offset="0">
            <span>优惠金额: {{ detailOptions.length!==0 && detailOptions.discountAmount }}</span>
          </el-col>
          <el-col :span="6" :offset="0">
            <span>实付金额: {{ detailOptions.length!==0 && detailOptions.amount }}</span>
          </el-col>
        </el-row>
        <!-- 图片 -->
        <el-image :src="detailOptions.length!==0?detailOptions.lpicture:src" style="width:100%" :preview-src-list="[detailOptions.length!==0?detailOptions.lpicture:src]">
          <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="open=false">关闭</el-button>
        </span>
      </el-dialog>
      <!-- 每一个组件块 -->
      <div v-for="(item,index) in resdata" :key="item.id" class="block">
        <!-- 组件快头部 -->
        <el-header height="50px">
          <el-row :gutter="0">
            <el-col :span="4" :offset="0" :gutter="0">
              <el-button type="success" round size="mini" icon="el-icon-d-arrow-left" style="cursor:default">{{ item.lane.name }}</el-button>
            </el-col>
            <el-col v-show="item.lane.isOnLineName==='在线'" :span="5" :offset="6" :gutter="0">
              <el-button type="success" icon="el-icon-check" circle size="mini" class="btnStatus" />
              <span style="color:#67C23A;font-weight:700">{{ item.lane.isOnLineName }}</span>
            </el-col>
            <el-col v-show="item.lane.isOnLineName==='离线'" :span="5" :offset="6" :gutter="0">
              <el-button type="danger" icon="el-icon-close" circle size="mini" class="btnStatus" />
              <span style="color:#F56C6C;font-weight:700">{{ item.lane.isOnLineName }}</span>
            </el-col>
            <el-col :span="8" :offset="1" :gutter="0">
              <el-button type="primary" size="mini" round :disabled="item.lane.isOnLineName==='离线'?true:false" @click="openRemoteLane(item.lane.id)">远程开闸</el-button>
              <el-button type="warning" size="mini" round style="margin-left:30px" :disabled="item.lane.isOnLineName==='离线'?true:false" @click="closeRemoteLane(item.lane.id)">远程关闸</el-button>
            </el-col>
          </el-row>
        </el-header>
        <!-- 组件块主体 -->
        <el-container class="container">
          <el-main class="main">
            <!-- 图片 -->
            <el-image :src="item.carRecord!==null?(item.lane.type===1?(item.carRecord.epicture !== null?item.carRecord.epicture:src):(item.carRecord.lpicture!==null?item.carRecord.lpicture:src)):src" :preview-src-list="[item.carRecord!==null?(item.lane.type===1?item.carRecord.epicture:item.carRecord.lpicture):src]">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
            <!-- 查看详情按钮 -->
            <el-button v-if="item.carRecord!==null && item.lane.type===2" type="success" size="mini" round class="detail leave" @click="handleLeave('free',item.carRecord.id)">免费放行</el-button>
            <el-button v-if="item.carRecord!==null && item.lane.type===2" type="danger" size="mini" round class="detail fee" @click="handleLeave('fee',item.carRecord.id,item.lane.id)">收费放行</el-button>
            <el-button v-if="item.carRecord!==null && item.lane.type===2" type="primary" size="mini" round class="detail" @click="handleDetail(index)">查看详情</el-button>
            <!-- 开闸放行 -->
            <el-row v-if="item.carRecord!==null && item.lane.type===1" :gutter="0" class="openLane">
              <el-col :span="8" :offset="0">
                <span>{{ item.carRecord.carnumber }}</span>
              </el-col>
              <el-col :span="3" :offset="13" style="margin-bottom:5px">
                <el-button type="warning" size="mini" round style="vertical-align: middle;" @click="handleOpenLane(item.carRecord.id)">开闸放行</el-button>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
      </div>
    </el-container>
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="0" :back-position="0" transition-name="fade" />
    </el-tooltip>
  </el-container>

</template>
<script>
import { getbaoAnLane, openLane, closeLane, confirmOpenLane, confirmFeeLeave, confirmFreeLeave } from '@/api/monitoringCenter/quickMonitoring'
import { getLaneById } from '@/api/system/carSetting'
import BackToTop from '@/components/BackToTop'

export default {
  components: {
    BackToTop
  },
  data() {
    return {
      //   定时器
      timer: null,
      form: {
        id: '',
        comereason: ''
      },
      // 返回顶部
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      },
      // 是否启用遮罩层
      loading: false,
      // 是否显示弹出层
      open: false,
      openLane: false,
      src: require('@/assets/images/quickMonitoringBg.jpg'),
      resdata: [],
      carNumber: [],
      detailOptions: {
        carRecord: {
          carnumber: '',
          carnumbercolor: ''
        }
      }
    }
  },
  created() {
    // 获取保安管辖的车道信息
    this.init()
    // 车辆类型  recordcartype
    this.getDataByType('RecordCarTypeDic').then(res => {
      this.carNumber = res.data
    })
  },
  mounted() {
    this.timer = setInterval(() => {
      this.init()
    }, 5000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    // 远程开闸
    openRemoteLane(id) {
      this.$confirm('请确认周围环境是否安全?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.loading = true // 开启遮罩
        openLane(id).then(res => {
          if (res.code === 200) {
            this.msgSuccess(res.msg)
          }
          this.loading = false // 关闭遮罩
        })
      }).catch(() => {
        this.msgError('开闸已取消')
      })
    },
    // 远程关闸
    closeRemoteLane(id) {
      this.$confirm('请确认周围环境是否安全?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true // 开启遮罩
        closeLane(id).then(res => {
          if (res.code === 200) {
            this.msgSuccess(res.msg)
          }
          this.loading = false // 关闭遮罩
        })
      }).catch(() => {
        this.msgError('关闸已取消')
      })
    },
    // 出场放行
    handleLeave(type, carRecordId, laneId) {
      this.$confirm('请确认周围环境是否安全?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true // 开启遮罩
        let query
        if (type === 'free') {
          query = {
            id: carRecordId
          }
          confirmFreeLeave(query).then(res => {
            if (res.code === 200) {
              this.msgSuccess(res.msg)
            }
            this.loading = false // 关闭遮罩
          })
        } else if (type === 'fee') {
          query = {
            recordId: carRecordId,
            laneId: laneId
          }
          confirmFeeLeave(query).then(res => {
            if (res.code === 200) {
              this.msgSuccess(res.msg)
            }
            this.loading = false // 关闭遮罩
          })
        }
      }).catch(() => {
        this.msgError('出场放行已取消')
      })
    },
    // 查看详情
    handleDetail(index) {
      this.open = true
      this.detailOptions = this.resdata[index].carRecord
      this.carNumber.some(val => {
        if (this.detailOptions.recordcartype.toString() === val.dictValue) {
          this.detailOptions.recordcartype = val.dictLabel
          return true
        }
      })
      getLaneById(this.detailOptions.entermid).then(res => {
        this.detailOptions.entermid = res.data.name
      })
      getLaneById(this.detailOptions.leavemid).then(res => {
        this.detailOptions.leavemid = res.data.name
      })
    },
    // ================================
    init() {
      this.loading = true // 打开遮罩
      getbaoAnLane().then(res => {
        if (res.data !== null) {
          this.resdata = res.data.userLanes
        }
        this.loading = false // 关闭遮罩
      }).catch(() => {
        this.loading = false // 关闭遮罩
      })
    },
    // 点击确认开闸
    handleOpenLane(id) {
      this.openLane = true
      this.form.id = id
    },
    handleSubmit() {
      confirmOpenLane(this.form).then(res => {
        if (res.data !== null) {
          this.msgSuccess(res.data)
        }
        this.loading = false // 关闭遮罩
      }).catch(() => {
        this.loading = false // 关闭遮罩
      })
      this.openLane = false
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
display: block;
// background-color: #E9EEF9;
box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
.footer {
  margin-bottom: 5%;
    margin-left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
        el-button {
        flex: 1;
    }
}
.verifyCode {
  padding: 0;
    el-button {
        border-radius: 0!important;
    }
}
.count {
    cursor:not-allowed;
}
  .block {
    width: 40%;
    margin: 3% 0 0 6.66%;
    position: relative;
    float: left;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    .el-header {
    background-color: #E9EEF3;
    color: #333;
    line-height: 50px;
    .btnStatus {
      vertical-align: middle;
      cursor: default;
    }
    }
    .el-main {
      background-color: #B3C0D1;
      color: #333;
      .detail {
        position: absolute;
        top: 85%;
        left: 83%;
      }
      .leave {
        left: 55%;
      }
      .fee {

      left: 68%;
      }
      .openLane {
        width: 90%;
        margin: 0 0 0 5%;
        font-size: 24px;
        font-weight: 700;
        line-height: 28px;
        color: #409EFF;
        background-color: rgba(0, 0, 0, .01);
        position: absolute;
        bottom: 5%;
        left: 0;
      }
    }
  }
</style>
