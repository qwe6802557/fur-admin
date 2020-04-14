<template>
  <div id="detail-form">
    <Title :title="'配件计划详情'"/>
    <div class="container">
      <div class="conform-words">
        <div class="add-title">
          <i class="title-icon"/>
          配件计划详情
        </div>
        <a-button type="link" icon="arrow-left"@click="$router.go(-1)">返回配件计划管理</a-button>
      </div>
      <div class="description">
        <a-descriptions layout="vertical" bordered>
          <a-descriptions-item label="生产编号">{{$route.query.produce.id}}</a-descriptions-item>
          <a-descriptions-item label="配件名称">{{$route.query.produce['package.package_name']}}</a-descriptions-item>
          <a-descriptions-item label="配件用途">{{detailUse.filter( item => item.id === $route.query.produce['package.package_use'])[0].use_name}}</a-descriptions-item>
          <a-descriptions-item label="运行机器">{{$route.query.produce['machine.machine_name']}}</a-descriptions-item>
          <a-descriptions-item label="生产总数量">{{$route.query.produce.produce_num}}</a-descriptions-item>
          <a-descriptions-item label="生产总成本">¥{{$route.query.produce.produce_price}}</a-descriptions-item>
          <a-descriptions-item label="生产状态" :span="3">
            <a-badge :status="$route.query.produce.produce_status === '0'? 'processing' : 'success'" :text="$route.query.produce.produce_status === '0'? '生产中' : '已完成'" />
          </a-descriptions-item>
          <a-descriptions-item label="开始时间">
            {{$route.query.produce.produce_start_time}}
          </a-descriptions-item>
          <a-descriptions-item label="预计完成时间" :span="3">
            {{$route.query.produce.produce_end_time}}
          </a-descriptions-item>
          <a-descriptions-item label="备注">
            {{$route.query.produce.produce_info || '-'}}
          </a-descriptions-item>
        </a-descriptions>
        <a-button type="link" @click="bornCode">生成二维码</a-button>
      </div>
      <a-modal :title="'二维码'"
               v-model="visible"
               class="common-modal"
               @ok="handleOk"
               :destroyOnClose="true"
               :keyboard="true"
               :maskClosable="false"
               :okText="'上传服务器'"
               :cancelText="'取消'"
               :confirmLoading="confirmLoading">
        <div id="picCode">

        </div>
      </a-modal>
    </div>
  </div>
</template>

<script type="text/jsx">
  import Title from '@/components/contentTitle';
  import { mapState } from 'vuex';
  import QRCode from "qrcodejs2";
  import {reqUploadPicCode} from "../../api/picCode";
  export default {
    name: "ProducePackageDetail",
    data () {
      return {
        confirmLoading: false,
        visible: false,
      }
    },
    methods: {
      //  生成二维码
      bornCode() {
        this.visible = true;
        this.$nextTick(() => {
          this.qrCode();
        })
      },
      async handleOk () {
        const base64 = document.querySelector('#picCode img').src;
        this.confirmLoading = true;
        const result = await reqUploadPicCode({
          base64,
          code_type: '0',
          produce_id: this.$route.query.produce.id,
        });

        const { code, message } = result.data;

        if (code === 0){
          this.$message.success(message);
        } else {
          this.$message.error(message);
        }
        this.confirmLoading = false;
        this.visible = false;
      },
      qrCode() {
        const htmlStr = `生产编号:${this.$route.query.produce.id}
        -----配件名称:${this.$route.query.produce['package.package_name']}------生产状态:${this.$route.query.produce.produce_status === '0' ? '生产中' : '已完成'}`;
        new QRCode('picCode', {
          width: 250,
          height: 250,        // 高度
          text: htmlStr,   // 二维码内容
          // render: 'canvas' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
          // background: '#f0f',   // 背景色
          // foreground: '#ff0'    // 前景色
        })
      },
    },
    computed: {
      ...mapState(['detailUse'])
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
  .common-modal{
    img{
      margin-left: 24%;
    }
  }
</style>
