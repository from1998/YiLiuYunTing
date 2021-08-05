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

    <!-- <dv-decoration-10 />
    <dv-decoration-10 /> -->
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
          title: '车场总量',
          number: {
            number: [this.resData.totalStation],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#4d99fc',
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
              fill: '#40faee',
              fontWeight: 'bold'
            }
          },
          unit: '台'
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
          title: '今日进场',
          number: {
            number: [this.resData.todayIn],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#4d99fc',
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
              fill: '#40faee',
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
              fill: '#f46827',
              fontWeight: 'bold'
            }
          },
          unit: '辆'
        }
      ]
    },
    getData() {
      this.resData = {
        totalStation: 500,
        equipment: 500,
        todayIn: 500,
        todayOut: 500,
        totalIn: 500,
        totalOut: 500
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#digital-flop {
  position: relative;
  height: 10%;
  width: 100%;
  flex-shrink: 0;
  padding: 0 10px;
  // display: flex;
  // justify-content: space-between;
  // align-items: center;
  .dv-decoration-10 {
    // position: absolute;
    // left: 2.5%;
    // bottom: 0px;
    width: 37%;
    height: 2px;
    &:first-child {
      float: left;
    }
    &:last-child {
      float: right;
      transform: rotate(180deg);
    }
  }

  .digital-flop-item {
    width: calc(100% / 6);
    height: 105%;
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
    &:nth-child(n+1) {
    float: right;
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
