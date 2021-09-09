<template>
  <el-container>
    <!-- 标题 -->
    <el-header class="container" height="46px" style="padding:25px 0 45px;font-size:30px;font-weight:700;text-align:center;background-color: #fff;">
      监控中心
    </el-header>
    <!-- 主体 -->
    <el-container class="container">
      <!-- 查看详情弹出层 -->
      <el-dialog
        title="进出场详情"
        :visible.sync="open"
        width="600px"
        center
        append-to-body
      >
        <el-row :gutter="20">
          <el-col :span="8" :offset="0">
            <div border="true">车牌号:</div>
          </el-col>
          <el-col :span="8" :offset="0">
            <span>车辆类型:</span>
          </el-col>
          <el-col :span="8" :offset="0">
            <span>车牌类型:</span>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top:15px">
          <el-col :span="8" :offset="0">
            <span>是否进场:</span>
          </el-col>
          <el-col :span="8" :offset="0">
            <span>进场车道:</span>
          </el-col>
          <el-col :span="8" :offset="0">
            <span>进场时间:</span>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top:15px">
          <el-col :span="8" :offset="0">
            <span>是否出场:</span>
          </el-col>
          <el-col :span="8" :offset="0">
            <span>出场车道:</span>
          </el-col>
          <el-col :span="8" :offset="0">
            <span>出场时间:</span>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top:15px;margin-bottom:25px">
          <el-col :span="8" :offset="0">
            <span>停车时长:</span>
          </el-col>
          <el-col :span="8" :offset="0">
            <span>应交金额:</span>
          </el-col>
        </el-row>
        <!-- 图片 -->
        <el-image :src="src" style="width:100%">
          <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="open=false">关闭</el-button>
        </span>
      </el-dialog>
      <!-- 每一个组件快 -->
      <div v-for="item in resdata" :key="item.id" class="block">
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
            <el-image :src="src">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
            <el-button type="primary" size="mini" round class="detail" @click="handleDetail">查看详情</el-button>
            <!-- 查看详情按钮 -->
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
import { getbaoAnLane, openLane, closeLane } from '@/api/quickMonitoring'
import validate from '@/utils/validate'
import BackToTop from '@/components/BackToTop'

export default {
  components: {
    BackToTop
  },
  data() {
    return {
      //   定时器
      timer: null,
      // 验证规则
      validate,
      rules: {
        legalpersonphone: validate.phone,
        idnumber: validate.idNumber,
        type: validate.notEmpty,
        legalpersonname: validate.notEmpty,
        merchantname: validate.notEmpty,
        registersmscode: validate.notEmpty
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
      src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      resdata: []
    }
  },
  created() {
    // 获取保安管辖的车道信息
    this.init()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    // 远程开闸
    openRemoteLane(id) {
      this.$confirm('确定开闸?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.loading = true // 开启遮罩
        openLane(id).then(res => {
          if (res.code === 200) {
            this.msgSuccess('开闸成功')
          }
          this.loading = false // 关闭遮罩
        }).catch(() => {
          this.msgError('开闸失败')
        })
      }).catch(() => {
        this.msgError('开闸已取消')
      })
    },
    // 远程关闸
    closeRemoteLane(id) {
      this.$confirm('确定关闸?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true // 开启遮罩
        closeLane(id).then(res => {
          if (res.code === 200) {
            this.msgSuccess('关闸成功')
          }
          this.loading = false // 关闭遮罩
        }).catch(() => {
          this.msgError('关闸失败')
        })
      }).catch(() => {
        this.msgError('关闸已取消')
      })
    },
    handleDetail() {
      this.open = true
    },
    // ================================
    init() {
      this.timer = setInterval(() => {
        this.loading = true // 打开遮罩
        getbaoAnLane().then(res => {
          if (res.data !== null) {
            this.resdata = res.data.userLanes
          }
          this.loading = false // 关闭遮罩
        }).catch(() => {
          this.loading = false // 关闭遮罩
        })
      }, 2000)
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
        top: 83%;
        left: 76%;
      }
    }
  }
</style>
