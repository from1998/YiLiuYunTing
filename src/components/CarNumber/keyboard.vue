<template>
  <div class="license-plate noselect">
    <div class="cph-box">
      <div class="cph-wrap cph-wrap-shadow">
        <span
          v-for="(item, index) in shadow"
          :key="index"
          :class="{active: (clickIndex)==index}"
          @click="cphInputClick(index)"
        >
          {{ cph[index] || (index === 7 ? '+' : '') }}
        </span>
      </div>
    </div>
    <transition name="slide">
      <div v-show="show_keyboard" class="keyboard-wrap" @click="clickBoard">
        <!--=====   头部  =====-->
        <div class="keyboardHeader">
          <div>
            <span
              v-for="(item,index) in specials"
              :key="index"
              class="specials"
              :class="{'kspecials': activeIndex < 7}"
            >{{ item }}</span>
          </div>
          <div class="close">
            <span class="kclose" @click="show_keyboard = false">关闭</span>
          </div>
        </div>
        <!--=====   省  =====-->
        <div v-if="activeIndex === 0">
          <div class="keyboard">
            <span
              v-for="(item, index) in provice.slice(0,10)"
              :key="index"
              @touchstart="touchstart"
              @touchend="touchend"
            >{{ item }}</span>
          </div>
          <div class="keyboard">
            <span
              v-for="(item, index) in provice.slice(10,19)"
              :key="index"
              @touchstart="touchstart"
              @touchend="touchend"
            >{{ item }}</span>
          </div>
          <div class="keyboard">
            <span
              v-for="(item, index) in provice.slice(19,26)"
              :key="index"
              @touchstart="touchstart"
              @touchend="touchend"
            >{{ item }}</span>
          </div>
          <div class="keyboard">
            <span
              v-for="(item, index) in provice.slice(26)"
              :key="index"
              @touchstart="touchstart"
              @touchend="touchend"
            >{{ item }}</span>
            <span class="k-del" @touchstart="touchstart" @touchend="touchend">
              <svg-icon icon-class="backSpace" style="transform: scale(1.8, 1.8);" />
            </span>
          </div>
        </div>
        <!--=====   英文数字  =====-->
        <div v-else>
          <div class="keyboard">
            <span v-for="(item, index) in numbers" :key="index" @touchstart="touchstart" @touchend="touchend">
              {{ item }}</span>
          </div>
          <div class="keyboard">
            <span
              v-for="(item, index) in letters.slice(0,10)"
              :key="index"
              @touchstart="touchstart"
              @touchend="touchend"
            >{{ item }}</span>
          </div>
          <div class="keyboard">
            <span
              v-for="(item, index) in letters.slice(10,19)"
              :key="index"
              @touchstart="touchstart"
              @touchend="touchend"
            >{{ item }}</span>
          </div>
          <div class="keyboard">
            <span class="k-done k-done2" @touchstart="touchstart" @touchend="touchend">
              <!-- <svg-icon icon-class="search" style="transform: scale(1.5, 1.5);" /> -->
              <!-- <i class="el-icon-search" /> -->
              完成
            </span>
            <span
              v-for="(item, index) in letters.slice(19)"
              :key="index"
              @touchstart="touchstart"
              @touchend="touchend"
            >{{ item }}</span>
            <span class="k-del" @touchstart="touchstart" @touchend="touchend">
              <svg-icon icon-class="backSpace" style="transform: scale(1.8, 1.8);" />
            </span>
          </div>
        </div>
      </div>
    </transition>
  </div>

</template>

<script>

export default {
  name: 'LicensePlate',
  data() {
    return {
      carNumber: '',
      showWin: this.show,
      provice: [
        '京', '津', '沪', '渝', '冀', '豫', '云', '辽', '黑',
        '湘', '皖', '鲁', '新', '苏', '浙', '赣', '鄂', '桂',
        '甘', '晋', '蒙', '陕', '吉', '闽', '贵',
        '粤', '青', '藏', '川', '宁', '琼'
      ],
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      letters: [
        'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
        'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
        'Z', 'X', 'C', 'V', 'B', 'N', 'M'
      ],
      specials: ['警', '学', '挂', '领', '使', '港', '澳'],
      cph: [],
      newCph: [],
      shadow: new Array(8),
      show_keyboard: true,
      clickIndex: 0,
      isOk: false
    }
  },
  computed: {
    activeIndex() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.isOk = this.cph.length >= 6 && !this.cph.filter((item, index) => index < 6).includes('')
      return this.clickIndex
    }
  },
  methods: {
    sonFun(carNumber) {
      this.newCph = this.cph = carNumber.split('')
    },
    confirmBtnFn() {
      this.$emit('confirmBtn', this.cph.join(''))
    },
    clickBoard(e) {
      if (e.target.tagName.toLowerCase() === 'span' || e.target.tagName.toLowerCase() === 'svg' || e.target.tagName.toLowerCase() === 'use') {
        if ((!e.target.className && e.target.className.indexOf('k') === -1 && this.clickIndex < 8) || e.target.className === 'specials') {
          this.cph[this.clickIndex] = e.target.textContent.trim()
          this.newCph = this.cph
          this.clickIndex += 1
          if (this.clickIndex > 7) this.clickIndex = 7
        } else if (e.target.className === 'k-del' || e.target.tagName.toLowerCase() === 'svg' || e.target.tagName.toLowerCase() === 'use') {
          this.newCph[this.clickIndex] = ''
          this.cph = this.newCph
          this.clickIndex -= 1
          if (this.clickIndex < 0) this.clickIndex = 0
        } else if (e.target.className.indexOf('k-done2') !== -1) {
          this.confirmBtnFn()
        }
      }
    },
    cphInputClick(i) {
      this.clickIndex = i
      this.show_keyboard = true
    },
    touchstart(e) {
      e.target.classList.add('active_key')
    },
    touchend(e) {
      e.target.classList.remove('active_key')
    }
  }
}
</script>

<style scoped lang="scss">
.license-plate {
  padding: 10px;
  .cph-wrap {
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    line-height: 40px;
    min-height: 40px;

    .active {
      width: 29.5px;
      height: 40px;
      background-color: #2d5fdf;
    }
  }

  .cph-wrap-shadow {
    background-color: #fff;
    z-index: 0;
    margin: 30px 10px 10px;
  }

  .cph-wrap-shadow span {
    font-size: 18px;
  }

  .cph-wrap span {
    position: relative;
    text-align: center;
    width: 29.5px;
    height: 40px;
    border-radius: 2px;
    border: 1px solid #E1E1E1;
    margin-right: 7px;
    background-color: #0084FF;
    color: #fff;
    z-index: 99;
  }

  .cph-wrap span:first-of-type {
    margin-left: 0;
  }

  .cph-wrap span:nth-of-type(8) {
    margin-right: 0;
  }

  .cph-wrap span:last-child::before {
    content: none;
  }

  .keyboard-wrap {
    background: #CFD3DD;
    padding: 0 2px 0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    .keyboardHeader {
      display: flex;
      background-color: #fff;
      margin: 1px -2px 10px -2px;
      line-height: 40px;
      justify-content: space-between;
      align-items: center;
      .specials {
        font-size: 18px;
        margin-left: 12px;
        color: #222;
      }

      .kspecials {
        color: #ccc;
      }

      .close {
        padding-right: 10px;
        display: flex;
        justify-content: flex-end;

        span {
          color: #999;
          text-decoration: none;
          display: block;
          width: 40px;
          height: 40px;
          text-align: center;
          font-size: 16px;
        }
      }
    }
  }

  .keyboard {
    display: flex;
    justify-content: center;
    flex-flow: row wrap;
    position: relative;

    span {
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 1px 2px #666;
      width: calc(10% - 5px);
      text-align: center;
      height: 2.875rem;
      line-height: 2.875rem;
      margin: 0 .15625rem .65rem;
      font-size: 16px;
    }

    .k-del {
      width: 40px;
      position: absolute;
      z-index: 999;
      right: 2px;
      display: block;
      background-color: #F56C6C;
    }

    .k-del img {
      display: block;
      margin: 0 auto;
    }

    .k-done {
      width: 60px;
      position: absolute;
      right: 2px;
      display: block;
      background-color: #0084FF;
      color: #fff;
      font-weight: bold;
    }

    .k-done2 {
      left: 2px;
      width: 40px;
    }
  }

  .keyboard > div {
    display: flex;
  }

  .slide-enter-active, .slide-leave-active {
    transition: all .3s;
    opacity: 1;
    transform: translateY(0);
  }

  .slide-enter, .slide-leave-to {
    opacity: 0;
    transform: translateY(400px);
  }
}

.cph-box {
  position: relative;
  margin: 0 auto;
  padding: 0 15px;
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
}

span.hide {
  opacity: 0;
}

.active_key {
  background-color: #000;
  opacity: 0.2;
}
</style>
