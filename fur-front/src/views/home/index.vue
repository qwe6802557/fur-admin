<template>
  <div id="home">
    <div class="first-part">
      <div id="province">
        <div class="choose-area">
          <Title :title="'商家分布图'" :hasTriangle="true" />
        </div>
        <a-spin tip="获取商家分布图数据中..." :spinning="spinning1">
          <div id="province-map">

          </div>
        </a-spin>
      </div>
      <div id="merchant">
        <div class="choose-area">
          <Title :title="'订单分析图'" :hasTriangle="true" />
        </div>
        <a-spin tip="获取订单分析图数据中..." :spinning="spinning2">
          <div id="merchant-map">
          </div>
        </a-spin>
      </div>
    </div>
    <div class="third-part">
      <div id="type">
        <div class="choose-area">
          <Title :title="'计划分析图'" :hasTriangle="true" />
        </div>
        <a-spin tip="获取计划分析图数据中..." :spinning="spinning5">
          <div id="type-map">
          </div>
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script>
  import Title from '@/components/contentTitle';
  import '../../../node_modules/echarts/map/js/china.js'
  import { provinceMap, chatPie, longPie } from "../../plugins/echarts";
  import { reqOrder, reqMerchant, reqProduce } from "../../api/home";

  export default {
    name: "Home",
    data () {
      return {
        spinning1: false,
        spinning2: false,
        spinning3: false,
        spinning4: false,
        spinning5: false,
        selectValue1: [],
        tableValue1: '',
        columnData1: [],
        columnValue1: '',
        columnData2: [],
        columnValue2: '',
        columnData3: [],
        columnValue3: '',
        columnData4: [],
        columnValue4: '',
        columnData5: [],
        columnValue5: '',
        selectValue2: [],
        tableValue2: '',
        selectValue3: [],
        tableValue3: '',
        selectValue4: [],
        tableValue4: '',
        selectValue5: [],
        tableValue5: '',
        mapData1: [],
        mapData2: [],
        mapData3: [],
        mapData4: [],
        mapData5: [],
      }
    },
    methods: {
      provinceInit (data) {
        let chinaMap = this.$echarts.init(document.getElementById('province-map'));
        chinaMap.setOption(provinceMap(data));
      },
      merchantInit (data) {
        let chinaMap = this.$echarts.init(document.getElementById('merchant-map'));
        const newData = data.length > 0 ? data.map( item => item.value).reduce( (total, cItem) =>total + cItem ) : 0;
        chinaMap.setOption(chatPie(chinaMap, '订单分析图', data, newData));
      },
      typeInit (data) {
        let chinaMap = this.$echarts.init(document.getElementById('type-map'));
        chinaMap.setOption(longPie(data));
      },
      async countMap1 () {
        this.spinning1 = true;
        const result_map  = await reqMerchant();
        const { code, message, data } = result_map.data;
        if (code === 0){
          this.mapData1 = data;
          this.provinceInit(this.mapData1);
        } else {
          this.$message.error(message);
        }
        this.spinning1 = false;
      },
      async countMap2 () {
        this.spinning2 = true;
        const result_map  = await reqOrder();
        const { code, message, data } = result_map.data;
        if (code === 0){
          this.mapData2 = data;
          this.merchantInit(this.mapData2);
        } else {
          this.$message.error(message);
        }
        this.spinning2 = false;
      },
      async countMap5 () {
        this.spinning5 = true;
        const result_map  = await reqProduce();
        const { code, message, data } = result_map.data;
        if (code === 0){
          this.mapData5 = data;
          this.typeInit(this.mapData5);
        } else {
          this.$message.error(message);
        }
        this.spinning5 = false;
      },
    },
    components: {
      Title
    },
    mounted() {
      this.countMap1();
      this.countMap2();
      this.countMap5();
    }
  }
</script>

<style lang="less">
  #home{
    padding: 10px;
    .content-title{
      margin-top: 20px;
    }
    .first-part{
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      #province{
        width: 49%;
        height: 530px;
        background: white;
        border-radius: 8px;
        position: relative;
        #province-map{
          width: 100%;
          height: 400px;
        }
      }
      #merchant{
        width: 49%;
        height: 530px;
        background: white;
        border-radius: 8px;
        #merchant-map{
          width: 100%;
          height: 400px;
        }
      }
    }
    .second-part{
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-top: 30px;
      #city{
        width: 49%;
        height: 530px;
        background: white;
        border-radius: 8px;
        position: relative;
        #city-map{
          width: 100%;
          height: 430px;
        }
      }
      #count{
        width: 49%;
        height: 530px;
        background: white;
        border-radius: 8px;
        #count-map{
          width: 100%;
          height: 430px;
        }
      }
    }
    .third-part{
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-top: 30px;
      background: white;
      #type{
        width: 100%;
        height: 530px;
        border-radius: 8px;
        position: relative;
        #type-map{
          width: 100%;
          height: 430px;
        }
      }
    }
    .choose-area{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }
  .admin-content{
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>
