<template>
  <div class="content">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="车场信息" name="depotInfo" lazy>
        <depot-info />
      </el-tab-pane>
      <el-tab-pane label="车场配置" name="depotSet" lazy :v-if="flag">
        <depot-set />
      </el-tab-pane>
      <el-tab-pane label="收费规则" name="feeRule" lazy :v-if="flag">
        <fee-rule />
      </el-tab-pane>
      <el-tab-pane label="新能源收费规则" name="energyRule" lazy :v-if="flag">
        <energy-rule />
      </el-tab-pane>
      <el-tab-pane label="岗亭设置" name="watchhouseSet" lazy :v-if="flag">
        <watchhouse-set />
      </el-tab-pane>
      <el-tab-pane label="车道设置" name="laneSet" lazy :v-if="flag">
        <lane-set />
      </el-tab-pane>
      <el-tab-pane label="保安管理" name="secManger" lazy :v-if="flag">
        <sec-manger />
      </el-tab-pane>
      <el-tab-pane label="车位管理" name="portManger" lazy :v-if="flag">
        <port-manger />
      </el-tab-pane>
    </el-tabs>
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="0" :back-position="0" transition-name="fade" />
    </el-tooltip>
    <!-- 二维码弹出层 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="300px"
      center
    >
      请先注册车场，才可进行车厂配置。
      <span slot="footer" class="dialog-footer">
        <el-button type="success" icon="el-icon-close" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 导入组件
import depotInfo from './componets/depotInfo'
import depotSet from './componets/depotSet'
import feeRule from './componets/feeRule'
import laneSet from './componets/laneSet'
import portManger from './componets/portManger'
import secManger from './componets/secManger'
import watchhouseSet from './componets/watchhouseSet'
import BackToTop from '@/components/BackToTop'
import energyRule from '@/views/system/user/componets/energyRule'

import { getDepotById } from '@/api/system/carSetting'

export default {
  components: {
    depotInfo,
    depotSet,
    feeRule,
    laneSet,
    portManger,
    secManger,
    watchhouseSet,
    BackToTop,
    energyRule
  },
  data() {
    return {
      flag: true,
      activeName: 'depotInfo',
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      }
    }
  },
  created() {
    this.activeName = window.sessionStorage.getItem('activeName') || 'depotInfo'
    const managerid = this.$route.params && this.$route.params.id // 路由传参
    getDepotById({
      managerid: managerid
    }).then(res => {
      if (res.data === null) {
        this.flag = false
      }
    })
  },
  methods: {
    handleClick(tab) {
      window.sessionStorage.setItem('activeName', tab.paneName)
    }
  }
}
</script>
<style lang="scss">
.el-tabs__nav {
  transform: translateX(40px) !important;
}
</style>
