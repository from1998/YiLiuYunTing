<template>
  <div id="digital-flop">
    <div
      v-for="(item) in digitalFlopData"
      :key="item.title"
      ref="digitalFlop"
      class="digital-flop-item"
    >
      <dv-border-box-8 :reverse="true">
        <div class="digital-flop-title">{{ item.title }}</div>
        <div class="digital-flop">
          <dv-digital-flop
            :config="item.number"
            style="width:100px;height:50px;"
          />
          <div class="unit">{{ item.unit }}</div>
        </div>
      </dv-border-box-8>
    </div>

  </div>
</template>

<script>
export default {
  name: 'DigitalFlop',
  data() {
    return {
      digitalFlopData: [],
      resData: {}
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    const { createData } = this

    createData()

    setInterval(createData, 30000)
  },
  methods: {
    createData() {
      this.digitalFlopData = [
        {
          title: '今日收益',
          number: {
            number: [this.resData.todayFee],
            content: '￥',
            textAlign: 'right',
            style: {
              fill: '#f2ce20',
              fontWeight: 'bold'
            }
          },
          unit: '元'
        },
        {
          title: '车场总量',
          number: {
            number: [this.resData.totalStation],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#3366FF',
              fontWeight: 'bold'
            }
          },
          unit: '个'
        },
        {
          title: '设备总量',
          number: {
            number: [this.resData.equipment],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#CC00FF',
              fontWeight: 'bold'
            }
          },
          unit: '台'
        },
        {
          title: '今日进场',
          number: {
            number: [this.resData.todayIn],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#f46827',
              fontWeight: 'bold'
            }
          },
          unit: '辆'
        },
        {
          title: '今日出场',
          number: {
            number: [this.resData.todayOut],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#f46827',
              fontWeight: 'bold'
            }
          },
          unit: '辆'
        },
        {
          title: '进场总量',
          number: {
            number: [this.resData.totalIn],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#00CC66',
              fontWeight: 'bold'
            }
          },
          unit: '辆'
        },
        {
          title: '出场总量',
          number: {
            number: [this.resData.totalOut],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#00CC66',
              fontWeight: 'bold'
            }
          },
          unit: '辆'
        }

      ]
    },
    getData() {
      this.resData = {
        totalStation: 510,
        equipment: 600,
        todayIn: 480,
        todayOut: 556,
        totalIn: 280,
        totalOut: 360,
        todayFee: 360
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#digital-flop {
  position: relative;
  display: flex;
  height: 10%;
  width: 100%;
  flex-shrink: 0;
  padding: 0 0 0 10px;
  // display: flex;
  // justify-content: space-between;
  // align-items: center;

  .digital-flop-item {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  background-color: rgba(6, 30, 93, 0.5);
    // border-left: 3px solid rgb(6, 30, 93);
    // border-right: 3px solid rgb(6, 30, 93);
    // &:nth-child(-n+2) {
    // float: left;
    // }
    &:first-child {
    flex: 2.5;
    }
  }

  .digital-flop-title {
    font-size: 16px;
    margin: 10px 0 px 0;
  }

  .digital-flop {
    display: flex;
  }

  .unit {
    margin-left: 10px;
    display: flex;
    align-items: flex-end;
    box-sizing: border-box;
    padding-bottom: 13px;
  }
}
</style>
