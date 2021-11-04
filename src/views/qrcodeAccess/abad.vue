<template>
  <!-- 该页面既是出场支付页面也是用户预付款查询成功页面 -->
  <div id="ad-container" style="padding:30px 0 0 0">
    <div id="anbo-ad-st" />
    <div class="advwrap" />
  </div>
</template>
<script>
import { getNoPayData } from '@/api/qrcodeAccess/accessOut'
import load from '@/components/Tinymce/dynamicLoadScript'
const adJs = 'https://sdk.anbokeji.net/adv/index.js'
export default {
  name: 'AbWrapper',
  //   props: {
  //     abParkId: {
  //       type: String,
  //       default: ''
  //     }
  //   },
  data() {
    return {
      AbParkId: '',
      queryParams: {
        carNumber: '',
        couponsRecordId: '',
        parkId: ''
      }
    }
  },
  created() {
    // 取路由路径上的参数
    this.queryParams.parkId = this.$route.query && this.$route.query.parkId// 路由传参
    this.queryParams.carNumber = this.$route.query && this.$route.query.carNumber// 路由传参

    // 查询进场数据
    this.getData()
  },
  methods: {
    // 查询进场数据
    getData() {
      this.loading = true // 打开遮罩
      getNoPayData(this.queryParams).then(res => {
        this.AbParkId = res.data.park.abId
        // 优惠券ID
        this.queryParams.couponsRecordId = res.data.couponsRecord.id
        this.queryParams.carNumber = res.data.carNumber
      })
      this.loading = false// 关闭遮罩
    },
    mounted() {
      this.init()
      this.msgSuccess('加载成功')
    },
    // 脚本初始化加载
    init() {
      // 加载安泊广告脚本
      load(adJs, () => {
        const container = document.getElementById('ad-container')
        const st = document.querySelector('#anbo-ad-st')
        if (st) {
          container.removeChild(st)
        }
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.id = 'anbo-ad-st'
        script.innerHTML = '__anbo_adv_sdk__.init({appid: "ab9N879pd0ZUt1dAZh", adPosId:"3",parkId:"' + this.AbParkId + '",})'
        container.append(script)
        document.querySelector('.advwrap').innerHTML = "<anboadv type='10001' @show='advShow'></anboadv>"
        window.advShow = function() {
        }
      })
    }
  }
}
</script>
<style css>
.advwrap {
  height: 200px;
  margin: auto;
    margin-top: 50px;
  width: 90%;
}
</style>
