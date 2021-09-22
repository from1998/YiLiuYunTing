<template lang="zh_CN">
  <div>
    <div v-if="isShow" class="panel-wrap" data-value="exit" @click="colse_da">
      <div class="vehicle-panel" :style="{background:backgroundColor}">
        <!-- height:'500rpx'; -->
        <div class="topItem">
          <span class="check" @click="check">中/英</span>
          <span class="exit" @click="vehicleTap(&quot;exit&quot;)">取消</span>

        </div>
        <!--省份简写键盘-->
        <div v-if="keyBoardType === 1">
          <div class="vehicle-panel-row">
            <div v-for="(item,idx) in keyVehicle1" :key="idx+item" class="vehicle-panel-row-button" :style="{border:buttonBorder}" @click="vehicleTap(item)">{{ item }}</div>
          </div>
          <div class="vehicle-panel-row">
            <div v-for="(item,idx) in keyVehicle2" :key="idx+item" class="vehicle-panel-row-button" :style="{border:buttonBorder}" @click="vehicleTap(item)">{{ item }}</div>
          </div>
          <div class="vehicle-panel-row">
            <div v-for="(item,idx) in keyVehicle3" :key="idx+item" class="vehicle-panel-row-button" :style="{border:buttonBorder}" @click="vehicleTap(item)">
              {{ item }}
            </div>
            <div :style="{border:buttonBorder}" class="vehicle-panel-row-button vehicle-panel-row-button-img">
              <svg-icon icon-class="backSpace" mode="aspectFit" class="vehicle-en-button-delete" @click="vehicleTap(&quot;delete&quot;)" />
            </div>
          </div>

          <div class="vehicle-panel-row-last">
            <div
              v-for="(item,idx) in keyVehicle4"
              :key="idx+item"
              class="vehicle-panel-row-button vehicle-panel-row-button-last"
              :style="{border:buttonBorder}"
              @click="vehicleTap(item)"
            >{{ item }}</div>
          </div>
        </div>
        <!--英文键盘  -->
        <div v-else>
          <div class="vehicle-panel-row">
            <div
              v-for="(item,idx) in keyNumber"
              :key="item+idx"
              class="vehicle-panel-row-button vehicle-panel-row-button-number"
              :style="{border:buttonBorder}"
              @click="vehicleTap(item)"
            >
              {{ item }}
            </div>
          </div>
          <div class="vehicle-panel-row">
            <div v-for="(item,idx) in keyEnInput1" :key="idx+item" class="vehicle-panel-row-button" :style="{border:buttonBorder}" @click="vehicleTap(item)">{{ item }}</div>
          </div>
          <div class="vehicle-panel-row">
            <div v-for="(item,idx) in keyEnInput2" :key="idx+item" class="vehicle-panel-row-button" :style="{border:buttonBorder}" @click="vehicleTap(item)">{{ item }}</div>
            <div :style="{border:buttonBorder}" class="vehicle-panel-row-button vehicle-panel-row-button-img">
                <svg-icon icon-class="backSpace" mode="aspectFit" class="vehicle-en-button-delete" @click="vehicleTap(&quot;delete&quot;)" />
            </div>
          </div>
          <div class="vehicle-panel-row-last">
            <div
              v-for="(item,idx) in keyEnInput3"
              :key="idx+item"
              class="vehicle-panel-row-button vehicle-panel-row-button-last"
              :style="{border:buttonBorder}"
              @click="vehicleTap(item)"
            >{{ item }}</div>
            <div :style="{border:buttonBorder}" class="vehicle-panel-row-button vehicle-panel-ok" @click="vehicleTap(&quot;ok&quot;)">确定</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      // 删除图片
      deleteSvg: require('@/icons/svg/backSpace.svg'),
      keyVehicle1: ['陕', '京', '津', '沪', '冀', '豫', '云', '辽'],
      keyVehicle2: ['黑', '湘', '皖', '鲁', '新', '苏', '浙', '赣'],
      keyVehicle3: ['鄂', '桂', '甘', '晋', '蒙', '吉', '闽'],
      keyVehicle4: ['粤', '川', '青', '藏', '琼', '宁', '贵', '渝'],
      keyNumber: '1234567890',
      keyEnInput1: 'QWERTYUIOP',
      keyEnInput2: 'ASDFGHJKL',
      keyEnInput3: 'ZXCVBNM',
      backgroundColor: '#fff',
      keyBoardType: 1,
      buttonBorder: '1px solid #ccc'
    }
  },
  methods: {
    vehicleTap: function(event) {
      switch (event) {
        case 'delete':
          this.$emit('delete')
          this.$emit('inputchange', event)
          break
        case 'ok':
          this.$emit('ok')
          break
        case 'exit':
          this.$emit('exit')
          break
        default:
          this.$emit('inputchange', event)
      }
    },
    colse_da() {
      this.$emit('exit2')
    },
    check() {
      if (this.keyBoardType === 1) {
        this.keyBoardType = 2
      } else if (this.keyBoardType === 2) {
        this.keyBoardType = 1
      }
    }
  }
}
</script>
<style scoped>
.svg-icon {
  width: 2.8em;
  height: 2.8em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
:host {
  width: 100%;
}
.panel-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}
.vehicle-panel {
  width: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1000;
  /* background: #fff; */
  background: rgba(0, 0, 0, 0.5);

}
.jik {
  width: 2.1rem;
  height: 2.8rem;
}

.vehicle-panel-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.vehicle-panel-row-last {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.vehicle-panel-row-button {
  background-color: #fff;
  margin: 0.175rem;
  padding: 0.175rem;
  width: 2.8rem;
  height: 2.8rem;
  text-align: center;
  line-height: 2.8rem;
  border-radius: 0.35rem;
}
.vehicle-panel-row-button-number {
  background-color: #eee;
}
.vehicle-panel-row-button-last {
  width: 3.15rem;
  height: 3.15rem;
  line-height: 3.15rem;
}
.vehicle-hover {
  background-color: #ccc;
}
.vehicle-panel-row-button-img {
  display: flex;
  justify-content: center;
  align-items: center;
}
.vehicle-en-button-delete {
  width: 1.925rem;
  height: 2.975rem;
}
.vehicle-panel-ok {
  background-color: #6a7cff;
  color: #fff;
  width: 5.25rem;
  height: 2.8rem;
  line-height: 2.8rem;
}
.topItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3.5rem;
  /* background: #f0f0f0; */
}
.exit {
  margin-right: 1.05rem;
  color: #6a7cff;
  font-size: 0.98rem;
  display: block;
  line-height: 1.75rem;
}
.check {
  margin-left: 1.05rem;
  color: #6a7cff;
  font-size: 0.98rem;
  display: block;
  line-height: 1.75rem;
}
</style>>
