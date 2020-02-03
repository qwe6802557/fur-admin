<template>
  <div class="produce">
    <div class="produce-content">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <i class="line"></i>
          <h2>生产列表</h2>
        </div>
        <div class="devider">
        </div>
        <List/>
      </el-card>
    </div>
  </div>
</template>

<script>
    import List from '@/views/produce/list'
    export default {
        name: "Produce",
        components:{
          List,
        },
    }
</script>

<style scoped>

</style>
<style lang="less">
  .produce{
    height: 100%;
  .produce-content{
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
