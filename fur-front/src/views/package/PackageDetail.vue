<template>
  <div id="detail-form">
    <Title :title="'配件详情'"/>
    <div class="container">
      <div class="conform-words">
        <div class="add-title">
          <i class="title-icon"/>
          配件详情
        </div>
        <a-button type="link" icon="arrow-left"@click="$router.go(-1)">返回配件管理</a-button>
      </div>
      <div class="description">
        <a-descriptions layout="vertical" bordered>
          <a-descriptions-item label="序号">{{detailInfo.id || '-'}}</a-descriptions-item>
          <a-descriptions-item label="配件名称">{{detailInfo.package_name || '-'}}</a-descriptions-item>
          <a-descriptions-item label="配件用途">{{detailInfo['material_use.use_name'] || '-'}}</a-descriptions-item>
          <a-descriptions-item label="创建时间">{{detailInfo.package_time || '-'}}</a-descriptions-item>
          <a-descriptions-item label="配件状态">
            <a-badge :status="detailInfo.package_status === '1'? 'processing' : 'warning'" :text="detailInfo.package_status === '1'? '可用' : '不可用'" />
          </a-descriptions-item>
          <a-descriptions-item label="配件总成本">¥{{detailInfo.package_price || 0 | moneyFormat}}</a-descriptions-item>
          <a-descriptions-item label="配件数量">{{detailInfo.package_num || 0}}</a-descriptions-item>
          <a-descriptions-item label="单个配件花费原料" :span="3"><span v-for="item in detailInfo.package_material" :key="item['id']" style="margin-right: 30px;">{{item['material.detail_name'] + '(' + item['spend_num'] + '个)'}}</span></a-descriptions-item>
          <a-descriptions-item label="配件图片" :span="3"><img :src="detailInfo.package_image" alt="" width="200" height="200" /></a-descriptions-item>
          <a-descriptions-item label="配件说明">
            {{detailInfo.package_info || '-'}}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
  import Title from '@/components/contentTitle';
  import { reqPackageDetail } from "../../api/package";
  import { moneyFormat } from "../../filters";

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
      async getPackageDetail (id) {
        const result = await reqPackageDetail(id);
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
      this.getPackageDetail(this.$route.params.id);
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
