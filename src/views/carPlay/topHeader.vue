<template>
  <div id="top-header">
    <dv-decoration-8 class="header-left-decoration" />
    <dv-decoration-5 class="header-center-decoration" />
    <dv-decoration-8 class="header-right-decoration" :reverse="true" />
    <dv-decoration-11 style="width:500px;height:80px;" class="center-title"> 一流云停|停车管理系统</dv-decoration-11>
  </div>
</template>

<script>
export default {
  name: 'TopHeader'
}
</script>

<style lang="scss" scoped>
#top-header {
  position: relative;
  width: 100%;
  flex: 11;
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
  // overflow: hidden;

  .header-center-decoration {
    width: 40%;
    height: 60px;
    margin-top: 3.5%;
  }

  .header-left-decoration, .header-right-decoration {
    width: 25%;
    height: 90px;
  }

  .center-title {
    position: absolute;
    color: aqua;
    font-size: 38px;
    font-weight: 900;
    font-family:STXingkai,STKaiti,KaiTi,KaiTi_GB2312,SimSun,'Microsoft YaHei';
    left: 50%;
    top: 10px;
    transform: translateX(-50%);
  }
}
</style>
