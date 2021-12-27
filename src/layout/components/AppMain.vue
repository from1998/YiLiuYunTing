<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
    <meting-js
      v-if="flag"
      id="2667808564"
      server="netease"
      type="playlist"
      list-folded="true"
      autoplay="true"
    />
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="0" :back-position="0" transition-name="fade" />
    </el-tooltip>
  </section>
</template>

<script>
import bus from '@/utils/bus.js'
import load from '@/components/Tinymce/dynamicLoadScript'
const APlayer = 'https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js'
const Meting = 'https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js'
import BackToTop from '@/components/BackToTop'

export default {
  name: 'AppMain',
  components: {
    BackToTop
  },
  data() {
    return {
      flag: false,
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
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  },
  mounted() {
    bus.$on('musicOpen', (val) => {
      this.flag = val
      import('@/assets/css/APlayer.min.css')
      load(APlayer, () => {
        load(Meting, () => {
        })
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
