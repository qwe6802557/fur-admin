<template>
    <div class="product">
    <div class="product-content">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <i class="line"></i>
          <h2>产品列表</h2>
        </div>
        <div class="devider">
          <span :class="parentId==0?'is-active':''" @click="parentId=0">产品列表</span>
          <el-divider direction="vertical" v-if="showList"></el-divider>
          <span v-if="showList" :class="parentId==1?'is-active':''"@click="parentId=1">配件列表</span>
          <span class="el-icon-right" v-if="showChild"></span>
          <span v-if="showChild" :class="parentId==1?'is-active':''">配件子列表</span>
        </div>
        <transition name="el-fade-in-linear" mode="out-in">
        <List ref="list" v-if="parentId==0"></List>
        <Material ref="material" v-if="parentId==1"></Material>
        </transition>
      </el-card>
    </div>
    </div>
</template>

<script>
  import List from '@/views/product/list/index.vue'
  import Material from '@/views/product/material/index.vue'
  export default {
        name: "Product",
      data() {
        return {
          parentId:0,
          showList:true,
          showChild:false
        }
      },
      methods: {

    },
    components:{
      List,
      Material
    }
  }
</script>

<style scoped>
</style>
<style lang="less">
  .product{
    height: 100%;
  .product-content{
    height: 100%;
    line-height: 27px;
  .line{
    width: 10px;
    height: 27px;
    background: #018EED;
    display: inline-block;
    float: left;
    margin: 0 26px;
  }
  h2{
    float: left;
    font-size: 20px;
    color: black;
    font-weight: bold;
  }
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
    height: 100%;
  }
  .el-card__body{
    padding: 10px 45px;
    height: 100%;
  }
  .table-content{
    .pagination{
      margin-top: 10px;
    }
  }
    .devider{
      margin: 0 0 20px 0;
      span{
        font-size: 14px;
        cursor: pointer;
      }
      .is-active{
        color:#409EFF;
      }
    }
  }
</style>
