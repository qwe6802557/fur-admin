<template>
  <div id="detail-form">
    <Title :title="'原料详情'"/>
    <div class="container">
      <div class="conform-words">
        <div class="add-title">
          <i class="title-icon"/>
          原料详情
        </div>
        <a-button type="link" icon="arrow-left"@click="$router.go(-1)">返回原料管理</a-button>
      </div>
      <div class="description">
        <a-descriptions layout="vertical" bordered>
          <a-descriptions-item label="序号">{{$route.query.detail.id}}</a-descriptions-item>
          <a-descriptions-item label="原料名称">{{$route.query.detail.detail_name}}</a-descriptions-item>
          <a-descriptions-item label="入库时间">{{$route.query.detail.detail_time}}</a-descriptions-item>
          <a-descriptions-item label="原料状态" :span="3">
            <a-badge :status="$route.query.detail.detail_status === '1'? 'processing' : 'warning'" :text="$route.query.detail.detail_status === '1'? '可用' : '不可用'" />
          </a-descriptions-item>
          <a-descriptions-item label="原料价格">¥{{$route.query.detail.detail_price}}</a-descriptions-item>
          <a-descriptions-item label="原料数量" :span="3">{{$route.query.detail.detail_num}}</a-descriptions-item>
          <a-descriptions-item label="原料图片" :span="3"><img :src="$route.query.detail.detail_image" alt="" width="200" height="200" /></a-descriptions-item>
          <a-descriptions-item label="原料说明">
           {{$route.query.detail.detail_info}}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
  import Title from '@/components/contentTitle';
  export default {
    name: "MaterialDetail",
    data () {
      return {
        confirmLoading: false
      }
    },
    methods: {
      confirm () {

      }
    },
    components: {
      Title
    },
    mounted() {
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
