<template>
  <div>
    <button class="btn-default btn-share" @click.stop="sharePopup">
      <span>打开分享图片</span>
    </button>

    <!-- 遮盖层 -->
    <div v-if="showSharePopup" class="cover">
      <!-- 关闭按钮 -->
      <span class="close" @click="closeSharePopup">✖️</span>
    </div>
    <!-- 二维码 -->
    <canvas v-show="false" id="canvas" />
    <!-- 海报 -->
    <canvas
      v-show="showSharePopup"
      id="myCanvas"
      width="200"
      height="100"
    />
  </div>
</template>

<script>
import QRCode from 'qrcode'
export default {
  data() {
    return {
      // 销售侧点击分享图片
      showSharePopup: false,
      posterHtmlBg: require('@/assets/images/bg.png'), // 背景图
      // 二维码的dataUrl
      qrcodeUrl: '',
      // 生成二维码的url
      creatCodeUrl: 'www.baidu.com'
    }
  },
  methods: {
    async sharePopup() {
      this.showSharePopup = true
      await this.createQrcode(this.creatCodeUrl)
      this.drawAndShareImage(this.posterHtmlBg, this.qrcodeUrl, '')
    },
    closeSharePopup() {
      this.showSharePopup = false
    },
    // 生成二维码
    createQrcode(text) {
      const canvas = document.getElementById('canvas')
      QRCode.toCanvas(canvas, text, {
        margin: 0
      })
      const data = canvas.toDataURL('image/png', 1)
      this.qrcodeUrl = data
    },
    // img1背景图、img2二维码
    drawAndShareImage(img1, img2) {
      const canvas = document.getElementById('myCanvas')
      canvas.width = 750
      canvas.height = 1334
      const context = canvas.getContext('2d')
      context.rect(0, 0, canvas.width, canvas.height)
      context.fillStyle = '#fff'
      context.fill()
      const myImage = new Image()
      myImage.src = img1
      myImage.crossOrigin = 'Anonymous'
      myImage.onload = function() {
        context.drawImage(myImage, 0, 0, 750, 1334)
        const myImage2 = new Image()
        myImage2.src = img2
        myImage2.crossOrigin = 'Anonymous'
        myImage2.onload = function() {
          context.drawImage(myImage2, 202, 667, 350, 350)
          const base64 = canvas.toDataURL('image/png')
          const img = document.getElementById('myCanvas')
          img.setAttribute('src', base64)
        }
      }
    }

  }
}
</script>
