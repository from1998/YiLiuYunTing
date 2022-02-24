<template>
  <div class="player">
    <video-player
      ref="videoPlayer"
      class="vjs-custom-skin"
      :options="playerOptions"
      :playsinline="true"
    />
  </div>
</template>

<script>
// custom skin css
import '@/assets/custom-theme/video.css'

export default {
  name: 'Video',
  data() {
    return {
      // videojs options
      playerOptions: {
        height: '250',
        autoplay: false,
        muted: true,
        language: 'zh-CN',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: 'video/mp4',
          // mp4
          src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
          // webm
          // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
        }],
        poster: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2F09%2F3a%2Fbc%2F093abce7b31f4c8ffdbf345375ff4abb.jpg'
      }
    }
  }
}
</script>
