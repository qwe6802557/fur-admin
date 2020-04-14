<template>
  <div id="detail-form">
    <Title :title="'原料详情'"/>
    <div class="container">
      <div class="conform-words">
        <div class="add-title">
          <i class="title-icon"/>
          机器详情
        </div>
        <a-button type="link" icon="arrow-left"@click="$router.go(-1)">返回机器管理</a-button>
      </div>
      <div class="description">
        <a-descriptions layout="vertical" bordered>
          <a-descriptions-item label="序号">{{$route.query.machine.id}}</a-descriptions-item>
          <a-descriptions-item label="机器名称">{{$route.query.machine.machine_name}}</a-descriptions-item>
          <a-descriptions-item label="入库时间">{{$route.query.machine.machine_time}}</a-descriptions-item>
          <a-descriptions-item label="运行状态">
            <a-badge :status="$route.query.machine.machine_status === '1'? 'processing' : 'warning'" :text="$route.query.machine.machine_status === '1'? '运行中' : '待运行'" />
          </a-descriptions-item>
          <a-descriptions-item label="机器类型">
            {{$route.query.machine.machine_use === '1'? '产品生产' : '配件生产'}}
          </a-descriptions-item>
          <a-descriptions-item label="机器用途" :span="3">
            {{$route.query.machine['material_use.use_name']}}
          </a-descriptions-item>
          <a-descriptions-item label="机器成本">¥{{$route.query.machine.machine_price}}</a-descriptions-item>
          <a-descriptions-item label="机器图片" :span="3"><img :src="$route.query.machine.machine_image" alt="" width="200" height="200" /></a-descriptions-item>
          <a-descriptions-item label="机器备注">
            {{$route.query.machine.machine_info}}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
  import Title from '@/components/contentTitle';
  export default {
    name: "MachineDetail",
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
