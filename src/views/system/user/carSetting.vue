<template>
  <div class="content">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="车场信息" name="depotInfo">
        <depot-info />
      </el-tab-pane>
      <el-tab-pane label="车场配置" name="depotSet">
        <depot-set />
      </el-tab-pane>
      <el-tab-pane label="收费规则" name="feeRule">
        <fee-rule />
      </el-tab-pane>
      <el-tab-pane label="岗亭设置" name="watchhouseSet">
        <watchhouse-set />
      </el-tab-pane>
      <el-tab-pane label="车道设置" name="laneSet">
        <lane-set />
      </el-tab-pane>
      <el-tab-pane label="保安管理" name="secManger">
        <sec-manger />
      </el-tab-pane>
      <el-tab-pane label="车位管理" name="portManger">
        <port-manger />
      </el-tab-pane>
    </el-tabs>
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="0" :back-position="0" transition-name="fade" />
    </el-tooltip>
  </div>
</template>
<script>
// todo 停车端个人中心与车厂配置待完成
// import test1 from './componets/test1'
import depotInfo from './componets/depotInfo.vue'
import depotSet from './componets/depotSet'
import feeRule from './componets/feeRule'
import laneSet from './componets/laneSet'
import portManger from './componets/portManger'
import secManger from './componets/secManger'
import watchhouseSet from './componets/watchhouseSet'
import BackToTop from '@/components/BackToTop'
export default {
  components: {
    depotInfo,
    depotSet,
    feeRule,
    laneSet,
    portManger,
    secManger,
    watchhouseSet,
    BackToTop
  },
  data() {
    return {
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

  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    }
  }
}
</script>
<style lang="scss">
.el-tabs__nav {
  transform: translateX(40px) !important;
}
</style>
