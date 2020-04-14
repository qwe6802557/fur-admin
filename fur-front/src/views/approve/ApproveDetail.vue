<template>
  <div id="detail-form">
    <Title :title="'配件详情'"/>
    <div class="container">
      <div class="conform-words">
        <div class="add-title">
          <i class="title-icon"/>
          配件详情
        </div>
        <a-button type="link" icon="arrow-left"@click="$router.go(-1)">返回审批管理</a-button>
      </div>
      <div class="description">
        <a-descriptions layout="vertical" bordered>
          <a-descriptions-item label="序号">{{detailInfo.id || '-'}}</a-descriptions-item>
          <a-descriptions-item label="审批类型">{{detailInfo.approve_type && detailInfo.approve_type === '0' && '配件生产' || detailInfo.approve_type === '1' && '产品生产' || '-'}}</a-descriptions-item>
          <a-descriptions-item label="审批过程">{{detailInfo.approve_type &&  detailInfo.approve_type === '0'  && '生产中 → 已完成' || detailInfo.produce &&  detailInfo.produce.start_name + ' → ' + detailInfo.produce.end_name || '-'}}</a-descriptions-item>
          <a-descriptions-item label="审批状态">
            <a-tag :color="detailInfo.approve_status === '0' && 'green' || detailInfo.approve_status === '1' && '#2db7f5' || 'red'">
            {{detailInfo.approve_status === '0' &&  '待审批' || detailInfo.approve_status === '1' && '通过' || '驳回'}}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="提交人">
            {{detailInfo.approve_creator && detailInfo.approve_creator === $store.state.userInfo.username && '我' || detailInfo.approve_creator !== $store.state.userInfo.username && detailInfo.approve_creator ||  '-'}}
          </a-descriptions-item>
          <a-descriptions-item label="提交时间">{{detailInfo.approve_time || '-'}}</a-descriptions-item>
          <a-descriptions-item label="审批人">{{detailInfo.approve_name || '-'}}</a-descriptions-item>
          <a-descriptions-item label="审批意见">
            {{detailInfo.approve_advice || '-'}}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
  import Title from '@/components/contentTitle';
  import { moneyFormat } from "../../filters";
  import {reqApproveDetail} from "../../api/approve";

  export default {
    name: "ApproveDetail",
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
        const result = await reqApproveDetail(id);
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
