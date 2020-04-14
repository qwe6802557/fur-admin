<template>
  <div id="detail-form">
    <Title :title="'产品详情'"/>
    <div class="container">
      <div class="conform-words">
        <div class="add-title">
          <i class="title-icon"/>
          产品详情
        </div>
        <a-button type="link" icon="arrow-left"@click="$router.go(-1)">返回产品管理</a-button>
      </div>
      <div class="description">
        <a-descriptions layout="vertical" bordered>
          <a-descriptions-item label="序号">{{detailInfo.id || '-'}}</a-descriptions-item>
          <a-descriptions-item label="产品名称">{{detailInfo.goods_name || '-'}}</a-descriptions-item>
          <a-descriptions-item label="创建时间">{{detailInfo.goods_time || '-'}}</a-descriptions-item>
          <a-descriptions-item label="产品库存">{{detailInfo.goods_num || 0}}</a-descriptions-item>
          <a-descriptions-item label="单个产品成本">{{detailInfo.goods_single || 0}}</a-descriptions-item>
          <a-descriptions-item label="产品售价" :span="3">¥{{detailInfo.goods_sell || 0 | moneyFormat}}</a-descriptions-item>
          <a-descriptions-item label="产品总成本">¥{{detailInfo.goods_price || 0 | moneyFormat}}</a-descriptions-item>
          <a-descriptions-item label="单个产品消耗配件" :span="3"><span v-for="item in detailInfo.goods_package" :key="item['id']" style="margin-right: 30px;">{{item['package.package_name'] + '(' + item['spend_num'] + '个)'}}</span></a-descriptions-item>
          <a-descriptions-item label="产品图片" :span="3"><img :src="detailInfo.goods_image" alt="" width="200" height="200" /></a-descriptions-item>
          <a-descriptions-item label="产品说明">
            {{detailInfo.goods_info || '-'}}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
  import Title from '@/components/contentTitle';
  import { moneyFormat } from "../../filters";
  import {reqGoodsDetail} from "../../api/goods";

  export default {
    name: "PackageDetail",
    data () {
      return {
        confirmLoading: false,
        detailInfo: {}
      }
    },
    methods: {
      confirm () {

      },
      async getGoodsDetail (id) {
        const result = await reqGoodsDetail(id);
        const { code, message, data } = result.data;
        if (code === 0){
          this.detailInfo = data;
        } else {
          this.$message.error(message);
        }
      }
    },
    filters: {
      moneyFormat (money) {
        return moneyFormat(money);
      }
    },
    components: {
      Title
    },
    mounted() {
      this.getGoodsDetail(this.$route.params.id);
    }
  }
</script>

<style lang="less">
  #detail-form{
    .el-upload__input{
      display: none;
    }
    .ant-table{
      width: 100%;
      th{
        text-align: center;
      }
    }
    .container{
      display: flex;
      flex-direction: column;
      padding: 24px 90px 36px 90px;
      .description{
        width: 100%;
      }
      .conform-words{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
    }
  }
</style>
