<template>
  <div class="content">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="first">
        <div class="test1" />
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">
        <test2 />
      </el-tab-pane>
      <el-tab-pane label="角色管理" name="third">
        <test3 />
      </el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
    <span>hello</span>
  </div>
</template>
<script>
// todo 停车端个人中心与车厂配置待完成
// import test1 from './componets/test1'
import test2 from './componets/test2'
import test3 from './componets/test3'
export default {
  components: {
    // test1,
    test2,
    test3
  }
}
</script>
<style lang="scss">
.content {
  height: 100%;
    .el-tabs {
    height: 100%!important;
    .test1 {
      height: 100%;
      min-height: 100%;
    }
  }
}
</style>
