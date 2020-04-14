<template>
  <div id="detail-form">
    <Title :title="'配件计划详情'"/>
    <div class="container">
      <div class="conform-words">
        <div class="add-title">
          <i class="title-icon"/>
          商户详情
        </div>
        <a-button type="link" icon="arrow-left"@click="$router.go(-1)">返回商户管理</a-button>
      </div>
      <div class="description">
        <a-descriptions layout="vertical" bordered>
          <a-descriptions-item label="商户账号">{{!!detailInfo.merchant_username && detailInfo.merchant_username}}</a-descriptions-item>
          <a-descriptions-item label="登录密码" :span="3">{{!!detailInfo.merchant_password && detailInfo.merchant_password}}</a-descriptions-item>
          <a-descriptions-item label="手机号">{{!!detailInfo.merchant_phone && detailInfo.merchant_phone}}</a-descriptions-item>
          <a-descriptions-item label="邮箱">{{!!detailInfo.merchant_eMail && detailInfo.merchant_eMail}}</a-descriptions-item>
          <a-descriptions-item label="地址">{{!!detailInfo.merchant_address && detailInfo.merchant_address}}</a-descriptions-item>
          <a-descriptions-item label="注册时间">{{!!detailInfo.merchant_time && detailInfo.merchant_time || '-'}}</a-descriptions-item>
          <a-descriptions-item label="已付款订单数">
            <a-badge :status="'success'" :text="!!detailInfo.merchant_count && detailInfo.merchant_count.toString() || '0'" />
          </a-descriptions-item>
          <a-descriptions-item label="未交付订单数" :span="3">
            <a-badge :status="'error'" :text="!!detailInfo.order_count && detailInfo.order_count.toString() || '0'" />
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
  import Title from '@/components/contentTitle';
  import { mapState } from 'vuex';
  import {reqMerchantDetail} from "../../api/merchant";
  export default {
    name: "ProducePackageDetail",
    data () {
      return {
        confirmLoading: false,
        visible: false,
        detailInfo: {},
      }
    },
    methods: {
      // 获取商户详情
      async getMerchantDetail () {
        const result = await reqMerchantDetail(this.$route.params.id);

        const { code, message, data } = result.data;

        if (code === 0){
          this.detailInfo = data;
        } else {
          this.$message.error(message);
        }
      }
    },
    computed: {
      ...mapState(['detailUse'])
    },
    components: {
      Title
    },
    mounted() {
      this.getMerchantDetail();
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
  .common-modal{
    img{
      margin-left: 24%;
    }
  }
</style>
