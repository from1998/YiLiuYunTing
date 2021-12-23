<template>
  <div class="content">
    <div v-if="tipShow">
      <br>
      <span style="padding-left:40px;line-height:20px">
        <el-tag type="info" size="medium" effect="dark" closable @close="tipShow=false">提示：此页面下的Tabs页面均为手机端扫码进出场使用到的一系列页面，在这里只做展示，不可正常使用。</el-tag>
      </span>
      <br>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="扫码进场" name="accessIn" lazy>
        <accessIn />
      </el-tab-pane>
      <el-tab-pane label="扫码出场(未支付)" name="accessOutNoPay" lazy>
        <accessOutNoPay />
      </el-tab-pane>
      <el-tab-pane label="扫码出场(已支付)" name="accessOutPayed" lazy>
        <accessOutPayed />
      </el-tab-pane>
      <el-tab-pane label="预付款" name="imprest" lazy>
        <imprest />
      </el-tab-pane>
      <el-tab-pane label="查询失败" name="queryFails" lazy>
        <queryFails />
      </el-tab-pane>
    </el-tabs>
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="0" :back-position="0" transition-name="fade" />
    </el-tooltip>
  </div>
</template>
<script>
// 导入组件
import accessIn from './accessIn'
import accessOutNoPay from './accessOutNoPay'
import accessOutPayed from './accessOutPayed'
import imprest from './imprest'
import queryFails from './queryFails'

import BackToTop from '@/components/BackToTop'

export default {
  components: {
    accessIn,
    accessOutNoPay,
    accessOutPayed,
    imprest,
    queryFails,
    BackToTop
  },
  data() {
    return {
      activeName: 'accessIn',
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      },
      tipShow: true
    }
  },
  created() {
    this.activeName = window.sessionStorage.getItem('activeScanQRCodePage') || 'accessIn'
  },
  methods: {
    handleClick(tab) {
      window.sessionStorage.setItem('activeScanQRCodePage', tab.paneName)
    }
  }
}
</script>
<style lang="scss">
.el-tabs__nav {
  transform: translateX(40px) !important;
}
</style>
